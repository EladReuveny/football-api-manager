import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../components/ConfirmDialog";
import DropDownList from "../components/DropDownList";
import FormDialog from "../components/FormDialog";
import PageTitle from "../components/PageTitle";
import useAuth from "../hooks/useAuth";
import { getAllClubs } from "../services/clubService";
import {
  deleteCompetition,
  getCompetitionById,
  updateCompetition,
} from "../services/competitionService";
import { getAllCountries } from "../services/countryService";
import type { Club } from "../types/club/club";
import type { Competition } from "../types/competition/competition";
import {
  competitionTypeColors,
  competitionTypes,
  mapCompetitionTypeToLabel,
  type CompetitionType,
} from "../types/competition/competitionType";
import type { UpdateCompetition } from "../types/competition/updateCompetition";
import type { Country } from "../types/countries/country";
import { handleError } from "../utils/utils";

type CompetitionDetailsProps = {};

const CompetitionDetails = ({}: CompetitionDetailsProps) => {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [competitionToEdit, setCompetitionToEdit] =
    useState<Competition | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClubsIds, setSelectedClubsIds] = useState<number[]>([]);

  const { competitionId } = useParams();

  const editCompetitionDialog = useRef<HTMLDialogElement | null>(null);
  const deleteCompetitionDialog = useRef<HTMLDialogElement | null>(null);

  const { auth } = useAuth();
  const user = auth?.user;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        const data: Competition = await getCompetitionById(
          Number(competitionId)
        );
        setCompetition(data);
        if (data.clubs) {
          setSelectedClubsIds(data.clubs.map((club) => club.id));
        }
      } catch (err: unknown) {
        handleError(err);
      }
    };

    const fetchCountries = async () => {
      try {
        const data = await getAllCountries();
        setCountries(data);
      } catch (err: unknown) {
        handleError(err);
      }
    };

    const fetchClubs = async () => {
      try {
        const data = await getAllClubs();
        setClubs(data);
      } catch (err: unknown) {
        handleError(err);
      }
    };

    fetchCompetition();
    fetchCountries();
    fetchClubs();
  }, [competitionId]);

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
      setCompetition(data);
      closeEditCompetitionDialog();
      toast.success(`${competitionToEdit.name} updated successfully.`);
    } catch (err: unknown) {
      closeEditCompetitionDialog();
      handleError(err);
    }
  };

  const handleDeleteCompetition = async () => {
    if (!competition) {
      return;
    }

    try {
      await deleteCompetition(competition.id);
      closeDeleteCompetitionDialog();
      toast.success(`${competition.name} deleted successfully.`);
      navigate("/admin/competitions");
    } catch (err: unknown) {
      closeDeleteCompetitionDialog();
      handleError(err);
    }
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
            className="object-contain w-7 h-7"
          />{" "}
          {club.name}
        </div>
        <img
          src={club.country.flagUrl}
          alt={club.country.name}
          title={club.country.name}
          className="object-contain w-7 h-7"
        />
      </>
    );
  };

  const showEditCompetitionDialog = () => {
    setCompetitionToEdit(competition);
    editCompetitionDialog?.current?.showModal();
  };

  const closeEditCompetitionDialog = () => {
    setCompetitionToEdit(null);
    editCompetitionDialog?.current?.close();
  };

  const showDeleteCompetitionDialog = () => {
    deleteCompetitionDialog?.current?.showModal();
  };

  const closeDeleteCompetitionDialog = () => {
    deleteCompetitionDialog?.current?.close();
  };

  return (
    <section className="px-1">
      <PageTitle title="Competition Details" />

      {user?.role === "ADMIN" && (
        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={showEditCompetitionDialog}
            className="border border-(--color-primary) text-(--color-primary) py-2 px-4 hover:bg-(--color-primary) hover:text-(--color-bg)"
            title="Edit"
          >
            <i className="fa-solid fa-pen mr-2"></i>Edit
          </button>
          <button
            onClick={showDeleteCompetitionDialog}
            className="border border-red-600 text-red-600 py-2 px-4 hover:bg-red-600 hover:text-(--color-bg)"
            title="Delete"
          >
            <i className="fa-solid fa-trash mr-2"></i>Delete
          </button>
        </div>
      )}

      <div className="flex items-center justify-center gap-8 my-6">
        <img
          src={competition?.logoUrl}
          alt={competition?.name}
          title={competition?.name}
          className="w-40 h-40 object-contain drop-shadow-[0_0_1px_var(--color-text)]"
        />
        <div className="flex flex-col gap-4">
          <h2 className="text-4xl font-bold text-(--color-primary)">
            {competition?.name}
          </h2>

          {competition?.country && (
            <div className="flex items-center gap-3">
              <Link
                to={`/countries/${competition?.country?.id}`}
                className="hover:scale-105"
              >
                <img
                  src={competition?.country?.flagUrl}
                  alt={competition?.country?.name}
                  title={competition?.country?.name}
                  className="w-10 h-10 object-fill rounded-full"
                />
              </Link>
              <span
                title={`ISO Code: ${competition?.country?.isoCode}`}
                className="font-bold"
              >
                {competition?.country?.isoCode}
              </span>
            </div>
          )}
          <p
            title={`Founded: ${competition?.establishedAt.toString()}`}
            className="text-gray-300 text-sm font-bold"
          >
            Founded {competition?.establishedAt.toString()}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <div className="bg-(--color-text)/10 p-4 rounded-lg">
          <h3 className="text-3xl font-bold mb-4">
            <i className="fa-solid fa-id-card mr-3"></i>
            Competition Info
          </h3>
          <p className="text-lg mb-2">
            Name: <span className="font-bold">{competition?.name}</span>
          </p>
          <p className="text-lg mb-2">
            Competition Type:{" "}
            <span
              className={`font-bold py-1 px-2 ${
                competition?.competitionType
                  ? competitionTypeColors[competition?.competitionType].join(
                      " "
                    )
                  : ""
              }`}
            >
              {competition?.competitionType &&
                mapCompetitionTypeToLabel[competition?.competitionType]}
            </span>
          </p>
          <p className="text-lg mb-2">
            Participating Clubs:{" "}
            <span className="font-bold">{competition?.clubs?.length}</span>
          </p>
        </div>

        <div className="bg-(--color-text)/10 p-4 rounded-lg">
          <h3 className="text-3xl font-bold mb-4">
            <i className="fa-solid fa-futbol mr-3"></i>
            Clubs
          </h3>
          {competition?.clubs?.length ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] items-center gap-5">
              {competition?.clubs?.map((club) => (
                <Link
                  key={club.id}
                  to={`/clubs/${club.id}`}
                  title={club.name}
                  className="w-fit hover:scale-105"
                >
                  <img
                    src={club.logoUrl}
                    alt={club.name}
                    title={club.name}
                    className="w-14 h-14 object-contain drop-shadow-[0_0_1px_var(--color-text)]"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <span
              title="Not Available"
              className="font-bold text-gray-400 italic"
            >
              N/A
            </span>
          )}
        </div>
      </div>

      <ConfirmDialog
        dialogRef={deleteCompetitionDialog}
        message="Are you sure you want to delete the competition "
        item={competition?.name || ""}
        onConfirm={handleDeleteCompetition}
        onClose={closeDeleteCompetitionDialog}
      />
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
            Logo URL<span className="text-red-500">*</span>
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

export default CompetitionDetails;
