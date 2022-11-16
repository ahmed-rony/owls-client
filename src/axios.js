import axios from "axios";

export const makeRequest = axios.create({
    baseURL: "http://localhost:30000/api/",
    withCredentials: true,
});
  // withCred.. to send accssToken to the back-end server;