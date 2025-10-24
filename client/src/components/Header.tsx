import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import MenuSideBar from "./MenuSideBar";
import NavBar from "./NavBar";

type HeaderProps = {};

const Header = ({}: HeaderProps) => {
  const [isMenuSideBarOpen, setIsMenuSideBarOpen] = useState(false);

  const location = useLocation();

  const menuSideBar = useRef<HTMLDialogElement | null>(null);

  const { auth, logout: logout } = useAuth();
  const user = auth?.user || null;

  const adminManagementLinks: {
    to: string;
    label: string;
    icon?: React.ReactNode;
  }[] = [
    {
      to: "/admin/clubs",
      label: "Clubs",
      icon: <i className="fas fa-shield mr-3"></i>,
    },
    {
      to: "/admin/competitions",
      label: "Competitions",
      icon: <i className="fas fa-trophy mr-3"></i>,
    },
    {
      to: "/admin/countries",
      label: "Countries",
      icon: <i className="fas fa-flag mr-3"></i>,
    },
    {
      to: "/admin/players",
      label: "Players",
      icon: <i className="fas fa-users mr-3"></i>,
    },
    {
      to: "/admin/users",
      label: "Users",
      icon: <i className="fas fa-users mr-3"></i>,
    },
  ];

  useEffect(() => {
    if (isMenuSideBarOpen) {
      menuSideBar?.current?.close();
      setIsMenuSideBarOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuSideBarOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuSideBarOpen(false);
      }
    };

    const handleDialogOutsideClick = (e: MouseEvent) => {
      const isClickedBackground = menuSideBar.current === e.target;
      if (isClickedBackground) {
        setIsMenuSideBarOpen(false);
        menuSideBar?.current?.close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    menuSideBar.current?.addEventListener("click", handleDialogOutsideClick);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      menuSideBar.current?.removeEventListener(
        "click",
        handleDialogOutsideClick
      );
    };
  }, [isMenuSideBarOpen]);

  const toggleMenuSideBar = () => {
    if (isMenuSideBarOpen) {
      menuSideBar?.current?.close();
      setIsMenuSideBarOpen(false);
    } else {
      menuSideBar.current?.showModal();
      setIsMenuSideBarOpen(true);
    }
  };

  return (
    <header className="fixed top-0 z-100 w-full bg-(--color-bg)/50 backdrop-blur-md px-2">
      <NavBar
        toggleMenuSideBar={toggleMenuSideBar}
        user={user}
        logout={logout}
      />

      <MenuSideBar
        menuSideBar={menuSideBar}
        toggleMenuSideBar={toggleMenuSideBar}
        isMenuSideBarOpen={isMenuSideBarOpen}
        user={user}
        adminManagementLinks={adminManagementLinks}
      />
    </header>
  );
};

export default Header;
