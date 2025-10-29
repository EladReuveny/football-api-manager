import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../components/Logo";
import ShowPassword from "../components/ShowPassword";
import { requestPasswordReset, resetPassword } from "../services/authService";
import type { ResetPassword } from "../types/auth/resetPassword";
import { handleError } from "../utils/utils";

type ForgotPasswordProps = {};

const ForgotPassword = ({}: ForgotPasswordProps) => {
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const handleContinue = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const button = e.target as HTMLButtonElement;
    const form = button.closest("form") as HTMLFormElement;
    const formData = new FormData(form);

    const requestResetPassword = {
      email: formData.get("email") as string,
    };

    try {
      await requestPasswordReset(requestResetPassword);
      setIsSuccess(true);
    } catch (err: unknown) {
      handleError(err);
    }
  };

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const resetPasswordDto: ResetPassword = {
      email: formData.get("email") as string,
      newPassword: formData.get("newPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    try {
      const data = await resetPassword(resetPasswordDto);
      console.log(data);
      toast.success("Password reset successfully, please login.");
      navigate("/auth/login");
    } catch (err: unknown) {
      handleError(err);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center -mt-20">
      <Link to={"/"}>
        <Logo width={150} height={150} />
      </Link>

      <h1 className="font-bold text-4xl">
        <span className="underline underline-offset-4 decoration-5 decoration-(--color-primary)">
          Reset Password
        </span>{" "}
        to your account
      </h1>

      <button
        type="button"
        onClick={() => navigate(-1)}
        title="Go Back"
        className="text-gray-300 mt-2 hover:brightness-150"
      >
        <i className="fa-solid fa-arrow-left mr-1"></i> Go Back
      </button>

      <form onSubmit={(e) => handleReset(e)} className="w-1/3">
        <div className="space-y-4 mt-4">
          <div className="floating-label-effect">
            <input
              type="email"
              name="email"
              id="email"
              placeholder=""
              required
              autoFocus
              autoComplete="email"
              readOnly={isSuccess}
              className="pl-9"
            />
            <label htmlFor="email" className="left-10">
              Email <span className="text-red-500">*</span>
            </label>
            <i className="fa-solid fa-envelope absolute left-2 top-1/2 -translate-y-1/2"></i>
          </div>
          {isSuccess && (
            <>
              <div className="floating-label-effect">
                <ShowPassword
                  id="newPassword"
                  name="newPassword"
                  label="New Password"
                  autoComplete="new-password"
                  required
                />
              </div>
              <div className="floating-label-effect">
                <ShowPassword
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  autoComplete="new-password"
                  required
                />
              </div>
            </>
          )}
        </div>

        {isSuccess ? (
          <button
            key="reset"
            type="submit"
            className="w-full mt-3 text-lg bg-(--color-primary) font-bold py-2 rounded hover:brightness-110"
          >
            <i className="fa-solid fa-key mr-2 align-middle"></i>
            Reset
          </button>
        ) : (
          <button
            key="continue"
            type="button"
            onClick={(e) => handleContinue(e)}
            className="w-full mt-3 text-lg bg-(--color-primary) font-bold py-2 rounded hover:brightness-110"
          >
            <i className="fa-solid fa-arrow-right mr-2 align-middle"></i>
            Continue
          </button>
        )}
      </form>
    </section>
  );
};

export default ForgotPassword;
