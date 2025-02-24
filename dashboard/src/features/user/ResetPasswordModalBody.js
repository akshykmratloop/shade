import { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../components/Input/InputText";
import ErrorText from "../../components/Typography/ErrorText";
import Joi from "joi"; // Import Joi for validation
// import { addNewLead } from "./leadSlice"

const passwordSchema = Joi.string()
  .min(8)
  .max(30)
  .pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  )
  .required()
  .messages({
    "string.empty": "Required",
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password must be at most 30 characters",
    "string.pattern.base":
      "Password must contain at least one lowercase letter, one uppercase letter, one digit and one special character",
  });

function ResetPasswordModalBody({ closeModal }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [formValues, setFormValues] = useState({
    old_password: "",
    new_password: "",
    repeat_password: "",
  });

  const validateForm = () => {
    const { error } = Joi.object({
      old_password: passwordSchema,
      new_password: passwordSchema,
      repeat_password: Joi.any()
        .valid(Joi.ref("new_password"))
        .required()
        .messages({
          "any.only": "Passwords do not match",
        }),
    }).validate(formValues, { abortEarly: false });

    if (error) {
      console.log(error.details, "error===============");
      const errorsObject = error.details.reduce((acc, detail) => {
        acc[detail.context.key] = detail.message;
        return acc;
      }, {});
      setErrorMessages(errorsObject);
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) console.log(errorMessages, "error");
    return;

    alert("success");

    // Dispatch action to reset password
    // dispatch(showNotification({ message: "Password reset successful!", status: 1 }))
    // closeModal()
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessages((prevErrors) => ({ ...prevErrors, [updateType]: "" }));
    setFormValues({ ...formValues, [updateType]: value });
  };

  return (
    <>
      <div>
        <InputText
          type="password"
          defaultValue={formValues.old_password}
          updateType="old_password"
          containerStyle="mt-4"
          labelTitle="Old Password"
          updateFormValue={updateFormValue}
        />
        <ErrorText styleClass="mt-16" error={errorMessages.old_password}>
          {errorMessages.old_password}
        </ErrorText>
      </div>

      <div>
        <InputText
          type="password"
          defaultValue={formValues.new_password}
          updateType="new_password"
          containerStyle="mt-4"
          labelTitle="New Password"
          updateFormValue={updateFormValue}
        />
        <ErrorText styleClass="mt-16" error={errorMessages.new_password}>
          {errorMessages.new_password}
        </ErrorText>
      </div>

      <div>
        <InputText
          type="password"
          defaultValue={formValues.repeat_password}
          updateType="repeat_password"
          containerStyle="mt-4"
          labelTitle="Repeat Password"
          updateFormValue={updateFormValue}
        />
        <ErrorText styleClass="mt-16" error={errorMessages.repeat_password}>
          {errorMessages.repeat_password}
        </ErrorText>
      </div>

      <div className="modal-action">
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Cancel
        </button>
        <button className="btn btn-primary px-6" onClick={() => handleSubmit()}>
          Submit
        </button>
      </div>
    </>
  );
}

export default ResetPasswordModalBody;
