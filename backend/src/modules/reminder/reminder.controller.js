import {
  createReminderService,
  getReceivedRemindersService,
  getSentRemindersService,
  replyToReminderService,
  getReminderUsersService,
  deleteReminderService
} from './reminder.service.js';
import { addEmailJob } from '../../helper/emailJobQueue.js';
import { reminderPayload } from '../../other/EmailPayload.js';

// Create a new reminder
export async function createReminder(req, res) {
  const { to, subject, message, sendOnEmail } = req.body;
  const senderId = req.user.email;
  if (!to || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  const reminder = await createReminderService({ to, subject, message, sendOnEmail, senderId });
  if (reminder && sendOnEmail) {
    addEmailJob(reminderPayload({ to, subject, message }));
  }
  res.status(201).json(reminder);
}

// Get reminders received by a user
export async function getReceivedReminders(req, res) {
  const userId = req.user.email;
  if (!userId) return res.status(400).json({ error: 'User is required.' });
  const reminders = await getReceivedRemindersService(userId);
  res.json(reminders);
}

// Get reminders sent by a user
export async function getSentReminders(req, res) {
  const userId = req.user.email;
  if (!userId) return res.status(400).json({ error: 'User is required.' });
  const reminders = await getSentRemindersService(userId);
  res.json(reminders);
}

// Reply to a received reminder (only once)
export async function replyToReminder(req, res) {
  const { id } = req.params;
  const { response } = req.body;
  const reminder = await replyToReminderService(id, response);
  res.json(reminder);
}

// Fetch all users (id, name, email) for reminders
export async function getReminderUsers(req, res) {
  const users = await getReminderUsersService();
  res.json(users);
}

export async function deleteReminderUser(req, res) {
  const id = req.params.id;

  try {
    const result = await deleteReminderService(id);

    res.status(200).json({
      success: true,
      message: 'Reminder deleted successfully',
      data: result
    });

  } catch (error) {

    if (error.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });

    } else {
      res.status(500).json({
        success: false,
        message: 'An error occurred',
        error: error.message
      });
    }
  }
}
