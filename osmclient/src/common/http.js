/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import axios from "axios";
import auth from "./auth";
import { BACKEND_URL } from "@/constants";

const HTTP = axios.create({
  baseURL: BACKEND_URL,
});

const onUnauthorized = () => {
  console.log("Access denied!");
  //auth.logout();
};

const onResponseSuccess = (response) => response;

// si el servidor nos devuelve un 401 o 403,
// estamos intentando acceder a un recurso sin
// los permisos correctos
const onResponseFailure = (err) => {
  const status = err.response.status;
  // excepto cuando estemos haciendo login
  if (!err.config.url.includes("/users/login")) {
    if (status === 401 || status === 403) {
      onUnauthorized();
    }
  }
  return Promise.reject(err);
};

// en cada request hay que añadir el token de autenticación
// si es que lo tenemos
const onRequest = (config) => {
  const token = auth.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

HTTP.interceptors.response.use(onResponseSuccess, onResponseFailure);
HTTP.interceptors.request.use(onRequest);

export default HTTP;
