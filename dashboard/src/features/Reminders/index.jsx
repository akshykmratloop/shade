import { useState, useEffect } from 'react';
import TitleCard from '../../components/Cards/TitleCard';
import Subtitle from '../../components/Typography/Subtitle';
import ToogleInput from '../../components/Input/ToogleInput';
import Select from '../../components/Input/Select';
import InputText from '../../components/Input/InputText';
import TextAreaInput from '../../components/Input/TextAreaInput';
import ErrorText from '../../components/Typography/ErrorText';
import ToggleSwitch from '../../components/Toggle/Toggle';
import { createReminder, getReceivedReminders, getSentReminders, replyToReminder, getReminderUsers } from '../../app/fetch';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function Reminders() {
  // Assume userId is available from localStorage or context
  const userId = localStorage.getItem('user');
  const [tab, setTab] = useState('Received');
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [replyMsg, setReplyMsg] = useState('');
  const [newReminder, setNewReminder] = useState({ to: '', subject: '', message: '', sendOnEmail: false });
  const [toSelect, setToSelect] = useState(false); // false = manual, true = select
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [userOptions, setUserOptions] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showMessage, setShowMessage] = useState({ type: '', text: '' }); // type: 'success' | 'error'
  const [sendLoading, setSendLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);

  // Fetch reminders from backend when tab changes
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    if (tab === 'Received') {
      getReceivedReminders().then(res => {
        setReceived(res.ok ? res : []);
        setLoading(false);
      });
    } else {
      getSentReminders().then(res => {
        setSent(res.ok ? res : []);
        setLoading(false);
      });
    }
  }, [tab, userId]);

  // Fetch user list for reminder creation
  useEffect(() => {
    if (!showCreate) return;
    setUserLoading(true);
    getReminderUsers().then(res => {
      setUserOptions(res.ok ? res : []);
      setUserLoading(false);
    });
  }, [showCreate]);

  // For email toggle in create form
  const handleEmailToggle = (option) => {
    setNewReminder(prev => ({ ...prev, sendOnEmail: option === 'Yes' }));
  };

  const handleDelete = (id) => {
    // Optionally implement delete API
    if (tab === 'Received') {
      setReceived(received.filter(r => r.id !== id));
      if (selected && selected.id === id) setSelected(null);
    } else {
      setSent(sent.filter(r => r.id !== id));
      if (selected && selected.id === id) setSelected(null);
    }
  };

  const handleReply = async () => {
    if (!selected) return;
    setReplyLoading(true);
    setShowMessage({ type: '', text: '' });
    try {
      const res = await replyToReminder(selected.id, replyMsg);
      setReplyLoading(false);
      if (res && res.ok) {
        setReceived(received.map(r => r.id === selected.id ? res : r));
        setSelected(res);
        setReplyMsg('');
        setShowMessage({ type: 'success', text: 'Reply sent successfully!' });
        setTimeout(() => setShowMessage({ type: '', text: '' }), 3000);
      } else {
        setShowMessage({ type: 'error', text: res?.message || 'Failed to send reply.' });
        setTimeout(() => setShowMessage({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      setReplyLoading(false);
      setShowMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to send reply.' });
      setTimeout(() => setShowMessage({ type: '', text: '' }), 4000);
    }
  };

  const validate = () => {
    const errs = {};
    if (!newReminder.to) errs.to = ' Required.';
    if (!newReminder.subject) errs.subject = ' Required.';
    if (!newReminder.message) errs.message = 'Required.';
    return errs;
  };

  const handleCreate = async () => {
    setShowValidation(true);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSendLoading(true);
    setShowMessage({ type: '', text: '' });
    const data = {
      to: newReminder.to,
      subject: newReminder.subject,
      message: newReminder.message,
      sendOnEmail: newReminder.sendOnEmail,
    };
    try {
      const res = await createReminder(data);
      setSendLoading(false);
      if (res && res.ok) {
        
        setSent([res, ...sent]);
        setShowCreate(false);
        setNewReminder({ to: '', subject: '', message: '', sendOnEmail: true });
        setErrors({});
        setShowValidation(false);
        setShowMessage({ type: 'success', text: 'Reminder sent successfully!' });
        setTimeout(() => setShowMessage({ type: '', text: '' }), 3000);
      } else {
        setShowMessage({ type: 'error', text: res?.message || 'Failed to send reminder.' });
        setTimeout(() => setShowMessage({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      setSendLoading(false);
      setShowMessage({ type: 'error', text: err?.response.data.message || 'Failed to send reminder.' });
      setTimeout(() => setShowMessage({ type: '', text: '' }), 4000);
    }
  };

  const handleFormValue = ({ updateType, value }) => {
    setNewReminder(prev => ({ ...prev, [updateType]: value }));
    setErrors(prev => ({ ...prev, [updateType]: undefined }));
  };

  // When toggling between manual/select, reset the 'to' value
  const handleToSelectToggle = (value) => {
    setToSelect(value);
    setNewReminder(prev => ({ ...prev, to: '' }));
  };

  // Tab data
  const reminders = tab === 'Received' ? received : sent;

  return (
    <>
      {showMessage.text && (
        <div className={`fixed top-6 right-6 z-[9999] px-4 py-3 rounded-lg shadow-lg text-sm font-semibold transition-all
          ${showMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {showMessage.text}
        </div>
      )}
      <TitleCard title="Reminders" topMargin="mt-2">
        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-6 pb-2">
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold transition-all ${tab === 'Received' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'bg-base-100 text-gray-500 dark:text-gray-400'}`}
            onClick={() => { setTab('Received'); setSelected(null); }}
          >
            Received
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold transition-all ${tab === 'Sent' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'bg-base-100 text-gray-500 dark:text-gray-400'}`}
            onClick={() => { setTab('Sent'); setSelected(null); }}
          >
            Sent
          </button>
          <div className="flex-1" />
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            + New Reminder
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-6 h-full">
          {/* List */}
          <div className="md:w-1/3 w-full bg-base-100 rounded-2xl shadow-md-custom p-0 flex flex-col">
            <Subtitle styleClass="px-6 pt-2 pb-2 text-base text-gray-700 dark:text-gray-200">{tab} Reminders</Subtitle>
            <ul className="overflow-y-auto customscroller flex-1 divide-y divide-gray-100 dark:divide-stone-700">
              {loading && <li className="p-6 text-center text-gray-400">Loading...</li>}
              {reminders.length === 0 && !loading && (
                <li className="p-6 text-center text-gray-400">No reminders</li>
              )}
              {reminders.map(r => (
                <li
                  key={r.id}
                  className={`px-6 py-4 cursor-pointer transition-all duration-150 ${selected?.id === r.id ? 'bg-blue-50 dark:bg-blue-900/40' : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
                  onClick={() => setSelected(r)}
                >
                  <div className="font-semibold text-[15px] truncate">{r.subject}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-300 truncate">{tab === 'Received' ? `From: ${r.senderId}` : `To: ${r.receiverId}`}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</div>
                  {/* Optionally add delete logic here */}
                </li>
              ))}
            </ul>
          </div>
          {/* Details & Reply/Response */}
          <div className="flex-1 bg-base-100 rounded-2xl shadow-md-custom p-0 flex flex-col">
            <Subtitle styleClass="px-6 pt-2 pb-2 text-base text-gray-700 dark:text-gray-200">Reminder Details</Subtitle>
            <div className="flex-1 px-6 pb-6 pt-2 flex flex-col">
              {selected ? (
                tab === 'Received' ? (
                  <>
                    <div className="mb-2"><span className="font-semibold">From:</span> {selected.senderId}</div>
                    <div className="mb-2"><span className="font-semibold">Subject:</span> {selected.subject}</div>
                    {/* <div className="mb-2"><span className="font-semibold">Resource:</span> {selected.resource}</div> */}
                    <div className="mb-4"><span className="font-semibold">Message:</span> <span className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: selected.message }} /></div>
                    {selected.replied ? (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded p-3 mt-2">
                        <span className="font-semibold">Your Reply:</span> {selected.response}
                      </div>
                    ) : (
                      <div className="mt-auto">
                        <textarea
                          className="w-full border border-gray-200 dark:border-stone-700 rounded-lg p-2 mt-2 bg-base-100 dark:bg-stone-800 text-sm"
                          rows={3}
                          placeholder="Type your reply..."
                          value={replyMsg}
                          onChange={e => setReplyMsg(e.target.value)}
                          disabled={selected.replied}
                        />
                        <button className="btn btn-success mt-2 float-right" onClick={handleReply} disabled={selected.replied || !replyMsg.trim() || replyLoading}>
                          {replyLoading ? <span className="loader mr-2"></span> : null}Reply
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="mb-2"><span className="font-semibold">To:</span> {selected.receiverId}</div>
                    <div className="mb-2"><span className="font-semibold">Subject:</span> {selected.subject}</div>
                    {/* <div className="mb-2"><span className="font-semibold">Resource:</span> {selected.resource}</div> */}
                    <div className="mb-4"><span className="font-semibold">Message:</span> <span className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: selected.message }} /></div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3 mt-2">
                      <span className="font-semibold">Response:</span> {selected.response ? selected.response : <span className="italic text-gray-400">No response yet.</span>}
                    </div>
                  </>
                )
              ) : (
                <div className="text-gray-400 dark:text-gray-500 flex-1 flex items-center justify-center">Select a reminder to view details.</div>
              )}
            </div>
          </div>
        </div>
        {/* Create New Reminder Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="w-full max-w-2xl bg-white dark:bg-[#181a20] border border-gray-300 dark:border-stone-700 p-0 rounded-none shadow-none">
              {/* Slim Top Bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-900 dark:bg-[#23272f] text-white border-b border-gray-700 dark:border-stone-800" style={{minHeight:'40px'}}>
                <span className="font-semibold text-sm">Create New Reminder</span>
                <button
                  type="button"
                  className="text-gray-300 hover:text-white text-xl font-bold focus:outline-none"
                  onClick={() => { setShowCreate(false); setErrors({}); setShowValidation(false); }}
                  aria-label="Close"
                  style={{lineHeight:'1'}}
                >
                  &times;
                </button>
              </div>
              {/* Toggles Row */}
              <div className="flex items-center justify-start w-full gap-4 px-4 py-1 border-b border-gray-200 dark:border-stone-700 bg-transparent">
                <div className="flex items-center gap-1 text-xs">
                  Manual
                  <ToogleInput labelTitle="" defaultValue={toSelect} updateFormValue={({ value }) => handleToSelectToggle(value)} />
                  Select
                </div>
                <div className="flex items-center gap-1 text-xs ">
                  Send on Email
                  <ToogleInput labelTitle="" defaultValue={newReminder.sendOnEmail} updateFormValue={({ value }) => setNewReminder(prev => ({ ...prev, sendOnEmail: value }))} />
                  <span className={`font-semibold ${newReminder.sendOnEmail ? 'text-green-500' : 'text-gray-400'}`}>{newReminder.sendOnEmail ? 'Yes' : 'No'}</span>
                </div>
              </div>
              <form onSubmit={e => { e.preventDefault(); handleCreate(); }} className="px-4 pt-2 pb-3">
                {/* To Field */}
                {!toSelect ? (
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[48px]">To:</span>
                    <input
                      type="text"
                      placeholder="Enter recipient email"
                      value={newReminder.to}
                      onChange={e => handleFormValue({ updateType: 'to', value: e.target.value })}
                      className="flex-1 bg-transparent border-0 border-b border-gray-300 dark:border-stone-700 focus:ring-0 focus:border-blue-500 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-none px-0 py-1"
                      autoComplete="off"
                    />
                    {showValidation && errors.to && <ErrorText>{errors.to}</ErrorText>}
                  </div>
                ) : (
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[48px]">To:</span>
                    <Select
                      options={userOptions.map(u => ({ id: u.email, name: `${u.name} (${u.email})` }))}
                      setterOnChange={(field, value) => handleFormValue({ updateType: 'to', value })}
                      value={newReminder.to}
                      label=""
                      labelClass="hidden"
                      selectClass="flex-1 bg-transparent border-0 border-b border-gray-300 dark:border-stone-700 focus:border-b-blue-500 focus:border-0 focus:outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-none px-0 py-1"
                    />
                    {userLoading && <div className="text-xs text-gray-400 mt-1">Loading users...</div>}
                    {showValidation && errors.to && <ErrorText>{errors.to}</ErrorText>}
                  </div>
                )}
                {/* Subject Field */}
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[48px]">Subject:</span>
                  <input
                    type="text"
                    placeholder="Enter subject"
                    value={newReminder.subject}
                    onChange={e => handleFormValue({ updateType: 'subject', value: e.target.value })}
                    className="flex-1 bg-transparent border-0 border-b border-gray-300 dark:border-stone-700 focus:ring-0 focus:border-blue-500 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-none px-0 py-1"
                    autoComplete="off"
                  />
                  {showValidation && errors.subject && <ErrorText>{errors.subject}</ErrorText>}
                </div>
                {/* Rich Text Editor for Body */}
                <div className="mb-0 pb-[50px] relative">
                  <ReactQuill
                    theme="snow"
                    value={newReminder.message}
                    onChange={value => handleFormValue({ updateType: 'message', value })}
                    modules={{
                      toolbar: {
                        container: [
                          [{ 'header': [1, 2, false] }],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          ['link', 'image'],
                          ['clean']
                        ],
                        handlers: {}
                      }
                    }}
                    className="bg-transparent border-0 rounded-none shadow-none"
                    style={{minHeight:'200px', height:'200px'}}
                  />
                  {showValidation && errors.message && <ErrorText styleClass="absolute right-0 bottom-[-10px]" >{errors.message}</ErrorText>}
                </div>
                {/* Send Button Bottom Left */}
                <div className="flex justify-start mt-0">
                  <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-none transition-all" disabled={sendLoading}>
                    {sendLoading ? <span className="loader mr-2"></span> : null}Send
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </TitleCard>
    </>
  );
}

export default Reminders; 