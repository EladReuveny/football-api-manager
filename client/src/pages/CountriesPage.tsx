import { useEffect, useState } from "react";

import { Link, useSearchParams } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import Pagination from "../components/Pagination";
import SearchFilterBar from "../components/SearchFilterBar";
import { getAllCountries } from "../services/countryService";
import type { PaginationQuery } from "../types/common/paginationQuery";
import type { PaginationResponse } from "../types/common/paginationResponse";
import type { Country } from "../types/countries/country";
import { handleError } from "../utils/utils";

type CountriesPageProps = {};

const CountriesPage = ({}: CountriesPageProps) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<Omit<
    PaginationResponse<Country>,
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
    const fetchCountries = async () => {
      const query: PaginationQuery = { page, limit };

      try {
        const data = await getAllCountries(query);
        setCountries(data.items);
        const { items, ...result } = data;
        setPagination(result);
      } catch (err: unknown) {
        handleError(err);
      }
    };

    fetchCountries();
  }, [page, limit]);

  useEffect(() => {
    const searchTerm = searchQuery.trim().toLowerCase();
    if (!searchTerm) {
      setFilteredCountries(countries);
      return;
    }

    const filtered = countries.filter((country) =>
      country.name.toLowerCase().includes(searchTerm)
    );

    setFilteredCountries(filtered);
  }, [searchQuery, countries]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page), limit: String(pagination?.limit) });
  };

  return (
    <section className="px-1">
      <PageTitle title="Countries" />

      <div className="flex justify-between items-center my-6">
        <SearchFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      <table className="w-full text-center align-middle font-bold my-6">
        <thead className="bg-(--color-text) text-(--color-bg)">
          <tr>
            <th>#</th>
            <th className="p-2">Name</th>
            <th className="p-2">ISO Code</th>
            <th className="p-2">Flag</th>
          </tr>
        </thead>
        <tbody>
          {filteredCountries.map((country, index) => (
            <tr
              key={country.id}
              className="border-b border-gray-500 odd:bg-(--color-text)/10 even:bg-(--color-text)/20 hover:bg-(--color-primary)/50"
            >
              <td className="p-2">{index + 1}</td>
              <td className="p-2">
                <Link
                  to={`/countries/${country.id}`}
                  title={country.name}
                  className="hover:underline hover:underline-offset-2"
                >
                  {country.name}
                </Link>
              </td>
              <td className="p-2">{country.isoCode}</td>
              <td className="p-2">
                <img
                  src={country.flagUrl}
                  alt={country.name}
                  title={country.name}
                  className="object-contain w-10 h-10 inline-block mr-2"
                />
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
            Found <b>{filteredCountries.length}</b>{" "}
            {filteredCountries.length === 1 ? "result" : "results"} out of{" "}
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

export default CountriesPage;
