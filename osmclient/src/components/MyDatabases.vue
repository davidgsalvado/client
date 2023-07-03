<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->

<template>
  <div id="container">
    <div class="container h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col">
          <div class="card shadow">
            <div class="card-header border-0">
              <div class="row">
                <div class="col-6">
                  <h3 class="mb-3 text-start text-uppercase">My databases</h3>
                </div>
                <div class="col-6 text-right">
                  <router-link to="/addDatabase"
                    ><button class="btn btn-primary">
                      <i class="fa fa-plus"></i></button
                  ></router-link>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-8 mb-1"></div>
              <div class="col-sm-12 col-md-4 mb-1">
                <div class="input-group mb-3">
                  <div class="searchIcon">
                    <i class="fa fa-solid fa-magnifying-glass"></i>
                  </div>
                  <input
                    class="form-control form-control-sm"
                    id="searchField"
                    type="search"
                    placeholder="Search"
                    v-model="searchValue"
                    aria-label="Filter database input"
                    tabindex="0"
                  />
                </div>
              </div>
            </div>
            <EasyDataTable
              :headers="myDatabases.headers"
              :items="myDatabases.itemsDb"
              alternating
              buttons-pagination
              :rows-per-page="myDatabases.itemsPerPage"
              table-class-name="myTable"
              header-text-direction="left"
              body-text-direction="left"
              theme-color="#1d90ff"
              :search-field="searchField"
              :search-value="searchValue"
            >
              <template #item-action="item">
                <div class="operation-wrapper">
                  <button
                    class="btn btn-danger rounded-0"
                    @click="deleteItem(item)"
                    aria-label="Delete database button"
                    title="Delete database"
                  >
                    <i class="operation-icon fa fa-sharp fa-solid fa-trash"></i>
                  </button>
                  <button
                    class="btn btn-success rounded-0 ml-3"
                    @click="showItem(item)"
                    data-bs-toggle="modal"
                    data-bs-target="#updateModal"
                    aria-label="Update database button"
                    title="Update database"
                  >
                    <i class="operation-icon bi bi-pencil-square"></i>
                  </button>
                </div>
              </template>
            </EasyDataTable>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="updateModal"
        role="dialog"
        aria-labelledby="updateLabel"
      >
        <div class="modal-dialog">
          <div class="modal-content p-4">
            <div class="modal-header">
              <h4 class="modal-title" id="updateLabel">Update database</h4>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-floating mt-3 mb-3">
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    placeholder="Name"
                    v-model="updateDbForm.database"
                    aria-label="Name input"
                    aria-labelledby="nameLabel"
                    tabindex="0"
                  />
                  <label for="name" id="nameLabel">Name*</label>
                </div>

                <div class="form mt-3 mb-3">
                  <select
                    class="form-select"
                    aria-label="Database type dropdown"
                    v-model="updateDbForm.typeId"
                    aria-required="true"
                    tabindex="0"
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
                    v-model="updateDbForm.host"
                    aria-required="true"
                    aria-label="Host input"
                    aria-labelledby="hostLabel"
                    tabindex="0"
                  />
                  <label for="host" id="hostLabel">Host*</label>
                </div>

                <div class="form-floating mt-3 mb-3">
                  <input
                    type="number"
                    class="form-control"
                    id="port"
                    placeholder="Port"
                    v-model="updateDbForm.port"
                    aria-required="true"
                    aria-label="Port input"
                    tabindex="0"
                  />
                  <label for="port">Port*</label>
                  <div v-if="updateDbForm.portError.length">
                    <span
                      class="error-msg"
                      v-for="error in updateDbForm.portError"
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
                    v-model="updateDbForm.userDb"
                    aria-labelledby="usernameLabel"
                    aria-required="true"
                    aria-label="Username input"
                    tabindex="0"
                  />
                  <label for="user" id="usernameLabel">User*</label>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                id="close"
                aria-label="Close modal button"
                title="Close update database page"
                tabindex="0"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                :disabled="submitDisabled"
                @click="updateDatabase"
                aria-label="Update database button"
                title="Save update changes"
                tabindex="0"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import requests from "@/common/requests";
import router from "@/router";

let loader = null;

export default {
  components: {
    EasyDataTable: window["vue3-easy-data-table"],
  },
  data() {
    return {
      componentKey: 0,
      myDatabases: {
        itemsDb: [],
        page: 1,
        itemsPerPage: 5,
        headers: [
          {
            text: "NAME",
            value: "database",
            sortable: true,
          },
          {
            text: "HOST",
            value: "host",
            sortable: true,
          },
          {
            text: "PORT",
            value: "port",
            sortable: true,
          },
          {
            text: "USER",
            value: "userDb",
            sortable: true,
          },
          {
            text: "ACTION",
            value: "action",
          },
        ],
      },
      updateDbForm: {
        portError: [],
        id: null,
        database: null,
        typeId: "",
        host: null,
        port: null,
        userDb: null,
        password: null,
      },
      databaseTypes: [],
      searchField: ["database", "host", "port", "userDb"],
      searchValue: "",
    };
  },
  computed: {
    submitDisabled() {
      return !(
        this.updateDbForm.database &&
        this.updateDbForm.host &&
        this.updateDbForm.port &&
        this.updateDbForm.userDb &&
        this.updateDbForm.password &&
        this.updateDbForm.typeId
      );
    },
  },
  methods: {
    closeModal() {
      document.getElementById("close").click();
    },
    async getDatabases() {
      try {
        const items = await requests.getDatabases();
        this.myDatabases.itemsDb = items;
      } catch (err) {
        console.error(err);
      }
    },
    async deleteItem(item) {
      try {
        const status = await requests.deleteDatabase(item.id);
        if (status === 204) {
          this.$toast.success("Database successfully deleted!", {
            position: "top",
            duration: 3000,
            max: 3,
          });
          this.myDatabases.itemsDb = this.myDatabases.itemsDb.filter(
            (database) => database.id !== item.id
          );
        }
      } catch (err) {
        console.error(err.response.data["globalError"]);
        this.$toast.error(
          "Something went wrong! Operation could not be performed",
          {
            position: "bottom-left",
            duration: 3000,
            max: 3,
          }
        );
      }
    },
    async showItem(item) {
      this.updateDbForm.portError = [];
      this.updateDbForm.id = item.id;
      this.updateDbForm.database = item.database;
      this.updateDbForm.typeId = item.typeId;
      this.updateDbForm.host = item.host;
      this.updateDbForm.port = item.port;
      this.updateDbForm.userDb = item.userDb;
      this.updateDbForm.password = item.password;

      if (this.databaseTypes.length === 0) {
        //load the types only 1 time
        this.databaseTypes = await requests.getDatabaseTypes();
      }
    },
    async updateDatabase() {
      try {
        const updateNoId = {
          databaseName: this.updateDbForm.database,
          typeId: this.updateDbForm.typeId,
          host: this.updateDbForm.host,
          port: this.updateDbForm.port,
          userDb: this.updateDbForm.userDb,
          password: this.updateDbForm.password,
        };
        loader = this.$loading.show({
          container: null,
          canCancel: false,
        });
        await requests.updateDatabase(this.updateDbForm.id, updateNoId);
        loader.hide();
        await this.getDatabases();
        this.closeModal();
        this.$toast.success("Database successfully updated", {
          position: "bottom-left",
          duration: 3000,
          max: 3,
        });
      } catch (err) {
        loader.hide();
        if (err.response.data["fieldError"]) {
          console.error(err.response.data["fieldError"]);
          this.updateDbForm.portError.push(
            "Port number must be between 1 and 65535!"
          );
        } else {
          console.log(err.response.data);
          this.$toast.error(
            "Cannot connect to the database with the given parameters, so operation cannot be performed!",
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
  beforeMount() {
    this.getDatabases();
  },
};
</script>

<style scoped>
.right {
  float: left;
}

.error-msg {
  color: red;
}

.card-header {
  margin-bottom: 0;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background-color: #fff;
}

#container {
  background-color: cyan;
  height: 91.5vh;
}

.operation-wrapper .operation-icon {
  width: 20px;
  cursor: pointer;
}

.myTable {
  --easy-table-border: 1px solid #e0e0e0;
  --easy-table-row-border: 1px solid #e0e0e0;

  --easy-table-header-font-size: 14px;
  --easy-table-header-height: 36px;
  --easy-table-header-font-color: #373737;
  --easy-table-header-background-color: #fff;
  --easy-table-header-item-padding: 0px 10px;

  --easy-table-body-row-height: 36px;
  --easy-table-body-row-font-size: 13px;
  --easy-table-body-row-font-color: #212121;
  --easy-table-body-row-background-color: #fff;

  --easy-table-body-row-hover-font-color: #212121;
  --easy-table-body-row-hover-background-color: #eee;

  --easy-table-body-even-row-font-color: #212121;
  --easy-table-body-even-row-background-color: #fafafa;

  --easy-table-body-item-padding: 5px 10px;

  --easy-table-footer-background-color: #fff;
  --easy-table-footer-font-color: #212121;
  --easy-table-footer-font-size: 12px;
  --easy-table-footer-padding: 0px 5px;
  --easy-table-footer-height: 36px;

  --easy-table-rows-per-page-selector-width: auto;
  --easy-table-rows-per-page-selector-option-padding: 5px;
  --easy-table-rows-per-page-selector-z-index: auto;

  --easy-table-message-font-color: #212121;
  --easy-table-message-font-size: 12px;
  --easy-table-message-padding: 20px;

  --easy-table-loading-mask-background-color: #fff;
  --easy-table-loading-mask-opacity: 0.5;

  --easy-table-scrollbar-track-color: #fff;
  --easy-table-scrollbar-color: #fff;
  --easy-table-scrollbar-thumb-color: #c1c1c1;
  --easy-table-scrollbar-corner-color: #fff;

  --easy-table-buttons-pagination-border: 1px solid #e0e0e0;
}

.searchIcon {
  display: flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  text-align: center;
  white-space: nowrap;
  background-color: #e9ecef;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
}
</style>
