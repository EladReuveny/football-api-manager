import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../components/ConfirmDialog";
import PageTitle from "../components/PageTitle";
import Pagination from "../components/Pagination";
import { deleteUser, getAllUsers } from "../services/userService";
import type { PaginationQuery } from "../types/common/paginationQuery";
import type { PaginationResponse } from "../types/common/paginationResponse";
import type { Role } from "../types/user/role";
import type { User } from "../types/user/user";
import { handleError } from "../utils/utils";

type UsersManagementProps = {};

const UsersManagement = ({}: UsersManagementProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Omit<
    PaginationResponse<User>,
    "items"
  > | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : undefined;
  const limit = searchParams.get("limit")
    ? Number(searchParams.get("limit"))
    : undefined;

  const roles: {
    value: Role;
    label: string;
  }[] = [
    { value: "USER", label: "User" },
    { value: "ADMIN", label: "Admin" },
  ];

  const deleteUserDialog = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const query: PaginationQuery = { page: page, limit };

      try {
        const data = await getAllUsers(query);
        setUsers(data.items);
        const { items, ...result } = data;
        setPagination(result);
      } catch (err) {
        handleError(err);
      }
    };

    fetchUsers();
  }, [page, limit]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page), limit: String(pagination?.limit) });
  };

  const showDeleteUserDialog = (user: User) => {
    setUserToDelete(user);
    deleteUserDialog?.current?.showModal();
  };

  const closeDeleteUserDialog = () => {
    setUserToDelete(null);
    deleteUserDialog?.current?.close();
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) {
      return;
    }

    try {
      await deleteUser(userToDelete.id);
      setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
      setUserToDelete(null);
      closeDeleteUserDialog();
      toast.success(`${userToDelete.email} deleted successfully.`);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <section className="px-1">
      <PageTitle title="Users Management" />

      <table className="w-full text-center align-middle font-bold mt-6">
        <thead className="bg-(--color-text) text-(--color-bg)">
          <tr className="font-bold">
            <th>#</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Created</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.id}
              className="border-b border-gray-500 odd:bg-(--color-text)/10 even:bg-(--color-text)/20 hover:bg-(--color-primary)/50"
            >
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">
                <select
                  name="roles-options"
                  id="roles-options"
                  defaultValue={user.role}
                  className="bg-(--color-text) text-(--color-bg) py-2 px-4 rounded appearance-none hover:bg-(--color-bg) hover:text-(--color-text)"
                >
                  {roles.map((role, index) => (
                    <option key={index} value={role.value} disabled>
                      {role.label}
                    </option>
                  ))}
                </select>
              </td>
              <td
                title={`Created At: ${new Date(
                  user.createdAt
                ).toLocaleString()}`}
                className="p-2"
              >
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="p-2">
                <div className="flex justify-center items-center gap-3">
                  <button
                    onClick={() => showDeleteUserDialog(user)}
                    className="text-red-500 hover:brightness-200"
                    title="Delete"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8 flex flex-col items-center gap-3">
        <Pagination
          pagination={pagination}
          onPageChange={(page) => handlePageChange(page)}
        />

        <div className="text-center text-gray-400 text-sm">
          <p>
            Found <b>{users.length}</b>{" "}
            {users.length === 1 ? "result" : "results"} out of{" "}
            <b>{pagination?.totalItems}</b>
          </p>
          <p>
            Page <b>{page || 1}</b> out of <b>{pagination?.totalPages}</b>
          </p>
        </div>
      </div>

      <ConfirmDialog
        dialogRef={deleteUserDialog}
        message="Are you sure you want to delete the user "
        item={userToDelete?.email || ""}
        onConfirm={handleDeleteUser}
        onClose={closeDeleteUserDialog}
      />
    </section>
  );
};

export default UsersManagement;
