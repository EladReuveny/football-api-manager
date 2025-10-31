import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../components/ConfirmDialog";
import FormDialog from "../components/FormDialog";
import PageTitle from "../components/PageTitle";
import SearchFilterBar from "../components/SearchFilterBar";
import {
  createClub,
  deleteClub,
  getAllClubs,
  updateClub,
} from "../services/clubService";
import { getAllCountries } from "../services/countryService";
import type { Club } from "../types/club/club";
import type { CreateClub } from "../types/club/createClub";
import type { UpdateClub } from "../types/club/updateClub";
import type { PaginationQuery } from "../types/common/paginationQuery";
import type { PaginationResponse } from "../types/common/paginationResponse";
import type { Country } from "../types/countries/country";
import { handleError } from "../utils/utils";
import Pagination from "../components/Pagination";

type ClubsManagementProps = {};

const ClubsManagement = ({}: ClubsManagementProps) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [pagination, setPagination] = useState<Omit<
    PaginationResponse<Club>,
    "items"
  > | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [clubToDelete, setClubToDelete] = useState<Club | null>(null);
  const [clubToEdit, setClubToEdit] = useState<Club | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : undefined;
  const limit = searchParams.get("limit")
    ? Number(searchParams.get("limit"))
    : undefined;

  const addClubDialog = useRef<HTMLDialogElement | null>(null);
  const editClubDialog = useRef<HTMLDialogElement | null>(null);
  const deleteClubDialog = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const fetchClubs = async () => {
      const query: PaginationQuery = { page: page, limit };

      try {
        const data = await getAllClubs(query);
        setClubs(data.items);
        const { items, ...result } = data;
        setPagination(result);
      } catch (err: unknown) {
        handleError(err);
      }
    };

    const fetchCountries = async () => {
      try {
        const data = await getAllCountries();
        setCountries(data.items);
      } catch (err: unknown) {
        handleError(err);
      }
    };

    fetchClubs();
    fetchCountries();
  }, [page, limit]);

  useEffect(() => {
    const searchTerm = searchQuery.trim().toLowerCase();
    if (!searchTerm) {
      setFilteredClubs(clubs);
      return;
    }

    const filtered = clubs.filter((club) =>
      club.name.toLowerCase().includes(searchTerm)
    );

    setFilteredClubs(filtered);
  }, [searchQuery, clubs]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page), limit: String(pagination?.limit) });
  };

  const handleAddClub = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const createClubDto: CreateClub = {
      name: formData.get("name") as string,
      logoUrl: formData.get("logoUrl") as string,
      establishedAt: new Date(formData.get("establishedAt") as string),
      countryId: Number(formData.get("country")) as number,
    };

    try {
      const data = await createClub(createClubDto);
      setClubs((prev) => [...prev, data]);
      closeAddClubDialog();
      toast.success(`${createClubDto.name} added successfully.`);
    } catch (err: unknown) {
      closeAddClubDialog();
      handleError(err);
    }
  };

  const showAddClubDialog = () => {
    addClubDialog?.current?.showModal();
  };

  const closeAddClubDialog = () => {
    addClubDialog?.current?.close();
  };

  const showEditClubDialog = (club: Club) => {
    setClubToEdit(club);
    editClubDialog?.current?.showModal();
  };

  const closeEditClubDialog = () => {
    setClubToEdit(null);
    editClubDialog?.current?.close();
  };

  const handleEditClub = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!clubToEdit) {
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const countryName = (formData.get("country") as string)
      .trim()
      .toLowerCase();
    const matchedCountry = countries.find(
      (country) => country.name.toLowerCase() === countryName
    );

    const updateClubDto: UpdateClub = {
      name: formData.get("name") as string,
      logoUrl: formData.get("logoUrl") as string,
      countryId: matchedCountry?.id,
    };

    try {
      const data = await updateClub(clubToEdit.id, updateClubDto);
      setClubs((prev) =>
        prev.map((club) => (club.id === clubToEdit.id ? data : club))
      );
      closeEditClubDialog();
      toast.success(`${clubToEdit.name} updated successfully.`);
    } catch (err: unknown) {
      closeEditClubDialog();
      handleError(err);
    }
  };

  const handleDeleteClub = async () => {
    if (!clubToDelete) {
      return;
    }

    try {
      await deleteClub(clubToDelete.id);
      setClubs((prev) => prev.filter((club) => club.id !== clubToDelete.id));
      closeDeleteClubDialog();
      toast.success(`${clubToDelete.name} deleted successfully.`);
    } catch (err: unknown) {
      closeDeleteClubDialog();
      handleError(err);
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setClubToEdit((prev) =>
      prev && prev.country
        ? { ...prev, country: { ...prev.country, name: inputVal } }
        : prev
    );
  };

  const showDeleteClubDialog = (club: Club) => {
    setClubToDelete(club);
    deleteClubDialog?.current?.showModal();
  };

  const closeDeleteClubDialog = () => {
    deleteClubDialog?.current?.close();
  };

  return (
    <section className="px-1">
      <PageTitle title="Clubs Management" />

      <div className="flex justify-between items-center my-6">
        <SearchFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <button
          className="border border-(--color-primary) text-(--color-primary) py-2 px-4 rounded hover:bg-(--color-primary) hover:text-(--color-bg)"
          onClick={showAddClubDialog}
        >
          <i className="fa-solid fa-plus"></i>
          Add Club
        </button>
      </div>

      <table className="w-full text-center align-middle font-bold">
        <thead className="bg-(--color-text) text-(--color-bg)">
          <tr>
            <th>#</th>
            <th className="p-2">Name</th>
            <th className="p-2">Logo</th>
            <th className="p-2">Country</th>
            <th className="p-2">Founded</th>
            <th className="p-2">Competitions</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredClubs.map((club, index) => (
            <tr
              key={club.id}
              className="border-b border-gray-500 odd:bg-(--color-text)/10 even:bg-(--color-text)/20 hover:bg-(--color-primary)/50"
            >
              <td className="p-2">{index + 1}</td>
              <td className="p-2">
                <Link
                  to={`/clubs/${club.id}`}
                  title={club.name}
                  className="hover:underline hover:underline-offset-2"
                >
                  {club.name}
                </Link>
              </td>
              <td className="p-2">
                <img
                  src={club.logoUrl}
                  alt={club.name}
                  title={club.name}
                  className="object-contain w-10 h-10 inline-block"
                />
              </td>
              <td className="p-2">
                <img
                  src={club.country.flagUrl}
                  alt={club.country.name}
                  title={club.country.name}
                  className="object-contain w-10 h-10 inline-block"
                />
              </td>
              <td
                className="p-2"
                title={`Founded: ${club.establishedAt.toString()}`}
              >
                {new Date(club.establishedAt).getFullYear()}
              </td>
              <td className="p-2 flex items-center justify-center gap-2">
                {club.competitions?.length ? (
                  <>
                    {club.competitions.slice(0, 3).map((competition) => (
                      <img
                        key={competition.id}
                        src={competition.logoUrl}
                        alt={competition.name}
                        title={competition.name}
                        className="object-contain w-10 h-10 inline-block"
                      />
                    ))}

                    {club.competitions.length > 3 && (
                      <span
                        className="text-gray-400"
                        title={club.competitions
                          .slice(3)
                          .map((c) => c.name)
                          .join(", ")}
                      >
                        +{club.competitions.length - 3}
                      </span>
                    )}
                  </>
                ) : (
                  <span title="Not Available" className="text-gray-400 italic">
                    N/A
                  </span>
                )}
              </td>

              <td className="p-2">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => showEditClubDialog(club)}
                    className="text-gray-300 hover:brightness-115"
                    title="Edit"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button
                    onClick={() => showDeleteClubDialog(club)}
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
            Found <b>{filteredClubs.length}</b>{" "}
            {filteredClubs.length === 1 ? "result" : "results"} out of{" "}
            <b>{pagination?.totalItems}</b>
          </p>
          <p>
            Page <b>{page || 1}</b> out of <b>{pagination?.totalPages}</b>
          </p>
        </div>
      </div>

      <FormDialog
        dialogRef={addClubDialog}
        title="Add Club"
        onClose={closeAddClubDialog}
        onSubmit={handleAddClub}
      >
        <div className="floating-label-effect">
          <input
            type="text"
            id="name"
            name="name"
            placeholder=""
            className="pl-3"
            required
          />
          <label htmlFor="name" className="left-4">
            Name <span className="text-red-500">*</span>
          </label>
        </div>

        <div className="floating-label-effect">
          <input
            type="text"
            id="logoUrl"
            name="logoUrl"
            placeholder=""
            className="pl-3"
            required
          />
          <label htmlFor="logoUrl" className="left-4">
            Logo URL <span className="text-red-500">*</span>
          </label>
        </div>

        <div className="floating-label-effect relative w-fit">
          <i className="fa-solid fa-calendar-days absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"></i>{" "}
          <input
            type="date"
            id="establishedAt"
            name="establishedAt"
            placeholder=""
            className="pl-10 pr-2"
          />
          <label htmlFor="establishedAt" className="left-4">
            Established At
          </label>
        </div>

        <div className="floating-label-effect">
          <input
            type="search"
            id="country"
            name="country"
            placeholder=""
            list="countries-list"
            className="pl-3"
            required
          />
          <label htmlFor="country" className="left-4">
            Country <span className="text-red-500">*</span>
          </label>
          <datalist id="countries-list">
            {countries.map((country) => (
              <option key={country.id} value={country.name} />
            ))}
          </datalist>
        </div>
      </FormDialog>
      <ConfirmDialog
        dialogRef={deleteClubDialog}
        message="Are you sure you want to delete the club "
        item={clubToDelete?.name || ""}
        onConfirm={handleDeleteClub}
        onClose={closeDeleteClubDialog}
      />
      <FormDialog
        dialogRef={editClubDialog}
        title="Edit Club"
        onClose={closeEditClubDialog}
        onSubmit={handleEditClub}
      >
        <div className="floating-label-effect">
          <input
            type="text"
            id="name"
            name="name"
            placeholder=""
            value={clubToEdit?.name}
            onChange={(e) =>
              setClubToEdit((prev) =>
                prev ? { ...prev, name: e.target.value } : null
              )
            }
            className="pl-3"
            required
          />
          <label htmlFor="name" className="left-4">
            Name <span className="text-red-500">*</span>
          </label>
        </div>

        <div className="floating-label-effect">
          <input
            type="text"
            id="logoUrl"
            name="logoUrl"
            placeholder=""
            value={clubToEdit?.logoUrl}
            onChange={(e) =>
              setClubToEdit((prev) =>
                prev ? { ...prev, logoUrl: e.target.value } : null
              )
            }
            className="pl-3"
            required
          />
          <label htmlFor="logoUrl" className="left-4">
            Logo URL <span className="text-red-500">*</span>
          </label>
        </div>

        <div className="floating-label-effect">
          <input
            type="search"
            id="country"
            name="country"
            placeholder=""
            list="countries-list"
            value={clubToEdit?.country?.name}
            onChange={(e) => handleCountryChange(e)}
            className="pl-3"
            required
          />
          <label htmlFor="country" className="left-4">
            Country <span className="text-red-500">*</span>
          </label>
          <datalist id="countries-list">
            {countries.map((country) => (
              <option key={country.id} value={country.name} />
            ))}
          </datalist>
        </div>
      </FormDialog>
    </section>
  );
};

export default ClubsManagement;
