import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CompetitionCard from "../components/CompetitionCard";
import PageTitle from "../components/PageTitle";
import Pagination from "../components/Pagination";
import SearchFilterBar from "../components/SearchFilterBar";
import { getAllCompetitions } from "../services/competitionService";
import type { PaginationQuery } from "../types/common/paginationQuery";
import type { PaginationResponse } from "../types/common/paginationResponse";
import type { Competition } from "../types/competition/competition";
import { handleError } from "../utils/utils";

type CompetitionsPageProps = {};

const CompetitionsPage = ({}: CompetitionsPageProps) => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [filteredCompetitions, setFilteredCompetitions] = useState<
    Competition[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<Omit<
    PaginationResponse<Competition>,
    "items"
  > | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : undefined;
  const limit = searchParams.get("limit")
    ? Number(searchParams.get("limit"))
    : undefined;

  useEffect(() => {
    const fetchCompetitions = async () => {
      const query: PaginationQuery = { page, limit };

      try {
        const data = await getAllCompetitions(query);
        setCompetitions(data.items);
        const { items, ...result } = data;
        setPagination(result);
      } catch (err: unknown) {
        handleError(err);
      }
    };

    fetchCompetitions();
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
  }, [searchQuery, competitions]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page), limit: String(pagination?.limit) });
  };

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
    </section>
  );
};

export default CompetitionsPage;
