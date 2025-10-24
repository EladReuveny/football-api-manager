import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import PlayerCard from "../components/PlayerCard";
import SearchFilterBar from "../components/SearchFilterBar";
import { getAllPlayers } from "../services/playerService";
import type { Player } from "../types/player/player";
import { handleError } from "../utils/utils";

type PlayersPageProps = {};

const PlayersPage = ({}: PlayersPageProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAllPlayers = async () => {
      try {
        const data = await getAllPlayers();
        setPlayers(data);
      } catch (err: unknown) {
        handleError(err);
      }
    };

    fetchAllPlayers();
  }, []);

  useEffect(() => {
    const searchTerm = searchQuery.trim().toLowerCase();
    if (!searchTerm) {
      setFilteredPlayers(players);
      return;
    }

    const filtered = players.filter((player) =>
      player.name.toLowerCase().includes(searchTerm)
    );

    setFilteredPlayers(filtered);
  }, [searchQuery, players]);

  return (
    <section className="px-1">
      <PageTitle title="Players" />

      <div className="flex justify-between items-center my-6">
        <SearchFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5 mt-5">
        {filteredPlayers.map((player, index) => (
          <PlayerCard key={player.id} player={player} index={index} />
        ))}
      </div>
    </section>
  );
};

export default PlayersPage;
