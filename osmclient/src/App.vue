<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->

<template>
  <nav class="navbar navbar-expand-lg bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/myTasks">
        <img
          src="/openstreetmap.ico"
          width="30"
          height="30"
          class="d-inline-block align-top"
          alt="OpenStreetMap logo"
        />
        OSMParser
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0"></ul>
        <div v-if="isLogged">
          <router-link to="/myDatabases"
            ><button class="btn btn-primary mr-2" type="button" id="myDBs">
              My databases
            </button></router-link
          >
        </div>
        <div v-if="isLogged">
          <router-link to="/myTasks"
            ><button class="btn btn-primary mr-2" type="button" id="myTasks">
              My tasks
            </button></router-link
          >
        </div>
        <div v-if="isLogged">
          <router-link to="/data">
            <button class="btn btn-primary mr-2" type="button" id="seeData">
              See imported data
            </button>
          </router-link>
        </div>
        <div class="dropdown" v-if="isLogged">
          <button
            class="btn btn-outline-success dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="fa fa-user"></i> &nbsp;{{ store.state.user.login }}
          </button>
          <ul
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="dropdownMenuButton1"
          >
            <li>
              <a class="dropdown-item" @click.prevent="logout"
                ><i class="bi bi-box-arrow-right"></i> Logout</a
              >
            </li>
          </ul>
        </div>
        <div class="d-flex" v-if="!isLogged">
          <router-link to="/login"
            ><button class="btn btn-outline-success" type="submit">
              Sign in
            </button></router-link
          >
        </div>
      </div>
    </div>
  </nav>
  <section v-if="isHome">
    <div class="container text-start">
      <div class="row">
        <div class="col-6 col-sm-6 col-md-1">
          <router-link to="/addDatabase"
            ><button class="btn"><i class="bi-plus-square fa-3x"></i></button
          ></router-link>
          <p class="addDb">Database</p>
        </div>
        <div class="col-6 col-sm-6 col-md-2">
          <router-link to="/createTask"
            ><button class="btn"><i class="bi-plus-square fa-3x"></i></button
          ></router-link>
          <p class="createTask">Task</p>
        </div>
      </div>
    </div>
  </section>
  <router-view />
</template>

<script>
import auth from "./common/auth";
import { getStore } from "./common/store";
import router from "@/router";

export default {
  data() {
    return {
      store: getStore(),
    };
  },
  computed: {
    isLogged() {
      return this.store.state.user.logged;
    },
    isHome() {
      return router.currentRoute.value.name === "Home";
    },
  },
  methods: {
    logout() {
      auth.logout();
      // Después de hacer logout nos vamos a home
      if (router.currentRoute.value.name !== "Home") {
        router.push({ name: "Login" });
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
}

.addDb {
  display: block;
  text-align: start;
}

.createTask {
  display: block;
  text-align: start;
}

#myDBs,
#myTasks,
#seeData {
  color: white;
}
</style>
