import React from "react";
import { NavLink } from "react-router-dom";
import type { User } from "../types/user/user";

type MenuSideBarProps = {
  menuSideBar: React.RefObject<HTMLDialogElement | null>;
  toggleMenuSideBar: () => void;
  isMenuSideBarOpen: boolean;
  user: Partial<User> | null;
  adminManagementLinks: { to: string; label: string; icon?: React.ReactNode }[];
};

const MenuSideBar = ({
  menuSideBar,
  toggleMenuSideBar,
  isMenuSideBarOpen,
  user,
  adminManagementLinks,
}: MenuSideBarProps) => {
  return (
    <dialog
      ref={menuSideBar}
      className={`fixed top-0 left-0 bg-(--color-bg) text-(--color-text) w-[50vw] min-h-screen overflow-y-auto ${
        isMenuSideBarOpen
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-full"
      } backdrop:backdrop-brightness-75 backdrop:backdrop-blur-md`}
    >
      <button
        type="button"
        title="Close Menu"
        onClick={toggleMenuSideBar}
        className="cursor-pointer border rounded-full py-0.5 px-1 mt-4 mb-2 ml-2 hover:drop-shadow-[0_0_1px_var(--color-text)]"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>
      <ul className="flex flex-col gap-3 mb-3 px-2">
        <li>
          <NavLink
            to="/clubs"
            className={({ isActive }) =>
              `block py-1 border-b border-gray-600 hover:bg-(--color-primary)/20 ${
                isActive
                  ? "text-(--color-primary)"
                  : ""
              }`
            }
          >
            <i className="fas fa-shield mr-3"></i>Clubs
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/competitions"
            className={({ isActive }) =>
              `block py-1 border-b border-gray-600 hover:bg-(--color-primary)/20 ${
                isActive
                  ? "text-(--color-primary)"
                  : ""
              }`
            }
          >
            <i className="fas fa-trophy mr-3"></i>Competitions
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/countries"
            className={({ isActive }) =>
              `block py-1 border-b border-gray-600 hover:bg-(--color-primary)/20 ${
                isActive
                  ? "text-(--color-primary)"
                  : ""
              }`
            }
          >
            <i className="fas fa-flag mr-3"></i>Countries
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/players"
            className={({ isActive }) =>
              `block py-1 border-b border-gray-600 hover:bg-(--color-primary)/20 ${
                isActive
                  ? "text-(--color-primary)"
                  : ""
              }`
            }
          >
            <i className="fas fa-users mr-3"></i>Players
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/docs"
            className={({ isActive }) =>
              `block py-1 border-b border-gray-600 hover:bg-(--color-primary)/20 ${
                isActive ? "text-(--color-primary)" : ""
              }`
            }
          >
            <i className="fas fa-book mr-3"></i>Docs
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `block py-1 border-b border-gray-600 hover:bg-(--color-primary)/20 ${
                isActive ? "text-(--color-primary)" : ""
              }`
            }
          >
            <i className="fas fa-user mr-3"></i>Profile
          </NavLink>
        </li>
        {user?.role === "ADMIN" && (
          <li>
            <details className="group">
              <summary className="cursor-pointer py-1 hover:bg-(--color-primary)/20 flex justify-between items-center">
                <div>
                  <i className="fas fa-cogs mr-3"></i>
                  Admin
                </div>
                <i className="fas fa-chevron-right group-open:rotate-90 duration-300"></i>
              </summary>
              <ul className="flex flex-col px-4 border-l-2 border-(--color-primary)">
                {adminManagementLinks.map((item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `block py-1 ${
                          isActive ? "text-(--color-primary)" : ""
                        } hover:bg-(--color-primary)/20`
                      }
                    >
                      {item.icon}
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        )}
      </ul>
    </dialog>
  );
};

export default MenuSideBar;
