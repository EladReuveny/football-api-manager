import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../components/ConfirmDialog";
import PageTitle from "../components/PageTitle";
import ShowPassword from "../components/ShowPassword";
import ToggleSwitch from "../components/ToggleSwitch";
import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";
import { deleteUser, getProfile, updateUser } from "../services/userService";
import type { UpdateUser } from "../types/user/updateUser";
import type { User } from "../types/user/user";
import { handleError } from "../utils/utils";

type ProfileProps = {};

const Profile = ({}: ProfileProps) => {
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const deleteUserDialogRef = useRef<HTMLDialogElement | null>(null);

  const navigate = useNavigate();

  const { hash } = useLocation();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (err: unknown) {
        toast.info("Please login to view your profile");
        navigate("/auth/login");
        return;
      }
    };

    fetchProfile();
  }, []);

  const toggleIsEditing = () => setIsEditing((prev) => !prev);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user || !user.id) {
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const updateUserDto: UpdateUser = {
      email: (formData.get("email") as string) || undefined,
      newPassword: (formData.get("newPassword") as string) || undefined,
      confirmPassword: (formData.get("confirmPassword") as string) || undefined,
    };

    try {
      const data = await updateUser(user.id, updateUserDto);
      setUser(data);
      toggleIsEditing();
      toast.success("Profile updated successfully");
    } catch (err: unknown) {
      handleError(err);
    }
  };

  const handleDeleteUser = async () => {
    if (!user || !user.id) {
      return;
    }

    try {
      await deleteUser(user.id);
      logout();
      toast.success(`User ${user.email} deleted successfully`);
      navigate("/");
    } catch (err: unknown) {
      handleError(err);
    }
  };

  const openDeleteUserDialog = () => {
    deleteUserDialogRef.current?.showModal();
  };

  const closeDeleteUserDialog = () => {
    deleteUserDialogRef.current?.close();
  };

  return (
    <section className="grid grid-cols-[300px_1fr] gap-6">
      <aside className="sticky top-[75px] left-0 -my-20 bg-(--color-bg) h-screen overflow-y-auto border-r-2 border-gray-600 pt-4 pb-10 px-1">
        <nav>
          <h2 className="text-xl font-bold mb-4 px-1 uppercase">Profile</h2>
          <ul className="flex flex-col gap-4 text-gray-400">
            <li>
              <a
                href="#personal-information"
                className={`block py-1 px-2 rounded ${
                  hash === "#personal-information"
                    ? "bg-(--color-primary) text-(--color-bg) hover:text-(--color-bg)"
                    : "hover:text-(--color-text)"
                } `}
              >
                Personal Information
              </a>
            </li>
            <li>
              <a
                href="#account-settings"
                className={`block py-1 px-2 rounded ${
                  hash === "#account-settings"
                    ? "bg-(--color-primary) text-(--color-bg) hover:text-(--color-bg)"
                    : "hover:text-(--color-text)"
                } `}
              >
                Account Settings
              </a>
            </li>
            <li>
              <a
                href="#danger-zone"
                className={`block py-1 px-2 rounded ${
                  hash === "#danger-zone"
                    ? "bg-(--color-primary) text-(--color-bg) hover:text-(--color-bg)"
                    : "hover:text-(--color-text)"
                } `}
              >
                Danger Zone
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="overflow-x-hidden">
        <PageTitle title="Profile" />

        <div className="space-y-8 mt-4">
          <fieldset
            id="personal-information"
            className="border border-gray-700 bg-(--color-text)/10 p-4 rounded-lg"
          >
            <legend className="px-2 text-gray-400 text-sm uppercase tracking-wide font-bold">
              Personal Information
            </legend>
            <form onSubmit={handleProfileUpdate}>
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="floating-label-effect">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder=""
                        defaultValue={user?.email || ""}
                        autoComplete="email"
                        className="pl-9"
                      />
                      <label htmlFor="email" className="left-10">
                        New Email
                      </label>
                      <i className="fa-solid fa-envelope absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                    <div className="floating-label-effect">
                      <ShowPassword
                        id="newPassword"
                        name="newPassword"
                        label="New Password"
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="floating-label-effect">
                      <ShowPassword
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirm Password"
                        autoComplete="new-password"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="floating-label-effect cursor-not-allowed">
                      <input
                        type="email"
                        id="email"
                        value={user?.email || ""}
                        disabled
                        className="pl-9 opacity-70"
                      />
                      <label htmlFor="email" className="left-10">
                        Email
                      </label>
                      <i className="fa-solid fa-envelope absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                    <div className="floating-label-effect cursor-not-allowed">
                      <input
                        type="password"
                        id="password"
                        value="**********"
                        disabled
                        className="pl-9 opacity-70"
                      />
                      <label htmlFor="password" className="left-10">
                        Password
                      </label>
                      <i className="fa-solid fa-lock absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                  </>
                )}
              </div>
              <div className="flex gap-3 mt-3">
                {isEditing ? (
                  <>
                    <button
                      type="reset"
                      onClick={toggleIsEditing}
                      className="py-2 px-4 rounded border border-gray-600 text-gray-400 hover:backdrop-brightness-400"
                    >
                      <i className="fa-solid fa-ban mr-1"></i> Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 rounded border border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-(--color-text)"
                    >
                      <i className="fa-solid fa-floppy-disk mr-1"></i> Save
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={toggleIsEditing}
                    className="py-2 px-4 rounded border border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-(--color-text)"
                  >
                    <i className="fa-solid fa-pen-to-square mr-1"></i> Edit
                  </button>
                )}
              </div>
            </form>
          </fieldset>

          <fieldset
            id="account-settings"
            className="border border-gray-700 bg-(--color-text)/10 p-4 rounded-lg"
          >
            <legend className="px-2 text-gray-400 text-sm uppercase tracking-wide font-bold">
              Account Settings
            </legend>
            <ToggleSwitch
              id="darkMode"
              name="darkMode"
              label="Dark Mode"
              value={theme}
              activeValue="dark"
              inactiveValue="light"
              onToggle={toggleTheme}
              icons={{
                on: <i className="fa-solid fa-sun"></i>,
                off: <i className="fa-solid fa-moon"></i>,
              }}
            />
          </fieldset>

          <fieldset
            id="danger-zone"
            className="border border-red-500/60 bg-red-500/10 p-4 rounded-lg"
          >
            <legend className="px-2 text-gray-400 text-sm uppercase tracking-wide font-bold">
              Danger Zone
            </legend>

            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  Delete Account
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Deleting your account is permanent and cannot be undone. All
                  your data will be lost.
                </p>
              </div>

              <div className="self-end">
                <button
                  type="button"
                  onClick={openDeleteUserDialog}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-sm rounded-md hover:brightness-85"
                >
                  <i className="fa-solid fa-trash"></i>
                  Delete Account
                </button>
              </div>
            </div>
          </fieldset>
        </div>
      </main>

      <ConfirmDialog
        dialogRef={deleteUserDialogRef}
        message="This action is permanent and cannot be undone. Are you sure you want to delete your account "
        item={user?.email || ""}
        onConfirm={handleDeleteUser}
        onClose={closeDeleteUserDialog}
      />
    </section>
  );
};

export default Profile;
