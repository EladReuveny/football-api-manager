import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../components/ConfirmDialog";
import FormDialog from "../components/FormDialog";
import PageTitle from "../components/PageTitle";
import useAuth from "../hooks/useAuth";
import { getAllClubs } from "../services/clubService";
import { getAllCountries } from "../services/countryService";
import {
  deletePlayer,
  getPlayerById,
  updatePlayer,
} from "../services/playerService";
import type { Club } from "../types/club/club";
import type { Country } from "../types/countries/country";
import type { Player } from "../types/player/player";
import type { Position } from "../types/player/position";
import {
  mapPositionToLabel,
  positionColors,
  positions,
} from "../types/player/position";
import type { UpdatePlayer } from "../types/player/updatePlayer";
import { handleError } from "../utils/utils";

type PlayerDetailsProps = {};

const PlayerDetails = ({}: PlayerDetailsProps) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [nationalities, setNationalities] = useState<Country[]>([]);

  const { playerId } = useParams();

  const editPlayerDialog = useRef<HTMLDialogElement | null>(null);
  const deletePlayerDialog = useRef<HTMLDialogElement | null>(null);

  const { auth } = useAuth();
  const user = auth?.user;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const data = await getPlayerById(Number(playerId));
        setPlayer(data);
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

    const fetchCountries = async () => {
      try {
        const data = await getAllCountries();
        setNationalities(data);
      } catch (err: unknown) {
        handleError(err);
      }
    };

    fetchPlayer();
    fetchClubs();
    fetchCountries();
  }, [playerId]);

  const showEditPlayerDialog = () => {
    setPlayerToEdit(player);
    editPlayerDialog?.current?.showModal();
  };

  const closeEditPlayerDialog = () => {
    setPlayerToEdit(null);
    editPlayerDialog?.current?.close();
  };

  const handleEditPlayer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const clubName = (formData.get("club") as string).trim().toLowerCase();
    const matchedClub = clubs.find(
      (club) => club.name.toLowerCase() === clubName
    );

    const nationalityName = (formData.get("nationality") as string)
      .trim()
      .toLowerCase();
    const matchedNationality = nationalities.find(
      (nationality) => nationality.name.toLowerCase() === nationalityName
    );

    const updatePlayerDto: UpdatePlayer = {
      name: formData.get("name") as string,
      age: Number(formData.get("age")) as number,
      position: formData.get("position") as Position,
      rating: Number(formData.get("rating")) as number,
      marketValue: Number(formData.get("marketValue")) as number,
      imageUrl: formData.get("imageUrl") as string,
      clubId: matchedClub?.id,
      nationalityId: matchedNationality?.id,
    };

    if (playerToEdit?.id) {
      try {
        const data = await updatePlayer(playerToEdit.id, updatePlayerDto);
        setPlayer(data);
        closeEditPlayerDialog();
        toast.success(`${playerToEdit?.name} updated successfully.`);
      } catch (err: unknown) {
        closeEditPlayerDialog();
        handleError(err);
      }
    }
  };

  const showDeletePlayerDialog = () => {
    deletePlayerDialog?.current?.showModal();
  };

  const closeDeletePlayerDialog = () => {
    deletePlayerDialog?.current?.close();
  };

  const handleDeletePlayer = async () => {
    if (!player) {
      return;
    }

    try {
      const data = await deletePlayer(player.id);
      setPlayer(null);
      closeDeletePlayerDialog();
      toast.success(`${player.name} deleted successfully.`);
      navigate("/admin/players");
    } catch (err: unknown) {
      closeDeletePlayerDialog();
      handleError(err);
    }
  };

  const handleClubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setPlayerToEdit((prev) =>
      prev && prev.club
        ? { ...prev, club: { ...prev.club, name: inputVal } }
        : prev
    );

    const matchedClub = clubs.find(
      (club) => club.name.toLowerCase() === inputVal.toLowerCase()
    );

    if (matchedClub) {
      setPlayerToEdit((prev) => (prev ? { ...prev, club: matchedClub } : null));
    }
  };

  const handleNationalityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setPlayerToEdit((prev) =>
      prev && prev.nationality
        ? { ...prev, nationality: { ...prev.nationality, name: inputVal } }
        : prev
    );

    const matchedNationality = nationalities.find(
      (nationality) => nationality.name.toLowerCase() === inputVal.toLowerCase()
    );

    if (matchedNationality) {
      setPlayerToEdit((prev) =>
        prev ? { ...prev, nationality: matchedNationality } : null
      );
    }
  };

  return (
    <section className="px-1">
      <PageTitle title="Player Details" />

      {user?.role === "ADMIN" && (
        <div className="flex items-center gap-4 mt-3">
          <button
            onClick={showEditPlayerDialog}
            className="border border-(--color-primary) text-(--color-primary) py-2 px-4 hover:bg-(--color-primary) hover:text-(--color-bg)"
          >
            <i className="fa-solid fa-pen mr-2"></i>Edit
          </button>
          <button
            onClick={showDeletePlayerDialog}
            className="border border-red-600 text-red-600 py-2 px-4 hover:bg-red-600 hover:text-(--color-bg)"
          >
            <i className="fa-solid fa-trash mr-2"></i>Delete
          </button>
        </div>
      )}

      <div className="flex items-center justify-center gap-8 my-6">
        <img
          src={player?.imageUrl}
          alt={player?.name}
          title={player?.name}
          className="w-40 h-40 object-fill rounded-full drop-shadow-[0_0_1px_var(--color-text)]"
        />
        <div className="flex flex-col gap-3">
          <h2 className="text-4xl font-bold text-(--color-primary)">
            {player?.name}
          </h2>

          <div className="flex items-center gap-3">
            <Link
              to={`/countries/${player?.nationality?.id}`}
              className="hover:scale-105"
            >
              <img
                src={player?.nationality.flagUrl}
                alt={player?.nationality.name}
                title={player?.nationality.name}
                className="w-10 h-10 object-fill rounded-full"
              />
            </Link>
            <span
              title={`ISO Code: ${player?.nationality?.isoCode}`}
              className="font-bold"
            >
              {player?.nationality.isoCode}
            </span>
          </div>
          {player?.club ? (
            <Link
              to={`/clubs/${player.club.id}`}
              title={player.club.name}
              className="group flex items-center gap-3 w-fit"
            >
              <img
                src={player.club.logoUrl}
                alt={player.club.name}
                title={player.club.name}
                className="w-10 h-10 object-contain group-hover:scale-105"
              />
              <span className="font-bold group-hover:underline group-hover:underline-offset-2">
                {player.club.name}
              </span>
            </Link>
          ) : (
            <span title="Free Agent" className="font-bold text-gray-400 italic">
              F/A
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <div className="bg-(--color-text)/10 p-4 rounded-lg">
          <h3 className="text-3xl font-bold mb-4">
            <i className="fa-solid fa-id-card mr-3"></i>
            Player Info
          </h3>
          <p className="text-lg mb-2">
            Age: <span className="font-bold">{player?.age}</span>
          </p>
          <p className="text-lg mb-2">
            Position:{" "}
            <span
              title={player?.position && mapPositionToLabel[player?.position]}
              className={`font-bold py-1 px-2 ${
                player?.position
                  ? positionColors[player?.position].join(" ")
                  : ""
              }`}
            >
              {player?.position}
            </span>
          </p>
          <p className="text-lg mb-2">
            Rating: <span className="font-bold">{player?.rating}</span>
          </p>
        </div>

        <div className="bg-(--color-text)/10 p-4 rounded-lg">
          <h3 className="text-3xl font-bold mb-4">
            <i className="fa-solid fa-file-contract mr-3"></i>
            Contract
          </h3>
          <p className="text-lg mb-2">
            Market Value:{" "}
            <span className="font-bold">${player?.marketValue}M</span>
          </p>
        </div>

        <div className="bg-(--color-text)/10 p-4 rounded-lg">
          <h3 className="text-3xl font-bold mb-4">
            <i className="fa-solid fa-shield mr-3"></i>
            Club
          </h3>
          {player?.club ? (
            <Link
              to={`/clubs/${player?.club.id}`}
              title={player?.club.name}
              className="group inline-block"
            >
              <img
                src={player?.club.logoUrl}
                alt={player?.club.name}
                title={player?.club.name}
                className="w-12 h-12 object-contain group-hover:scale-105"
              />
            </Link>
          ) : (
            <span title="Free Agent" className="font-bold text-gray-400 italic">
              F/A
            </span>
          )}
        </div>
      </div>

      <ConfirmDialog
        dialogRef={deletePlayerDialog}
        message="Are you sure you want to delete the player "
        item={player?.name || ""}
        onConfirm={handleDeletePlayer}
        onClose={closeDeletePlayerDialog}
      />
      <FormDialog
        dialogRef={editPlayerDialog}
        title="Edit Player"
        onClose={closeEditPlayerDialog}
        onSubmit={handleEditPlayer}
      >
        <div className="floating-label-effect">
          <input
            type="text"
            id="name"
            name="name"
            placeholder=""
            value={playerToEdit?.name}
            onChange={(e) =>
              setPlayerToEdit((prev) =>
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
            type="number"
            id="age"
            name="age"
            placeholder=""
            value={playerToEdit?.age}
            onChange={(e) =>
              setPlayerToEdit((prev) =>
                prev ? { ...prev, age: Number(e.target.value) } : null
              )
            }
            className="pl-3"
            required
          />
          <label htmlFor="age" className="left-4">
            Age <span className="text-red-500">*</span>
          </label>
        </div>

        <div className="floating-label-effect">
          <select
            id="position"
            name="position"
            value={playerToEdit?.position}
            onChange={(e) =>
              setPlayerToEdit((prev) =>
                prev ? { ...prev, position: e.target.value as Position } : null
              )
            }
            className="pl-3"
            required
          >
            <option value="" disabled>
              --- Select a position ---
            </option>
            {positions.map((position, index) => (
              <option key={index} value={position.value}>
                {position.label}
              </option>
            ))}
          </select>
          <label htmlFor="position" className="left-4">
            Position <span className="text-red-500">*</span>
          </label>
        </div>

        <div className="floating-label-effect">
          <input
            type="number"
            id="rating"
            name="rating"
            placeholder=""
            value={playerToEdit?.rating}
            onChange={(e) =>
              setPlayerToEdit((prev) =>
                prev ? { ...prev, rating: Number(e.target.value) } : null
              )
            }
            className="pl-3"
            required
          />
          <label htmlFor="rating" className="left-4">
            Rating <span className="text-red-500">*</span>
          </label>
        </div>

        <div className="floating-label-effect">
          <input
            type="number"
            id="marketValue"
            name="marketValue"
            placeholder=""
            value={playerToEdit?.marketValue}
            onChange={(e) =>
              setPlayerToEdit((prev) =>
                prev ? { ...prev, marketValue: Number(e.target.value) } : null
              )
            }
            className="pl-3"
            required
          />
          <label htmlFor="marketValue" className="left-4">
            Market Value <span className="text-red-500">*</span>
          </label>
        </div>

        <div className="floating-label-effect">
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            placeholder=""
            value={playerToEdit?.imageUrl}
            onChange={(e) =>
              setPlayerToEdit((prev) =>
                prev ? { ...prev, imageUrl: e.target.value } : null
              )
            }
            className="pl-3"
            required
          />
          <label htmlFor="imageUrl" className="left-4">
            Image URL <span className="text-red-500">*</span>
          </label>
        </div>

        <div className="floating-label-effect">
          <input
            type="search"
            id="club"
            name="club"
            placeholder=""
            list="clubs-list"
            value={playerToEdit?.club?.name}
            onChange={(e) => handleClubChange(e)}
            className="pl-3"
          />
          <label htmlFor="club" className="left-4">
            Club
          </label>
          <datalist id="clubs-list">
            {clubs.map((club) => (
              <option key={club.id} value={club.name} />
            ))}
          </datalist>
        </div>

        <div className="floating-label-effect">
          <input
            type="search"
            id="nationality"
            name="nationality"
            placeholder=""
            list="nationalities-list"
            value={playerToEdit?.nationality?.name}
            onChange={(e) => handleNationalityChange(e)}
            className="pl-3"
            required
          />
          <label htmlFor="nationality" className="left-4">
            Nationality <span className="text-red-500">*</span>
          </label>
          <datalist id="nationalities-list">
            {nationalities.map((nationality) => (
              <option key={nationality.id} value={nationality.name} />
            ))}
          </datalist>
        </div>
      </FormDialog>
    </section>
  );
};

export default PlayerDetails;
