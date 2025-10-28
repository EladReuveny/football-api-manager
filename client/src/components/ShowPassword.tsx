import { useState } from "react";

type ShowPasswordProps = {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  autoComplete?: "password" | "current-password" | "new-password";
};

const ShowPassword = ({
  id,
  name,
  label,
  required = false,
  autoComplete = "current-password",
}: ShowPasswordProps) => {
  const [showPassword, setshowPassword] = useState(false);

  const toggleShowPassword = () => {
    setshowPassword((prev) => !prev);
  };

  return (
    <>
      <input
        type={`${showPassword ? "text" : "password"}`}
        id={id}
        name={name}
        placeholder=""
        required={required}
        autoComplete={autoComplete}
        className="pl-9"
      />

      <label htmlFor={id} className="left-10">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <i className="fa-solid fa-lock absolute left-2 top-1/2 -translate-y-1/2"></i>
      <i
        onClick={toggleShowPassword}
        className={`fa-solid ${
          showPassword ? "fa-eye-slash" : "fa-eye"
        } absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-200 hover:brightness-120`}
        title={showPassword ? "Hide Password" : "Show Password"}
      ></i>
    </>
  );
};

export default ShowPassword;
