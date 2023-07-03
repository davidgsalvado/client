/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import HTTP from "./http.js";
import { getStore } from "./store.js";

export default {
  signUp,
  login,
  logout,
  getToken,
  isAdmin,
  isAuthenticationChecked: isAuthenticationChecked(),
  tryLoginFromServiceToken,
};

function signUp(credentials) {
  return HTTP.post("/users/signUp", credentials).then((response) => {
    _saveToken(response.data.serviceToken);
    _getData(
      response.data.user.userName,
      response.data.user.email,
      response.data.user.role
    );
    return getStore().state.user;
  });
}

function tryLoginFromServiceToken() {
  const serviceToken = getToken();
  return HTTP.post("/users/loginFromServiceToken", serviceToken).then(
    (response) => {
      _getData(
        response.data.user.userName,
        response.data.user.email,
        response.data.user.role
      );
    }
  );
}

function login(credentials) {
  return HTTP.post("/users/login", credentials).then((response) => {
    _saveToken(response.data.serviceToken);
    _getData(
      response.data.user.userName,
      response.data.user.email,
      response.data.user.role
    );
    return getStore().state.user;
  });
}

function logout() {
  _removeToken();
  getStore().state.user.login = "";
  getStore().state.user.authority = "";
  getStore().state.user.email = "";
  getStore().state.user.logged = false;
}

function getToken() {
  return sessionStorage.getItem("token");
}

function isAdmin() {
  return getStore().state.user.authority === "ADMIN";
}

// usamos localStorage para guardar el token, de forma
// que sea persistente (se inhabilita con el tiempo o
// al hacer logout)
function _saveToken(token) {
  sessionStorage.setItem("token", token);
}

function _removeToken() {
  sessionStorage.removeItem("token");
}

// si tenemos el token guardado, esta petición se hará
// con el filtro definido en http-common y por tanto nos
// devolverá el usuario logueado
async function _authenticate() {
  try {
    await tryLoginFromServiceToken();
    const store = getStore();
    return store.state.user;
  } catch (err) {
    console.error(err);
  }
}

function _getData(username, email, role) {
  getStore().state.user.login = username;
  getStore().state.user.email = email;
  getStore().state.user.authority = role;
  getStore().state.user.logged = true;
}

// este método devuelve una promesa que se resuelve cuando
// se haya comprobado si el token, de existir, es válido o no
function isAuthenticationChecked() {
  return new Promise((res) => {
    if (getToken()) {
      _authenticate()
        .catch(() => logout())
        .finally(() => res(true));
    } else {
      res(true);
    }
  });
}
