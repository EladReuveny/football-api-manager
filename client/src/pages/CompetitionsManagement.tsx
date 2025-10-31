import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../components/ConfirmDialog";
import DropDownList from "../components/DropDownList";
import FormDialog from "../components/FormDialog";
import PageTitle from "../components/PageTitle";
import { getAllClubs } from "../services/clubService";
import {
  createCompetition,
  deleteCompetition,
  getAllCompetitions,
  updateCompetition,
} from "../services/competitionService";
import { getAllCountries } from "../services/countryService";

import Pagination from "../components/Pagination";
import SearchFilterBar from "../components/SearchFilterBar";
import type { Club } from "../types/club/club";
import type { PaginationQuery } from "../types/common/paginationQuery";
import type { PaginationResponse } from "../types/common/paginationResponse";
import type { Competition } from "../types/competition/competition";
import {
  competitionTypeColors,
  competitionTypes,
  mapCompetitionTypeToLabel,
  type CompetitionType,
} from "../types/competition/competitionType";
import type { CreateCompetition } from "../types/competition/createCompetition";
import type { UpdateCompetition } from "../types/competition/updateCompetition";
import type { Country } from "../types/countries/country";
import { handleError } from "../utils/utils";

type CompetitionsManagementProps = {};

const CompetitionsManagement = ({}: CompetitionsManagementProps) => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [filteredCompetitions, setFilteredCompetitions] = useState<
    Competition[]
  >([]);
  const [pagination, setPagination] = useState<Omit<
    PaginationResponse<Competition>,
    "items"
  > | null>(null);
  const [competitionToEdit, setCompetitionToEdit] =
    useState<Competition | null>(null);
  const [competitionToDelete, setCompetitionToDelete] =
    useState<Competition | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClubsIds, setSelectedClubsIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : undefined;
  const limit = searchParams.get("limit")
    ? Number(searchParams.get("limit"))
    : undefined;

  const addCompetitionDialog = useRef<HTMLDialogElement | null>(null);
  const editCompetitionDialog = useRef<HTMLDialogElement | null>(null);
  const deleteCompetitionDialog = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const fetchCompetitions = async () => {
      const query: PaginationQuery = { page: page, limit };

      try {
        const data = await getAllCompetitions(query);
        setCompetitions(data.items);
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

    const fetchClubs = async () => {
      try {
        const data = await getAllClubs();
        setClubs(data.items);
      } catch (err: unknown) {
        handleError(err);
      }
    };

    fetchCompetitions();
    fetchCountries();
    fetchClubs();
  }, [page, limit]);

  useEffect(() => {
    const searchTerm = searchQuery.trim().toLowerCase();
    if (!searchTerm) {
      setFilteredCompetitions(competitions);
      return;
    }

    const filtered = competitions.filter((competition) =>
      competition.name.toLowerCase().includes(searchTerm)
    );

    setFilteredCompetitions(filtered);
  }, [competitions, searchQuery]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page), limit: String(pagination?.limit) });
  };

  const handleAddCompetition = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const countryName = (formData.get("country") as string)
      .trim()
      .toLowerCase();
    const matchedCountry = countries.find(
      (country) => country.name.toLowerCase() === countryName
    );

    const createCompetitionDto: CreateCompetition = {
      name: formData.get("name") as string,
      logoUrl: formData.get("logoUrl") as string,
      establishedAt: formData.get("establishedAt")
        ? new Date(formData.get("establishedAt") as string)
        : undefined,
      competitionType: formData.get("competitionType") as CompetitionType,
      countryId: matchedCountry?.id,
    };

    try {
      const data = await createCompetition(createCompetitionDto);
      setCompetitions((prev) => [...prev, data]);
      closeAddCompetitionDialog();
      toast.success(`${createCompetitionDto.name} added successfully.`);
    } catch (err: unknown) {
      closeAddCompetitionDialog();
      handleError(err);
    }
  };

  const handleEditCompetition = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!competitionToEdit) {
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

    const updateCompetitionDto: UpdateCompetition = {
      name: formData.get("name") as string,
      logoUrl: formData.get("logoUrl") as string,
      competitionType: formData.get("competitionType") as CompetitionType,
      countryId: matchedCountry?.id,
      clubsIds: selectedClubsIds,
    };

    try {
      const data = await updateCompetition(
        competitionToEdit.id,
        updateCompetitionDto
      );
      setCompetitions((prev) =>
        prev.map((competition) =>
          competition.id === competitionToEdit.id ? data : competition
        )
      );
      closeEditCompetitionDialog();
      toast.success(`${competitionToEdit.name} updated successfully.`);
    } catch (err: unknown) {
      closeEditCompetitionDialog();
      handleError(err);
    }
  };

  const showEditCompetitionDialog = (competition: Competition) => {
    setCompetitionToEdit(competition);
    setSelectedClubsIds(competition.clubs?.map((club) => club.id) || []);
    editCompetitionDialog?.current?.showModal();
  };

  const closeEditCompetitionDialog = () => {
    setCompetitionToEdit(null);
    setSelectedClubsIds([]);
    editCompetitionDialog?.current?.close();
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setCompetitionToEdit((prev) =>
      prev && prev.country
        ? { ...prev, country: { ...prev.country, name: inputVal } }
        : prev
    );

    const matchedCountry = countries.find(
      (country) => country.name.toLowerCase() === inputVal.toLowerCase()
    );

    if (matchedCountry) {
      setCompetitionToEdit((prev) =>
        prev ? { ...prev, country: matchedCountry } : null
      );
    }
  };

  const handleSelectClub = (club: Club, isChecked?: boolean) => {
    if (isChecked || selectedClubsIds.includes(club.id)) {
      setSelectedClubsIds((prev) => prev.filter((id) => id !== club.id));
    } else {
      setSelectedClubsIds((prev) => [...prev, club.id]);
    }
  };

  const renderClubItem = (club: Club) => {
    return (
      <>
        <div className="flex items-center gap-1">
          <img
            src={club.logoUrl}
            alt={club.name}
            title={club.name}
            className="object-contain w-8 h-8 inline-block"
          />{" "}
          {club.name}
        </div>
        <img
          src={club.country.flagUrl}
          alt={club.country.name}
          title={club.country.name}
          className="object-contain w-8 h-8 inline-block"
        />
      </>
    );
  };

  const showAddCompetitionDialog = () => {
    addCompetitionDialog?.current?.showModal();
  };

  const closeAddCompetitionDialog = () => {
    addCompetitionDialog?.current?.close();
  };

  const handleDeleteCompetition = async () => {
    if (!competitionToDelete) {
      return;
    }

    try {
      await deleteCompetition(competitionToDelete.id);
      setCompetitions((prev) =>
        prev.filter((competition) => competition.id !== competitionToDelete.id)
      );
      closeDeleteCompetitionDialog();
      toast.success(`${competitionToDelete.name} deleted successfully.`);
    } catch (err: unknown) {
      handleError(err);
    }
  };

  const showDeleteCompetitionDialog = (competition: Competition) => {
    setCompetitionToDelete(competition);
    deleteCompetitionDialog?.current?.showModal();
  };

  const closeDeleteCompetitionDialog = () => {
    deleteCompetitionDialog?.current?.close();
  };

  return (
    <section className="px-1">
      <PageTitle title="Competitions Management" />

      <div className="flex justify-between items-center my-6">
        <SearchFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <button
          className="border border-(--color-primary) text-(--color-primary) py-2 px-4 rounded hover:bg-(--color-primary) hover:text-(--color-bg)"
          onClick={showAddCompetitionDialog}
        >
          <i className="fa-solid fa-plus"></i>
          Add Competition
        </button>
      </div>

      <table className="w-full text-center align-middle font-bold">
        <thead className="bg-(--color-text) text-(--color-bg)">
          <tr>
            <th>#</th>
            <th className="p-2">Name</th>
            <th className="p-2">Logo</th>
            <th className="p-2">Founded</th>
            <th className="p-2">Type</th>
            <th className="p-2">Country</th>
            <th className="p-2">Clubs</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCompetitions.map((competition, index) => (
            <tr
              key={competition.id}
              className="border-b border-gray-500 odd:bg-(--color-text)/10 even:bg-(--color-text)/20 hover:bg-(--color-primary)/50"
            >
              <td className="p-2">{index + 1}</td>
              <td className="p-2">
                <Link
                  to={`/competitions/${competition.id}`}
                  title={competition.name}
                  className="hover:underline hover:underline-offset-2"
                >
                  {competition.name}
                </Link>
              </td>
              <td className="p-2">
                <img
                  src={competition.logoUrl}
                  alt={competition.name}
                  title={competition.name}
                  className="object-contain w-10 h-10 inline-block"
                />
              </td>
              <td
                className="p-2"
                title={`Founded: ${competition.establishedAt.toString()}`}
              >
                {new Date(competition.establishedAt).getFullYear()}
              </td>
              <td className="p-2">
                <span
                  className={`inline-block py-1 px-2 rounded ${competitionTypeColors[
                    competition.competitionType
                  ].join(" ")}`}
                >
                  {mapCompetitionTypeToLabel[competition.competitionType]}
                </span>
              </td>
              <td className="p-2">
                {competition.country ? (
                  <img
                    src={competition.country?.flagUrl}
                    alt={competition.country?.name}
                    title={competition.country?.name}
                    className="object-contain w-10 h-10 inline-block"
                  />
                ) : (
                  <span title="Not Available" className="text-gray-400 italic">
                    N/A
                  </span>
                )}
              </td>
              <td className="p-2 space-x-2">
                {competition.clubs?.length ? (
                  <>
                    {competition.clubs.slice(0, 3).map((club) => (
                      <img
                        key={club.id}
                        src={club.logoUrl}
                        alt={club.name}
                        title={club.name}
                        className="object-contain w-10 h-10 inline-block"
                      />
                    ))}
                    {competition.clubs.length > 3 && (
                      <span
                        className="text-gray-400 align-middle"
                        title={competition.clubs
                          .slice(3)
                          .map((c) => c.name)
                          .join(", ")}
                      >
                        +{competition.clubs.length - 3}
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
                    onClick={() => showEditCompetitionDialog(competition)}
                    className="text-gray-300 hover:brightness-115"
                    title="Edit"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button
                    onClick={() => showDeleteCompetitionDialog(competition)}
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
            Found <b>{filteredCompetitions.length}</b>{" "}
            {filteredCompetitions.length === 1 ? "result" : "results"} out of{" "}
            <b>{pagination?.totalItems}</b>
          </p>
          <p>
            Page <b>{page || 1}</b> out of <b>{pagination?.totalPages}</b>
          </p>
        </div>
      </div>

      <ConfirmDialog
        dialogRef={deleteCompetitionDialog}
        message="Are you sure you want to delete the competition "
        item={competitionToDelete?.name || ""}
        onConfirm={handleDeleteCompetition}
        onClose={closeDeleteCompetitionDialog}
      />
      <FormDialog
        dialogRef={addCompetitionDialog}
        onSubmit={handleAddCompetition}
        onClose={closeAddCompetitionDialog}
        title="Add Competition"
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
          <select
            id="competitionType"
            name="competitionType"
            className="pl-3"
            required
          >
            <option value="" disabled>
              --- Select a Competition Type ---
            </option>
            {competitionTypes.map((competitionType, index) => (
              <option key={index} value={competitionType.value}>
                {competitionType.label}
              </option>
            ))}
          </select>
          <label htmlFor="competitionType" className="left-4">
            Competition Type <span className="text-red-500">*</span>
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
          />
          <label htmlFor="country" className="left-4">
            Country
          </label>
          <datalist id="countries-list">
            {countries.map((country) => (
              <option key={country.id} value={country.name} />
            ))}
          </datalist>
        </div>

        <DropDownList
          items={clubs}
          selectedItemsIds={selectedClubsIds}
          handleSelectItem={handleSelectClub}
          renderItem={renderClubItem}
          label="Clubs"
        />
      </FormDialog>
      <FormDialog
        dialogRef={editCompetitionDialog}
        title="Edit Competition"
        onClose={closeEditCompetitionDialog}
        onSubmit={handleEditCompetition}
      >
        <div className="floating-label-effect">
          <input
            type="text"
            name="name"
            id="name"
            value={competitionToEdit?.name}
            onChange={(e) =>
              setCompetitionToEdit((prev) =>
                prev ? { ...prev, name: e.target.value } : null
              )
            }
            placeholder=""
            className="pl-3"
            required
          />
          <label htmlFor="name">
            Name <span className="text-red-500">*</span>
          </label>
        </div>

        <div className="floating-label-effect">
          <input
            type="text"
            name="logoUrl"
            id="logoUrl"
            value={competitionToEdit?.logoUrl}
            onChange={(e) =>
              setCompetitionToEdit((prev) =>
                prev ? { ...prev, logoUrl: e.target.value } : null
              )
            }
            placeholder=""
            className="pl-3"
            required
          />
          <label htmlFor="logoUrl">
            Logo URL <span className="text-red-500">*</span>
          </label>
        </div>

        <div className="floating-label-effect">
          <select
            id="competitionType"
            name="competitionType"
            value={competitionToEdit?.competitionType}
            onChange={(e) =>
              setCompetitionToEdit((prev) =>
                prev
                  ? {
                      ...prev,
                      competitionType: e.target.value as CompetitionType,
                    }
                  : null
              )
            }
            className="pl-3"
            required
          >
            <option value="" disabled>
              --- Select a Competition Type ---
            </option>
            {competitionTypes.map((competitionType, index) => (
              <option key={index} value={competitionType.value}>
                {competitionType.label}
              </option>
            ))}
          </select>
          <label htmlFor="competitionType" className="left-4">
            Competition Type <span className="text-red-500">*</span>
          </label>
        </div>

        <div className="floating-label-effect">
          <input
            type="search"
            id="country"
            name="country"
            placeholder=""
            list="countries-list"
            value={competitionToEdit?.country?.name}
            onChange={(e) => handleCountryChange(e)}
            className="pl-3"
          />
          <label htmlFor="country" className="left-4">
            Country
          </label>
          <datalist id="countries-list">
            {countries.map((country) => (
              <option key={country.id} value={country.name} />
            ))}
          </datalist>
        </div>

        <DropDownList
          items={clubs}
          selectedItemsIds={selectedClubsIds}
          handleSelectItem={handleSelectClub}
          renderItem={renderClubItem}
          label="Clubs"
        />
      </FormDialog>
    </section>
  );
};

export default CompetitionsManagement;
