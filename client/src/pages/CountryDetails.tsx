import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../components/ConfirmDialog";
import FormDialog from "../components/FormDialog";
import PageTitle from "../components/PageTitle";
import PlayerCard from "../components/PlayerCard";
import useAuth from "../hooks/useAuth";
import {
  deleteCountry,
  getCountryById,
  updateCountry,
} from "../services/countryService";
import type { Country } from "../types/countries/country";
import type { UpdateCountry } from "../types/countries/updateCountry";
import { handleError } from "../utils/utils";

type CountryDetailsProps = {};

const CountryDetails = ({}: CountryDetailsProps) => {
  const [country, setCountry] = useState<Country | null>(null);
  const [countryToEdit, setCountryToEdit] = useState<Country | null>(null);

  const countryStats = [
    {
      label: "Clubs",
      value: country?.clubs?.length || 0,
      icon: <i className="fas fa-shield"></i>,
    },
    {
      label: "Competitions",
      value: country?.competitions?.length || 0,
      icon: <i className="fas fa-trophy"></i>,
    },
    {
      label: "Players",
      value: country?.players?.length || 0,
      icon: <i className="fas fa-users"></i>,
    },
  ];

  const { countryId } = useParams();

  const editCountryDialog = useRef<HTMLDialogElement | null>(null);
  const deleteCountryDialog = useRef<HTMLDialogElement | null>(null);

  const { auth } = useAuth();
  const user = auth?.user;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const data = await getCountryById(Number(countryId));
        setCountry(data);
      } catch (err: unknown) {
        handleError(err);
      }
    };

    fetchCountry();
  }, []);

  const showEditCountryDialog = () => {
    setCountryToEdit(country);
    editCountryDialog?.current?.showModal();
  };

  const closeEditCountryDialog = () => {
    setCountryToEdit(null);
    editCountryDialog?.current?.close();
  };

  const handleEditCountry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!countryToEdit) {
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const updateCountryDto: UpdateCountry = {
      name: formData.get("name") as string,
      isoCode: formData.get("isoCode") as string,
      flagUrl: formData.get("flagUrl") as string,
    };

    try {
      const data = await updateCountry(countryToEdit.id, updateCountryDto);
      setCountry(data);
      closeEditCountryDialog();
      toast.success(`${updateCountryDto.name} updated successfully.`);
    } catch (err: unknown) {
      closeEditCountryDialog();
      handleError(err);
    }
  };

  const showDeleteCountryDialog = () => {
    deleteCountryDialog?.current?.showModal();
  };

  const closeDeleteCountryDialog = () => {
    deleteCountryDialog?.current?.close();
  };

  const handleDeleteCountry = async () => {
    if (!country) {
      return;
    }

    try {
      const data = await deleteCountry(country.id);
      setCountry(null);
      closeDeleteCountryDialog();
      toast.success(`${country.name} deleted successfully.`);
      navigate("/admin/countries");
    } catch (err: unknown) {
      handleError(err);
    }
  };

  return (
    <section className="px-1">
      <PageTitle title="Country Details" />

      {user?.role === "ADMIN" && (
        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={showEditCountryDialog}
            className="border border-(--color-primary) text-(--color-primary) py-2 px-4 hover:bg-(--color-primary) hover:text-(--color-bg)"
            title="Edit"
          >
            <i className="fa-solid fa-pen mr-2"></i>Edit
          </button>
          <button
            onClick={showDeleteCountryDialog}
            className="border border-red-600 text-red-600 py-2 px-4 hover:bg-red-600 hover:text-(--color-bg)"
            title="Delete"
          >
            <i className="fa-solid fa-trash mr-2"></i>Delete
          </button>
        </div>
      )}

      <div className="flex items-center justify-center gap-8 my-6">
        <img
          src={country?.flagUrl}
          alt={country?.name}
          title={country?.name}
          className="w-40 h-40 object-fill rounded-full drop-shadow-[0_0_4px_var(--color-text)]"
        />

        <div className="flex flex-col gap-3">
          <h2 className="text-4xl font-bold text-(--color-primary)">
            {country?.name}
            <sub
              title={`ISO Code: ${country?.isoCode}`}
              className="text-sm text-gray-400 ml-1"
            >
              {country?.isoCode}
            </sub>
          </h2>

          <div className="flex flex-wrap gap-2">
            {countryStats.map((stat, index) => (
              <a
                key={index}
                href={`#${stat.label.toLowerCase()}`}
                className="flex flex-col items-center bg-(--color-text)/10 py-2 px-4 rounded-lg hover:backdrop-brightness-200"
              >
                <p className="font-bold text-(--color-primary) text-xl">
                  {stat.value}
                </p>
                <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
                  <span>{stat.icon}</span>
                  <span>{stat.label}</span>
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <div id="clubs" className="bg-(--color-text)/10 p-4 rounded-lg">
          <h3 className="text-3xl font-bold mb-4">
            <i className="fa-solid fa-users mr-3"></i>
            Clubs
          </h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] items-center gap-5">
            {country?.clubs?.length ? (
              country.clubs.map((club) => (
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
              ))
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
        <div id="competitions" className="bg-(--color-text)/10 p-4 rounded-lg">
          <h3 className="text-3xl font-bold mb-4">
            <i className="fa-solid fa-trophy mr-3"></i>
            Competitions
          </h3>
          <div className="flex items-center flex-wrap gap-4 mb-8">
            {country?.competitions?.length ? (
              country.competitions.map((competition) => (
                <Link
                  key={competition.id}
                  to={`/competitions/${competition.id}`}
                  title={competition.name}
                  className="w-fit hover:scale-105"
                >
                  <img
                    key={competition.id}
                    src={competition.logoUrl}
                    alt={competition.name}
                    title={competition.name}
                    className="w-14 h-14 object-contain"
                  />
                </Link>
              ))
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
        <div id="players" className="bg-(--color-text)/10 p-4 rounded-lg">
          <h3 className="text-3xl font-bold mb-4">
            <i className="fa-solid fa-trophy mr-3"></i>
            Players
          </h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5">
            {country?.players?.length ? (
              country.players.map((player, index) => (
                <PlayerCard key={player.id} player={player} index={index} />
              ))
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
      </div>

      <FormDialog
        dialogRef={editCountryDialog}
        title="Edit Country"
        onClose={closeEditCountryDialog}
        onSubmit={handleEditCountry}
      >
        <div className="floating-label-effect">
          <input
            type="text"
            id="name"
            name="name"
            placeholder=""
            value={countryToEdit?.name}
            onChange={(e) =>
              setCountryToEdit((prev) =>
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
            id="isoCode"
            name="isoCode"
            placeholder=""
            value={countryToEdit?.isoCode}
            onChange={(e) =>
              setCountryToEdit((prev) =>
                prev ? { ...prev, isoCode: e.target.value } : null
              )
            }
            className="pl-3"
            required
          />
          <label htmlFor="isoCode" className="left-4">
            ISO Code <span className="text-red-500">*</span>
          </label>
        </div>

        <div className="floating-label-effect">
          <input
            type="text"
            id="flagUrl"
            name="flagUrl"
            placeholder=""
            value={countryToEdit?.flagUrl}
            onChange={(e) =>
              setCountryToEdit((prev) =>
                prev ? { ...prev, flagUrl: e.target.value } : null
              )
            }
            className="pl-3"
            required
          />
          <label htmlFor="flagUrl" className="left-4">
            Flag URL <span className="text-red-500">*</span>
          </label>
        </div>
      </FormDialog>
      <ConfirmDialog
        dialogRef={deleteCountryDialog}
        message="Are you sure you want to delete the country "
        item={country?.name || ""}
        onConfirm={handleDeleteCountry}
        onClose={closeDeleteCountryDialog}
      />
    </section>
  );
};

export default CountryDetails;
