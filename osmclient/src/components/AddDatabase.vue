<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->

<template>
  <div id="bigContainer">
    <div class="container h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5 mx-auto">
          <form>
            <div class="card text-white" style="border-radius: 1rem">
              <div class="card-body p-4 p-sm-5 text-center">
                <div class="mb-md-5 mt-md-4 pb-5">
                  <h2 class="fw-bold mb-2 text-black">New database</h2>

                  <div class="form-floating mt-3 mb-3">
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      placeholder="Name"
                      v-model="addDbForm.database"
                      tabindex="0"
                      aria-required="true"
                      aria-labelledby="nameLabel"
                    />
                    <label for="name" id="nameLabel">Name*</label>
                  </div>

                  <div class="form mt-3 mb-3">
                    <select
                      class="form-select"
                      aria-label="Database type dropdown"
                      v-model="addDbForm.typeId"
                      tabindex="0"
                      aria-required="true"
                    >
                      <option disabled value="" hidden>Database type</option>
                      <option v-for="type in databaseTypes" :value="type.id">
                        {{ type.name }}
                      </option>
                    </select>
                  </div>

                  <div class="form-floating mt-3 mb-3">
                    <input
                      type="text"
                      class="form-control"
                      id="host"
                      placeholder="Host"
                      v-model="addDbForm.host"
                      aria-required="true"
                      aria-labelledby="hostLabel"
                    />
                    <label for="host" id="hostLabel">Host*</label>
                  </div>

                  <div class="form-floating mt-3 mb-3">
                    <input
                      type="number"
                      class="form-control"
                      id="port"
                      placeholder="Port"
                      v-model="addDbForm.port"
                      aria-required="true"
                      aria-labelledby="portLabel"
                    />
                    <label for="port" id="portLabel">Port*</label>
                    <div v-if="addDbForm.portError.length">
                      <span
                        class="error-msg"
                        v-for="error in addDbForm.portError"
                        >{{ error }}</span
                      >
                    </div>
                  </div>

                  <div class="form-floating mt-3 mb-3">
                    <input
                      type="text"
                      class="form-control"
                      id="user"
                      placeholder="User"
                      v-model="addDbForm.userDb"
                      aria-required="true"
                      aria-labelledby="userLabel"
                    />
                    <label for="user" id="userLabel">User*</label>
                  </div>

                  <div class="form-floating mt-3 mb-3">
                    <input
                      type="password"
                      class="form-control"
                      id="Password"
                      placeholder="Password"
                      v-model="addDbForm.password"
                      aria-required="true"
                      aria-labelledby="passwordLabel"
                    />
                    <label for="Password" id="passwordLabel">Password*</label>
                  </div>

                  <div class="d-grid">
                    <button
                      class="btn btn-primary btn-login text-uppercase fw-bold"
                      type="submit"
                      @click.prevent="addDatabase()"
                      :disabled="submitDisabled"
                      aria-label="Add database button"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import requests from "../common/requests.js";
import router from "@/router";

let loader = null;

export default {
  data() {
    return {
      addDbForm: {
        portError: [],
        database: null,
        typeId: "",
        host: null,
        port: null,
        userDb: null,
        password: null,
      },
      databaseTypes: [],
    };
  },
  computed: {
    submitDisabled() {
      return !(
        this.addDbForm.database &&
        this.addDbForm.host &&
        this.addDbForm.port &&
        this.addDbForm.userDb &&
        this.addDbForm.password &&
        this.addDbForm.typeId
      );
    },
  },
  methods: {
    async addDatabase() {
      try {
        loader = this.$loading.show({
          container: null,
          canCancel: false,
        });
        await requests.addDatabase(this.addDbForm);
        loader.hide();
        this.$toast.success("Database successfully added!", {
          position: "top",
          duration: 3500,
        });
        await router.push("/myDatabases");
      } catch (err) {
        loader.hide();
        if (err.response.data["fieldError"]) {
          console.error(err.response.data["fieldError"]);
          this.addDbForm.portError.push(
            "Port number must be between 1 and 65535!"
          );
        } else {
          console.log(err.response.data);
          this.$toast.error(
            "Cannot connect to the database with the given parameters!",
            {
              position: "bottom-left",
              duration: 3000,
              max: 3,
            }
          );
        }
      }
    },
  },
  async beforeMount() {
    this.databaseTypes = await requests.getDatabaseTypes();
  },
};
</script>

<style scoped>
section {
  background-color: cyan;
  height: 90vh;
}

label {
  color: green;
}

.error-msg {
  color: red;
}

#bigContainer {
  background-color: cyan;
  height: 91.5vh;
}

input:focus-visible,
select:focus-visible {
  outline: 3px solid #9999ff;
}

form:focus-within {
  box-shadow: 0px 0.2em 2.5em #c4c4c4;
  transform: scale(1.025);
}
@media screen and (prefers-reduced-motion: reduce) {
  form:focus-within {
    box-shadow: none;
    transform: none;
  }
}

form {
  display: block;
  transition: 250ms box-shadow ease-out, 250ms transform ease-out;
}

input,
select {
  transition: 125ms border-color ease-out;
  display: block;
}
</style>
