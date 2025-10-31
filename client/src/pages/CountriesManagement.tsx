import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../components/ConfirmDialog";
import FormDialog from "../components/FormDialog";
import PageTitle from "../components/PageTitle";
import SearchFilterBar from "../components/SearchFilterBar";
import {
  createCountry,
  deleteCountry,
  getAllCountries,
  updateCountry,
} from "../services/countryService";
import type { PaginationQuery } from "../types/common/paginationQuery";
import type { PaginationResponse } from "../types/common/paginationResponse";
import type { Country } from "../types/countries/country";
import type { CreateCountry } from "../types/countries/createCountry";
import type { UpdateCountry } from "../types/countries/updateCountry";
import { handleError } from "../utils/utils";
import Pagination from "../components/Pagination";

type CountriesManagementProps = {};

const CountriesManagement = ({}: CountriesManagementProps) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [pagination, setPagination] = useState<Omit<
    PaginationResponse<Country>,
    "items"
  > | null>(null);
  const [countryToEdit, setCountryToEdit] = useState<Country | null>(null);
  const [countryToDelete, setCountryToDelete] = useState<Country | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : undefined;
  const limit = searchParams.get("limit")
    ? Number(searchParams.get("limit"))
    : undefined;

  const addCountryDialog = useRef<HTMLDialogElement | null>(null);
  const editCountryDialog = useRef<HTMLDialogElement | null>(null);
  const deleteCountryDialog = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      const query: PaginationQuery = { page: page, limit };

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
  }, [countries, searchQuery]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page), limit: String(pagination?.limit) });
  };

  const handleAddCountry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const createCountryDto: CreateCountry = {
      name: formData.get("name") as string,
      isoCode: formData.get("isoCode") as string,
      flagUrl: formData.get("flagUrl") as string,
    };

    try {
      const data = await createCountry(createCountryDto);
      setCountries((prev) => [...prev, data]);
      closeAddCountryDialog();
      toast.success(`${createCountryDto.name} added successfully.`);
    } catch (err: unknown) {
      closeAddCountryDialog();
      handleError(err);
    }
  };

  const showAddCountryDialog = () => {
    addCountryDialog?.current?.showModal();
  };

  const closeAddCountryDialog = () => {
    addCountryDialog?.current?.close();
  };

  const handleEditCountry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!countryToEdit) {
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const updateCountryDto: UpdateCountry = {
      name: formData.get("name") as string,
      isoCode: formData.get("isoCode") as string,
      flagUrl: formData.get("flagUrl") as string,
    };

    try {
      const data = await updateCountry(countryToEdit.id, updateCountryDto);
      setCountries((prev) =>
        prev.map((country) =>
          country.id === countryToEdit.id ? data : country
        )
      );
      closeEditCountryDialog();
      toast.success(`${updateCountryDto.name} updated successfully.`);
    } catch (err: unknown) {
      closeEditCountryDialog();
      handleError(err);
    }
  };

  const showEditCountryDialog = (country: Country) => {
    setCountryToEdit(country);
    editCountryDialog?.current?.showModal();
  };

  const closeEditCountryDialog = () => {
    setCountryToEdit(null);
    editCountryDialog?.current?.close();
  };

  const handleDeleteCountry = async () => {
    if (!countryToDelete) {
      return;
    }

    try {
      await deleteCountry(countryToDelete.id);
      setCountries((prev) =>
        prev.filter((country) => country.id !== countryToDelete.id)
      );
      closeDeleteCountryDialog();
      toast.success(`${countryToDelete.name} deleted successfully.`);
    } catch (err: unknown) {
      closeDeleteCountryDialog();
      handleError(err);
    }
  };

  const showDeleteCountryDialog = (country: Country) => {
    setCountryToDelete(country);
    deleteCountryDialog?.current?.showModal();
  };

  const closeDeleteCountryDialog = () => {
    deleteCountryDialog?.current?.close();
  };

  return (
    <section className="px-1">
      <PageTitle title="Countries Management" />

      <div className="flex justify-between items-center my-6">
        <SearchFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <button
          className="border border-(--color-primary) text-(--color-primary) py-2 px-4 rounded hover:bg-(--color-primary) hover:text-(--color-bg)"
          onClick={showAddCountryDialog}
        >
          <i className="fa-solid fa-plus"></i>
          Add Country
        </button>
      </div>

      <table className="w-full text-center align-middle font-bold">
        <thead className="bg-(--color-text) text-(--color-bg)">
          <tr>
            <th>#</th>
            <th className="p-2">Name</th>
            <th className="p-2">ISO Code</th>
            <th className="p-2">Actions</th>
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
                  <img
                    src={country.flagUrl}
                    alt={country.name}
                    title={country.name}
                    className="object-contain w-9 h-9 inline-block mr-2"
                  />
                  {country.name}
                </Link>
              </td>
              <td className="p-2">{country.isoCode}</td>
              <td className="p-2">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => showEditCountryDialog(country)}
                    className="text-gray-300 hover:brightness-115"
                    title="Edit"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button
                    onClick={() => showDeleteCountryDialog(country)}
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
            Found <b>{filteredCountries.length}</b>{" "}
            {filteredCountries.length === 1 ? "result" : "results"} out of{" "}
            <b>{pagination?.totalItems}</b>
          </p>
          <p>
            Page <b>{page || 1}</b> out of <b>{pagination?.totalPages}</b>
          </p>
        </div>
      </div>

      <FormDialog
        dialogRef={addCountryDialog}
        title="Add Country"
        onClose={closeAddCountryDialog}
        onSubmit={handleAddCountry}
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
            type="text"
            id="isoCode"
            name="isoCode"
            placeholder=""
            className="pl-3"
            required
          />
          <label htmlFor="isoCode" className="left-4">
            ISO Code <span className="text-red-500">*</span>
          </label>
        </div>

        <div className="floating-label-effect">
          <input
            type="text"
            id="flagUrl"
            name="flagUrl"
            placeholder=""
            className="pl-3"
            required
          />
          <label htmlFor="flagUrl" className="left-4">
            Flag URL <span className="text-red-500">*</span>
          </label>
        </div>
      </FormDialog>
      <ConfirmDialog
        dialogRef={deleteCountryDialog}
        message="Are you sure you want to delete the country "
        item={countryToDelete?.name || ""}
        onConfirm={handleDeleteCountry}
        onClose={closeDeleteCountryDialog}
      />
      <FormDialog
        dialogRef={editCountryDialog}
        title="Edit Country"
        onClose={closeEditCountryDialog}
        onSubmit={handleEditCountry}
      >
        <div className="floating-label-effect">
          <input
            type="text"
            id="name"
            name="name"
            placeholder=""
            value={countryToEdit?.name}
            onChange={(e) =>
              setCountryToEdit((prev) =>
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
            id="isoCode"
            name="isoCode"
            placeholder=""
            value={countryToEdit?.isoCode}
            onChange={(e) =>
              setCountryToEdit((prev) =>
                prev ? { ...prev, isoCode: e.target.value } : null
              )
            }
            className="pl-3"
            required
          />
          <label htmlFor="isoCode" className="left-4">
            ISO Code <span className="text-red-500">*</span>
          </label>
        </div>

        <div className="floating-label-effect">
          <input
            type="text"
            id="flagUrl"
            name="flagUrl"
            placeholder=""
            value={countryToEdit?.flagUrl}
            onChange={(e) =>
              setCountryToEdit((prev) =>
                prev ? { ...prev, flagUrl: e.target.value } : null
              )
            }
            className="pl-3"
            required
          />
          <label htmlFor="flagUrl" className="left-4">
            Flag URL <span className="text-red-500">*</span>
          </label>
        </div>
      </FormDialog>
    </section>
  );
};

export default CountriesManagement;
