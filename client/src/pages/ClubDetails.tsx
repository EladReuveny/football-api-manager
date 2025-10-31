import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../components/ConfirmDialog";
import FormDialog from "../components/FormDialog";
import PageTitle from "../components/PageTitle";
import PlayerCard from "../components/PlayerCard";
import useAuth from "../hooks/useAuth";
import {
  deleteClub,
  getClubById,
  removePlayerFromClub,
  updateClub,
} from "../services/clubService";
import { getAllCountries } from "../services/countryService";
import type { Club } from "../types/club/club";
import type { UpdateClub } from "../types/club/updateClub";
import type { Country } from "../types/countries/country";
import type { Player } from "../types/player/player";
import { positionColors } from "../types/player/position";
import { handleError } from "../utils/utils";

type ClubDetailsProps = {};

const ClubDetails = ({}: ClubDetailsProps) => {
  const [club, setClub] = useState<Club | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [clubToEdit, setClubToEdit] = useState<Club | null>(null);

  const { clubId } = useParams();

  const editClubDialog = useRef<HTMLDialogElement | null>(null);
  const deleteClubDialog = useRef<HTMLDialogElement | null>(null);

  const { auth } = useAuth();
  const user = auth?.user;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const data = await getClubById(Number(clubId));
        setClub(data);
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

    fetchClub();
    fetchCountries();
  }, []);

  const goalkeepersPlayers: Player[] = [];
  const defendersPlayers: Player[] = [];
  const midfieldersPlayers: Player[] = [];
  const attackersPlayers: Player[] = [];

  const categorizePlayers = () => {
    club?.players?.forEach((player) => {
      switch (player.position) {
        case "GK":
          goalkeepersPlayers.push(player);
          break;

        case "LB":
        case "CB":
        case "RB":
        case "LWB":
        case "RWB":
          defendersPlayers.push(player);
          break;

        case "CDM":
        case "CM":
        case "LM":
        case "RM":
        case "CAM":
          midfieldersPlayers.push(player);
          break;

        case "RW":
        case "LW":
        case "ST":
        case "CF":
          attackersPlayers.push(player);
          break;

        default:
          return;
      }
    });
  };

  categorizePlayers();

  const showEditClubDialog = () => {
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
      setClub(data);
      closeEditClubDialog();
      toast.success(`${clubToEdit.name} updated successfully.`);
    } catch (err: unknown) {
      closeEditClubDialog();
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

  const showDeleteClubDialog = () => {
    deleteClubDialog?.current?.showModal();
  };

  const closeDeleteClubDialog = () => {
    deleteClubDialog?.current?.close();
  };

  const handleDeleteClub = async () => {
    if (!club) {
      return;
    }

    try {
      await deleteClub(club.id);
      setClub(null);
      closeDeleteClubDialog();
      toast.success(`${club.name} deleted successfully.`);
      navigate("/admin/clubs");
    } catch (err: unknown) {
      handleError(err);
    }
  };

  const handleRemoveFromClub = async (
    e: React.MouseEvent<HTMLButtonElement>,
    player: Player
  ) => {
    e.preventDefault();

    if (!club) {
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to remove ${player.name} from ${club.name}?`
    );
    if (!confirmed) {
      return;
    }

    try {
      const data = await removePlayerFromClub(club.id, player.id);
      setClub(data);
      toast.success(`${player?.name} removed successfully from ${club?.name}.`);
    } catch (err: unknown) {
      handleError(err);
    }
  };

  return (
    <section className="px-1">
      <PageTitle title="Club Details" />

      {user?.role === "ADMIN" && (
        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={showEditClubDialog}
            className="border border-(--color-primary) text-(--color-primary) py-2 px-4 hover:bg-(--color-primary) hover:text-(--color-bg)"
            title="Edit"
          >
            <i className="fa-solid fa-pen mr-2"></i>Edit
          </button>
          <button
            onClick={showDeleteClubDialog}
            className="border border-red-600 text-red-600 py-2 px-4 hover:bg-red-600 hover:text-(--color-bg)"
            title="Delete"
          >
            <i className="fa-solid fa-trash mr-2"></i>Delete
          </button>
        </div>
      )}

      <div className="flex items-center justify-center gap-8 my-6">
        <img
          src={club?.logoUrl}
          alt={club?.name}
          title={club?.name}
          className="w-40 h-40 object-contain drop-shadow-[0_0_1px_var(--color-text)]"
        />
        <div className="flex flex-col gap-4">
          <h2 className="text-4xl font-bold text-(--color-primary)">
            {club?.name}
          </h2>

          <div className="flex items-center gap-3">
            <Link
              to={`/countries/${club?.country?.id}`}
              className="hover:scale-105"
            >
              <img
                src={club?.country?.flagUrl}
                alt={club?.country?.name}
                title={club?.country?.name}
                className="w-10 h-10 object-fill rounded-full"
              />
            </Link>
            <span
              title={`ISO Code: ${club?.country?.isoCode}`}
              className="font-bold"
            >
              {club?.country?.isoCode}
            </span>
          </div>
          <p
            title={`Founded: ${club?.establishedAt.toString()}`}
            className="text-gray-300 text-sm font-bold"
          >
            Founded {club?.establishedAt.toString()}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <div className="bg-(--color-text)/10 p-4 rounded-lg">
          <h3 className="text-3xl font-bold mb-4">
            <i className="fa-solid fa-trophy mr-3"></i>
            Competitions
          </h3>
          <div className="flex items-center flex-wrap gap-4 mb-8">
            {club?.competitions?.length ? (
              club.competitions.map((competition) => (
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
        <div className="bg-(--color-text)/10 p-4 rounded-lg">
          <h3 className="text-3xl font-bold mb-4">
            <i className="fa-solid fa-users mr-3"></i>
            Squad
          </h3>
          <div className="flex flex-col gap-8">
            <div>
              <h4
                className={`text-2xl font-bold border-l-2 ${positionColors.GK.join(
                  " "
                )} py-1.5 px-3 mb-3`}
              >
                <i className="fa-solid fa-mitten mr-2"></i>
                Goalkeepers
              </h4>
              {goalkeepersPlayers?.length ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
                  {goalkeepersPlayers.map((player, index) =>
                    user?.role === "ADMIN" ? (
                      <PlayerCard
                        key={player.id}
                        player={player}
                        index={index}
                        onRemoveFromClub={handleRemoveFromClub}
                      />
                    ) : (
                      <PlayerCard
                        key={player.id}
                        player={player}
                        index={index}
                      />
                    )
                  )}
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
            <div>
              <h4
                className={`text-2xl font-bold border-l-2 ${positionColors.CB.join(
                  " "
                )} py-1.5 px-3 mb-3`}
              >
                <i className="fa-solid fa-shield-alt mr-2"></i>
                Defenders
              </h4>
              {defendersPlayers?.length ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
                  {defendersPlayers.map((player, index) =>
                    user?.role === "ADMIN" ? (
                      <PlayerCard
                        key={player.id}
                        player={player}
                        index={index}
                        onRemoveFromClub={handleRemoveFromClub}
                      />
                    ) : (
                      <PlayerCard
                        key={player.id}
                        player={player}
                        index={index}
                      />
                    )
                  )}
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
            <div>
              <h4
                className={`text-2xl font-bold border-l-2 ${positionColors.CM.join(
                  " "
                )} py-1.5 px-3 mb-3`}
              >
                <i className="fa-solid fa-futbol mr-2"></i>
                Midfielders
              </h4>
              {midfieldersPlayers?.length ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
                  {midfieldersPlayers.map((player, index) =>
                    user?.role === "ADMIN" ? (
                      <PlayerCard
                        key={player.id}
                        player={player}
                        index={index}
                        onRemoveFromClub={handleRemoveFromClub}
                      />
                    ) : (
                      <PlayerCard
                        key={player.id}
                        player={player}
                        index={index}
                      />
                    )
                  )}
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
            <div>
              <h4
                className={`text-2xl font-bold border-l-2 ${positionColors.ST.join(
                  " "
                )} py-1.5 px-3 mb-3`}
              >
                <i className="fa-solid fa-bullseye mr-2"></i>
                Attackers
              </h4>
              {attackersPlayers?.length ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
                  {attackersPlayers.map((player, index) =>
                    user?.role === "ADMIN" ? (
                      <PlayerCard
                        key={player.id}
                        player={player}
                        index={index}
                        onRemoveFromClub={handleRemoveFromClub}
                      />
                    ) : (
                      <PlayerCard
                        key={player.id}
                        player={player}
                        index={index}
                      />
                    )
                  )}
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
        </div>
      </div>

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
      <ConfirmDialog
        dialogRef={deleteClubDialog}
        message="Are you sure you want to delete the club "
        item={club?.name || ""}
        onConfirm={handleDeleteClub}
        onClose={closeDeleteClubDialog}
      />
    </section>
  );
};

export default ClubDetails;
