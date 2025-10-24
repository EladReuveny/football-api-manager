import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import SearchFilterBar from "../components/SearchFilterBar";
import { getAllCountries } from "../services/countryService";
import type { Country } from "../types/countries/country";
import { handleError } from "../utils/utils";

type CountriesPageProps = {};

const CountriesPage = ({}: CountriesPageProps) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await getAllCountries();
        setCountries(data);
      } catch (err: unknown) {
        handleError(err);
      }
    };

    fetchCountries();
  }, []);

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
    </section>
  );
};

export default CountriesPage;
