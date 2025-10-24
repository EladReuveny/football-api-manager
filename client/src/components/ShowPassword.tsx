import { useState } from "react";

type ShowPasswordProps = {
  autoComplete: "current-password" | "new-password";
};

const ShowPassword = ({ autoComplete }: ShowPasswordProps) => {
  const [showPassword, setshowPassword] = useState(false);

  const toggleShowPassword = () => {
    setshowPassword((prev) => !prev);
  };

  return (
    <>
      <input
        type={`${showPassword ? "text" : "password"}`}
        name="password"
        id="password"
        placeholder=""
        required
        autoComplete={autoComplete}
        className="pl-9"
      />

      <label htmlFor="password" className="left-10">Password <span className="text-red-500">*</span></label>
      <i className="fa-solid fa-lock absolute left-2 top-1/2 -translate-y-1/2"></i>
      <i
        onClick={toggleShowPassword}
        className={`fa-solid ${
          showPassword ? "fa-eye-slash" : "fa-eye"
        } absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-200 hover:brightness-120`}
      ></i>
    </>
  );
};

export default ShowPassword;
