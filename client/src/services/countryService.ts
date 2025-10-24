import { api } from "../config";
import type { CreateCountry } from "../types/countries/createCountry";
import type { UpdateCountry } from "../types/countries/updateCountry";

const BASE_URL = "countries";

export const getAllCountries = async () => {
  const res = await api.get(`/${BASE_URL}`);
  return res.data;
};

export const getCountryById = async (id: number) => {
  const res = await api.get(`/${BASE_URL}/${id}`);
  return res.data;
};

export const createCountry = async (createCountry: CreateCountry) => {
  const res = await api.post(`/${BASE_URL}`, createCountry);
  return res.data;
};

export const updateCountry = async (
  id: number,
  updateCountry: UpdateCountry
) => {
  const res = await api.patch(`/${BASE_URL}/${id}`, updateCountry);
  return res.data;
};

export const deleteCountry = async (id: number) => {
  const res = await api.delete(`/${BASE_URL}/${id}`);
  return res.data;
};

export const createBulkCountries = async (createCountries: CreateCountry[]) => {
  const res = await api.post(`/${BASE_URL}/create-bulk`, createCountries);
  return res.data;
};
