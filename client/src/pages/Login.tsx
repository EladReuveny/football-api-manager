import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Auth2Provider from "../components/Auth2Provider";
import Logo from "../components/Logo";
import ShowPassword from "../components/ShowPassword";
import useAuth from "../hooks/useAuth";
import { loginUser } from "../services/authService";
import type { LoginUser } from "../types/auth/loginUser";
import { handleError } from "../utils/utils";

type LoginProps = {};

const Login = ({}: LoginProps) => {
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const user: LoginUser = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const data = await loginUser(user);
      login(data);
      toast.success("Logged in successfully");
      navigate("/");
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
        Welcome back,{" "}
        <span className="underline underline-offset-4 decoration-5 decoration-(--color-primary)">
          Login
        </span>{" "}
        to Football API Manager
      </h1>

      <div className="flex gap-2.5 mt-4">
        <NavLink
          to="/auth/login"
          className={({ isActive }) =>
            `py-2 px-14 rounded font-bold ${
              isActive
                ? "bg-(--color-primary) hover:brightness-110"
                : "text-gray-300 border border-gray-600 hover:backdrop-brightness-400"
            }`
          }
        >
          Login
        </NavLink>

        <NavLink
          to="/auth/register"
          className={({ isActive }) =>
            `py-2 px-14 rounded font-bold ${
              isActive
                ? "bg-(--color-primary) hover:brightness-110"
                : "text-gray-300 border border-gray-600 hover:backdrop-brightness-400"
            }`
          }
        >
          Register
        </NavLink>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="w-1/3">
        <div className="floating-label-effect mt-4 mb-2">
          <input
            type="email"
            name="email"
            id="email"
            placeholder=""
            required
            autoFocus
            autoComplete="email"
            className="pl-9"
          />

          <label htmlFor="email" className="left-10">
            Email <span className="text-red-500">*</span>
          </label>
          <i className="fa-solid fa-envelope absolute left-2 top-1/2 -translate-y-1/2"></i>
        </div>

        <div className="floating-label-effect mb-0.5">
          <ShowPassword
            id="password"
            name="password"
            label="Password"
            required
            autoComplete="current-password"
          />
        </div>

        <Link
          to="/auth/forgot-password"
          className="text-sm text-gray-300 underline hover:brightness-120"
        >
          Forgot Password?
        </Link>

        <button
          type="submit"
          className="w-full mt-3 text-lg bg-(--color-primary) font-bold py-2 rounded hover:brightness-110"
        >
          <i className="fa-solid fa-right-to-bracket mr-2 align-middle"></i>
          Login
        </button>

        <Auth2Provider />
      </form>
    </section>
  );
};

export default Login;
