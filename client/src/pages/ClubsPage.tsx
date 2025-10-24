import { useEffect, useState } from "react";
import ClubCard from "../components/ClubCard";
import PageTitle from "../components/PageTitle";
import SearchFilterBar from "../components/SearchFilterBar";
import { getAllClubs } from "../services/clubService";
import type { Club } from "../types/club/club";
import { handleError } from "../utils/utils";

type ClubsPageProps = {};

const ClubsPage = ({}: ClubsPageProps) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAllClubs = async () => {
      try {
        const data = await getAllClubs();
        setClubs(data);
      } catch (err: unknown) {
        handleError(err);
      }
    };

    fetchAllClubs();
  }, []);

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

  return (
    <section className="px-1">
      <PageTitle title="Clubs" />

      <div className="flex justify-between items-center my-6">
        <SearchFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5 mt-5">
        {filteredClubs.map((club, index) => (
          <ClubCard key={club.id} club={club} index={index} />
        ))}
      </div>
    </section>
  );
};

export default ClubsPage;
