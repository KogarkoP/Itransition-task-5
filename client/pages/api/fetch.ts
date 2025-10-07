import axios from "axios";
import { UserInsert, UpdateUsers } from "@/types/user";
import Cookies from "js-cookie";

export const BASE_URL = "https://itransition-task-5-e4l1.onrender.com";
// export const BASE_URL = "http://localhost:3005";

export const getAllUsers = async () => {
  const jwt = Cookies.get("@user_jwt");
  const response = await axios.get(`${BASE_URL}/users`, {
    headers: { Authorization: jwt },
  });
  return response;
};

export const insertUser = async (user: UserInsert) => {
  const response = await axios.post(`${BASE_URL}/users/register`, user);
  return response;
};

export const login = async (logindata: { email: string; password: string }) => {
  const response = await axios.post(`${BASE_URL}/users/login`, logindata);
  return response;
};

export const deleteUsersByIds = async (users: string[]) => {
  const jwt = Cookies.get("@user_jwt");

  const response = await axios.delete(`${BASE_URL}/users/delete`, {
    headers: { Authorization: jwt },
    data: { ids: users },
  });

  return response;
};

export const updateUsersByIds = async ({ usersIds, update }: UpdateUsers) => {
  const jwt = Cookies.get("@user_jwt");

  const response = await axios.put(
    `${BASE_URL}/users/update`,
    {
      usersIds: usersIds,
      update: update,
    },

    {
      headers: { Authorization: jwt },
    }
  );

  return response;
};

export const postRequest = async (body: string) => {
  const response = await axios.post(`${BASE_URL}/users/verify-email`, body);
  const data = response.data;

  if (response.status < 200 || response.status >= 300) {
    let message;

    if (data?.message) {
      message = data.message;
    } else {
      message = data;
    }

    return { error: true, status: response.status, message };
  }

  return data;
};
