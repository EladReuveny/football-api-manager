import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../components/ConfirmDialog";
import FormDialog from "../components/FormDialog";
import PageTitle from "../components/PageTitle";
import Pagination from "../components/Pagination";
import SearchFilterBar from "../components/SearchFilterBar";
import { getAllClubs } from "../services/clubService";
import { getAllCountries } from "../services/countryService";
import {
  createPlayer,
  deletePlayer,
  getAllPlayers,
  updatePlayer,
} from "../services/playerService";
import type { Club } from "../types/club/club";
import type { PaginationQuery } from "../types/common/paginationQuery";
import type { PaginationResponse } from "../types/common/paginationResponse";
import type { Country } from "../types/countries/country";
import type { CreatePlayer } from "../types/player/createPlayer";
import type { Player } from "../types/player/player";
import type { Position } from "../types/player/position";
import {
  mapPositionToLabel,
  positionColors,
  positions,
} from "../types/player/position";
import type { UpdatePlayer } from "../types/player/updatePlayer";
import { handleError } from "../utils/utils";

type PlayersManagementProps = {};

const PlayersManagement = ({}: PlayersManagementProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [pagination, setPagination] = useState<Omit<
    PaginationResponse<Player>,
    "items"
  > | null>(null);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [nationalities, setNationalities] = useState<Country[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : undefined;
  const limit = searchParams.get("limit")
    ? Number(searchParams.get("limit"))
    : undefined;

  const addPlayerDialog = useRef<HTMLDialogElement | null>(null);
  const editPlayerDialog = useRef<HTMLDialogElement | null>(null);
  const deletePlayerDialog = useRef<HTMLDialogElement | null>(null);
  const filterDialog = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      const query: PaginationQuery = { page: page, limit };

      try {
        const data = await getAllPlayers(query);
        setPlayers(data.items);
        const { items, ...result } = data;
        setPagination(result);
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

    const fetchCountries = async () => {
      try {
        const data = await getAllCountries();
        setNationalities(data.items);
      } catch (err: unknown) {
        handleError(err);
      }
    };

    fetchPlayers();
    fetchClubs();
    fetchCountries();
  }, [page, limit]);

  useEffect(() => {
    const searchTerm = searchQuery.trim().toLowerCase();
    if (!searchTerm) {
      setFilteredPlayers(players);
      return;
    }

    const filtered = players.filter((player) =>
      player.name.toLocaleLowerCase().includes(searchTerm)
    );

    setFilteredPlayers(filtered);
  }, [searchQuery, players]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page), limit: String(pagination?.limit) });
  };

  const showAddPlayerDialog = () => {
    addPlayerDialog?.current?.showModal();
  };

  const closeAddPlayerDialog = () => {
    addPlayerDialog?.current?.close();
  };

  const handleAddPlayer = async (e: React.FormEvent<HTMLFormElement>) => {
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

    if (!matchedNationality) {
      toast.error("Nationality not found.");
      return;
    }

    const createPlayerDto: CreatePlayer = {
      name: formData.get("name") as string,
      age: Number(formData.get("age")) as number,
      position: formData.get("position") as Position,
      rating: Number(formData.get("rating")) as number,
      marketValue: Number(formData.get("marketValue")) as number,
      imageUrl: formData.get("imageUrl") as string,
      clubId: matchedClub?.id,
      nationalityId: matchedNationality?.id,
    };

    try {
      const data = await createPlayer(createPlayerDto);
      setPlayers((prev) => [...prev, data]);
      closeAddPlayerDialog();
      toast.success(`${createPlayerDto.name} added successfully.`);
    } catch (err: unknown) {
      closeAddPlayerDialog();
      handleError(err);
    }
  };

  const showEditPlayerDialog = (player: Player) => {
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

        setPlayers((prev) =>
          prev.map((player) => (player.id === playerToEdit.id ? data : player))
        );
        closeEditPlayerDialog();
        toast.success("Updated successfully.");
      } catch (err: unknown) {
        closeEditPlayerDialog();
        handleError(err);
      }
    }
  };

  const showDeletePlayerDialog = (player: Player) => {
    setPlayerToDelete(player);
    deletePlayerDialog?.current?.showModal();
  };

  const closeDeletePlayerDialog = () => {
    setPlayerToDelete(null);
    deletePlayerDialog?.current?.close();
  };

  const handleDeletePlayer = async () => {
    if (!playerToDelete) {
      return;
    }

    try {
      await deletePlayer(playerToDelete.id);
      setPlayers((prev) =>
        prev.filter((player) => player.id !== playerToDelete.id)
      );
      closeDeletePlayerDialog();
      toast.success(`${playerToDelete.name} deleted successfully.`);
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
      <PageTitle title="Players Management" />

      <div className="flex justify-between items-center my-6">
        <SearchFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterDialog={filterDialog}
        >
          <div className="floating-label-effect">
            <input
              type="text"
              id="name"
              name="name"
              placeholder=""
              className="pl-3"
            />
            <label htmlFor="name" className="left-4">
              Name
            </label>
          </div>

          <div className="floating-label-effect">
            <input
              type="number"
              id="age"
              name="age"
              min={16}
              max={45}
              step={1}
              placeholder=""
              className="pl-3"
            />
            <label htmlFor="age" className="left-4">
              Age
            </label>
          </div>

          <div className="floating-label-effect">
            <select id="position" name="position" className="pl-3">
              <option value="">All</option>
              <option value="GK">Goalkeeper</option>
              <option value="DF">Defender</option>
              <option value="MF">Midfielder</option>
              <option value="FW">Forward</option>
            </select>
            <label htmlFor="position" className="left-4">
              Position
            </label>
          </div>

          <div className="floating-label-effect">
            <input
              type="number"
              id="rating"
              name="rating"
              min={55}
              max={100}
              step={1}
              placeholder=""
              className="pl-3"
            />
            <label htmlFor="rating" className="left-4">
              Minimum Rating
            </label>
          </div>

          <div className="floating-label-effect">
            <input
              type="number"
              id="marketValue"
              name="marketValue"
              min={0}
              step={0.1}
              placeholder=""
              className="pl-3"
            />
            <label htmlFor="marketValue" className="left-4">
              Max Market Value (€M)
            </label>
          </div>

          <div className="floating-label-effect">
            <input
              type="text"
              id="club"
              name="club"
              placeholder=""
              className="pl-3"
            />
            <label htmlFor="club" className="left-4">
              Club
            </label>
          </div>

          <div className="floating-label-effect">
            <input
              type="text"
              id="nationality"
              name="nationality"
              placeholder=""
              className="pl-3"
            />
            <label htmlFor="nationality" className="left-4">
              Nationality
            </label>
          </div>
        </SearchFilterBar>
        <button
          className="border border-(--color-primary) text-(--color-primary) py-2 px-4 rounded hover:bg-(--color-primary) hover:text-(--color-bg)"
          onClick={showAddPlayerDialog}
        >
          <i className="fa-solid fa-plus"></i>
          Add Player
        </button>
      </div>

      <table className="w-full text-center align-middle font-bold">
        <thead className="bg-(--color-text) text-(--color-bg)">
          <tr>
            <th>#</th>
            <th className="p-2">Name</th>
            <th className="p-2">Age</th>
            <th className="p-2">Position</th>
            <th className="p-2">Rating</th>
            <th className="p-2">Market Value</th>
            <th className="p-2">Image</th>
            <th className="p-2">Club</th>
            <th className="p-2">Nationality</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlayers.map((player, index) => (
            <tr
              key={player.id}
              className="border-b border-gray-500 odd:bg-(--color-text)/10 even:bg-(--color-text)/20 hover:bg-(--color-primary)/50"
            >
              <td className="p-2">{index + 1}</td>
              <td className="p-2">
                <Link
                  to={`/players/${player.id}`}
                  title={player.name}
                  className="hover:underline hover:underline-offset-2"
                >
                  {player.name}
                </Link>
              </td>
              <td className="p-2">{player.age}</td>
              <td className="p-2" title={mapPositionToLabel[player.position]}>
                <span
                  className={`inline-block py-1 px-2 rounded ${positionColors[
                    player.position
                  ].join(" ")}`}
                >
                  {player.position}
                </span>
              </td>

              <td className="p-2">{player.rating}</td>
              <td className="p-2">${player.marketValue}M</td>
              <td className="px-2">
                <img
                  src={player.imageUrl}
                  alt={player.name}
                  title={player.name}
                  className="object-contain w-16 h-full inline-block"
                />
              </td>
              <td className="p-2">
                {player.club?.logoUrl ? (
                  <Link to={`/clubs/${player.club.id}`}>
                    <img
                      src={player.club.logoUrl}
                      alt={player.club.name}
                      title={player.club.name}
                      className="object-contain w-8 h-8 inline-block"
                    />
                  </Link>
                ) : (
                  <span
                    title="Free Agent"
                    className="font-bold text-gray-400 italic"
                  >
                    F/A
                  </span>
                )}
              </td>
              <td className="p-2">
                <img
                  src={player.nationality?.flagUrl}
                  alt={player.nationality?.name}
                  title={player.nationality?.name}
                  className="object-contain w-8 h-8 inline-block"
                />
              </td>
              <td className="p-2">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => showEditPlayerDialog(player)}
                    className="text-gray-300 hover:brightness-115"
                    title="Edit"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button
                    onClick={() => showDeletePlayerDialog(player)}
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
            Found <b>{filteredPlayers.length}</b>{" "}
            {filteredPlayers.length === 1 ? "result" : "results"} out of{" "}
            <b>{pagination?.totalItems}</b>
          </p>
          <p>
            Page <b>{page || 1}</b> out of <b>{pagination?.totalPages}</b>
          </p>
        </div>
      </div>

      <FormDialog
        dialogRef={addPlayerDialog}
        title="Add Player"
        onClose={closeAddPlayerDialog}
        onSubmit={handleAddPlayer}
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
            type="number"
            id="age"
            name="age"
            placeholder=""
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
            defaultValue={""}
            className="pl-3"
            required
          >
            <option value="" disabled hidden>
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
      <ConfirmDialog
        dialogRef={deletePlayerDialog}
        message="Are you sure you want to delete the player "
        item={playerToDelete?.name || ""}
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
            <option value="" disabled hidden>
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

export default PlayersManagement;
