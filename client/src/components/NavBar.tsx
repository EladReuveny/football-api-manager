import { Link } from "react-router-dom";
import type { User } from "../types/user/user";
import Logo from "./Logo";

type NavBarProps = {
  toggleMenuSideBar: () => void;
  user: Partial<User> | null;
  logout: () => void;
};

const NavBar = ({ toggleMenuSideBar, user, logout: logout }: NavBarProps) => {
  return (
    <nav className="flex justify-between items-center">
      <button
        type="button"
        title="Open Menu"
        onClick={toggleMenuSideBar}
        className="cursor-pointer border rounded-full py-0.5 px-1 hover:drop-shadow-[0_0_1px_var(--color-text)]"
      >
        <i className="fa-solid fa-bars"></i>
      </button>
      <Link to={"/"} className="hover:drop-shadow-[0_0_1px_var(--color-text)]">
        <Logo />
      </Link>
      {user ? (
        <Link
          to={"/auth/login"}
          className="py-2 px-3 border border-(--color-primary) bg-(--color-primary) text-(--color-bg) rounded hover:bg-(--color-bg) hover:text-(--color-primary)"
          onClick={logout}
        >
          <i className="fas fa-sign-out-alt mr-2"></i>Logout
        </Link>
      ) : (
        <div className="flex gap-2">
          <Link
            to={"/auth/register"}
            className="py-2 px-3 border border-(--color-primary) text-(--color-primary) rounded hover:backdrop-brightness-400"
          >
            <i className="fas fa-user-plus mr-2"></i>Register
          </Link>
          <Link
            to={"/auth/login"}
            className="py-2 px-3 border border-(--color-primary) bg-(--color-primary) text-(--color-bg) rounded hover:brightness-110"
          >
            <i className="fas fa-sign-in-alt mr-2"></i>Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
