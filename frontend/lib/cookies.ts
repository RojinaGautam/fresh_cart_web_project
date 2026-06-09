import Cookies from "js-cookie";

export const setAuthToken = (token: string) => {
  Cookies.set("token", token, {
    expires: 30,
  });
};

export const getAuthToken = () => {
  return Cookies.get("token");
};

export const removeAuthToken = () => {
  Cookies.remove("token");
};