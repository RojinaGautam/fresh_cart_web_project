"use client";

import Cookies from "js-cookie";
import { FreshCartUser } from "./api/auth";

const AUTH_TOKEN_KEY = "auth_token";
const USER_DATA_KEY = "user_data";

const cookieOptions = {
  expires: 30,
  path: "/",
};

export const setAuthToken = (token: string) => {
  Cookies.set(AUTH_TOKEN_KEY, token, cookieOptions);
};

export const getAuthToken = () => Cookies.get(AUTH_TOKEN_KEY);

export const setStoredUser = (user: FreshCartUser) => {
  Cookies.set(USER_DATA_KEY, JSON.stringify(user), cookieOptions);
};

export const getStoredUser = (): FreshCartUser | null => {
  const userData = Cookies.get(USER_DATA_KEY);

  if (!userData) return null;

  try {
    return JSON.parse(userData) as FreshCartUser;
  } catch {
    Cookies.remove(USER_DATA_KEY, { path: "/" });
    return null;
  }
};

export const clearStoredAuth = () => {
  Cookies.remove(AUTH_TOKEN_KEY, { path: "/" });
  Cookies.remove(USER_DATA_KEY, { path: "/" });
};
