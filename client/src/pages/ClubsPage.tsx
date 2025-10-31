import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ClubCard from "../components/ClubCard";
import PageTitle from "../components/PageTitle";
import Pagination from "../components/Pagination";
import SearchFilterBar from "../components/SearchFilterBar";
import { getAllClubs } from "../services/clubService";
import type { Club } from "../types/club/club";
import type { PaginationQuery } from "../types/common/paginationQuery";
import type { PaginationResponse } from "../types/common/paginationResponse";
import { handleError } from "../utils/utils";

type ClubsPageProps = {};

const ClubsPage = ({}: ClubsPageProps) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<Omit<
    PaginationResponse<Club>,
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
    const fetchClubs = async () => {
      const query: PaginationQuery = { page, limit };

      try {
        const data = await getAllClubs(query);
        setClubs(data.items);
        const { items, ...result } = data;
        setPagination(result);
      } catch (err: unknown) {
        handleError(err);
      }
    };

    fetchClubs();
  }, [page, limit]);

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

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page), limit: String(pagination?.limit) });
  };

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

      <div className="mt-8 flex flex-col items-center gap-3">
        <Pagination
          pagination={pagination}
          onPageChange={(page) => handlePageChange(page)}
        />

        <div className="text-center text-gray-400 text-sm">
          <p>
            Found <b>{filteredClubs.length}</b>{" "}
            {filteredClubs.length === 1 ? "result" : "results"} out of{" "}
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

export default ClubsPage;
