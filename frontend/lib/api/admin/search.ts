import axiosInstance from "../axios-instance";
import { API_ENDPOINTS } from "../endpoints";

export type AdminSearchHit = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
};

export type AdminSearchGroup = {
  key: string;
  label: string;
  total: number;
  hits: AdminSearchHit[];
};

export type AdminSearchResult = {
  query: string;
  totalResults: number;
  groups: AdminSearchGroup[];
};

export const adminSearchApi = async (query: string) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_SEARCH, {
    params: { q: query },
  });
  return response.data;
};
