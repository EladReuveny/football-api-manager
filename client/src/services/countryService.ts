import { api } from "../config";
import type { Country } from "../types/countries/country";
import type { CreateCountry } from "../types/countries/createCountry";
import type { UpdateCountry } from "../types/countries/updateCountry";

const BASE_URL = "countries";

/**
 * Fetches all countries.
 *
 * @async
 * @function getAllCountries
 * @returns {Promise<Country[]>} A promise that resolves to a list of all countries.
 */
export const getAllCountries = async (): Promise<Country[]> => {
  const res = await api.get(`/${BASE_URL}`);
  return res.data;
};

/**
 * Fetches a single country by its ID.
 *
 * @async
 * @function getCountryById
 * @param {number} id - The unique identifier of the country.
 * @returns {Promise<Country>} A promise that resolves to the country data.
 */
export const getCountryById = async (id: number): Promise<Country> => {
  const res = await api.get(`/${BASE_URL}/${id}`);
  return res.data;
};

/**
 * Creates a new country.
 *
 * @async
 * @function createCountry
 * @param {CreateCountry} createCountry - The country creation data.
 * @returns {Promise<Country>} A promise that resolves to the created country data.
 */
export const createCountry = async (
  createCountry: CreateCountry
): Promise<Country> => {
  const res = await api.post(`/${BASE_URL}`, createCountry);
  return res.data;
};

/**
 * Updates an existing country by ID.
 *
 * @async
 * @function updateCountry
 * @param {number} id - The unique identifier of the country to update.
 * @param {UpdateCountry} updateCountry - The updated country data.
 * @returns {Promise<Country>} A promise that resolves to the updated country data.
 */
export const updateCountry = async (
  id: number,
  updateCountry: UpdateCountry
): Promise<Country> => {
  const res = await api.patch(`/${BASE_URL}/${id}`, updateCountry);
  return res.data;
};

/**
 * Deletes a country by ID.
 *
 * @async
 * @function deleteCountry
 * @param {number} id - The unique identifier of the country to delete.
 * @returns {Promise<any>} A promise that resolves when the country is deleted.
 */
export const deleteCountry = async (id: number): Promise<any> => {
  const res = await api.delete(`/${BASE_URL}/${id}`);
  return res.data;
};

/**
 * Creates multiple countries in bulk.
 *
 * @async
 * @function createBulkCountries
 * @param {CreateCountry[]} createCountries - An array of country creation objects.
 * @returns {Promise<Country[]>} A promise that resolves to the created countries.
 */
export const createBulkCountries = async (
  createCountries: CreateCountry[]
): Promise<Country[]> => {
  const res = await api.post(`/${BASE_URL}/create-bulk`, createCountries);
  return res.data;
};
