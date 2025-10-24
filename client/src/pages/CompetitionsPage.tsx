import { useEffect, useState } from "react";
import CompetitionCard from "../components/CompetitionCard";
import PageTitle from "../components/PageTitle";
import SearchFilterBar from "../components/SearchFilterBar";
import { getAllCompetitions } from "../services/competitionService";
import type { Competition } from "../types/competition/competition";
import { handleError } from "../utils/utils";

type CompetitionsPageProps = {};

const CompetitionsPage = ({}: CompetitionsPageProps) => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [filteredCompetitions, setFilteredCompetitions] = useState<
    Competition[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAllCompetitions = async () => {
      try {
        const data = await getAllCompetitions();
        setCompetitions(data);
      } catch (err: unknown) {
        handleError(err);
      }
    };

    fetchAllCompetitions();
  }, []);

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
  }, [searchQuery, competitions]);

  return (
    <section className="px-1">
      <PageTitle title="Competitions" />

      <div className="flex justify-between items-center my-6">
        <SearchFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5 mt-5">
        {filteredCompetitions.map((competition, index) => (
          <CompetitionCard
            key={competition.id}
            competition={competition}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default CompetitionsPage;
