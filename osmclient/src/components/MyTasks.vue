<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->

<template>
  <div id="bigContainer">
    <div class="container h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col">
          <div class="card shadow">
            <div class="card-header border-0">
              <div class="row">
                <div class="col-6">
                  <h3
                    class="mb-3 text-start text-uppercase"
                    aria-label="My tasks view"
                  >
                    My tasks
                  </h3>
                </div>
                <div class="col-6 text-right">
                  <router-link to="/createTask"
                    ><button
                      class="btn btn-primary"
                      aria-label="Create new task button"
                    >
                      <i class="fa fa-plus"></i></button
                  ></router-link>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-8">
                <div class="row">
                  <div class="col-sm-12 col-md-4">
                    <VueDatePicker
                      show-now-button
                      v-model="startDate"
                      placeholder="Select start date"
                      :format="'dd/MM/yyyy HH:mm'"
                      @update:model-value="handleDates"
                      aria-label="Start date filter"
                    />
                  </div>
                  <div class="col-sm-12 col-md-4">
                    <VueDatePicker
                      show-now-button
                      v-model="endDate"
                      placeholder="Select end date"
                      :format="'dd/MM/yyyy HH:mm'"
                      @update:model-value="handleDates"
                      aria-label="End date filter"
                    />
                  </div>
                </div>
              </div>
              <div class="col-sm-12 col-md-4 mb-1">
                <div class="input-group mb-3">
                  <div class="searchIcon">
                    <i class="fa fa-solid fa-magnifying-glass"></i>
                  </div>
                  <input
                    class="form-control form-control-sm"
                    id="searchField"
                    type="search"
                    placeholder="Search by name or state"
                    v-model="searchValue"
                    aria-label="Filter tasks button"
                    tabindex="0"
                  />
                </div>
              </div>
            </div>
            <EasyDataTable
              :headers="myTasks.headers"
              :items="myTasks.itemsDb"
              alternating
              buttons-pagination
              :rows-per-page="myTasks.itemsPerPage"
              table-class-name="myTable"
              header-text-direction="left"
              body-text-direction="left"
              theme-color="#1d90ff"
              :search-field="searchField"
              :search-value="searchValue"
            >
              <template #item-state="item">
                <span :style="setColor(item)">{{ item.state }}</span>
              </template>
              <template #item-action="item">
                <div class="operation-wrapper">
                  <button
                    class="btn btn-warning rounded-0"
                    @click="cancel(item)"
                    :disabled="cancelDisabled(item)"
                    aria-label="Cancel task button"
                    title="Cancel task"
                  >
                    <i class="operation-icon fa fa-solid fa-ban"></i>
                  </button>
                  <button
                    class="btn btn-primary rounded-0 ml-3"
                    @click="seeReport(item)"
                    aria-label="Task report button"
                    title="See task execution report"
                  >
                    <i class="operation-icon fa fa-eye fa-solid"></i>
                  </button>
                  <button
                    class="btn btn-success rounded-0 ml-3"
                    @click="rerunTask(item)"
                    aria-label="Rerun task button"
                    title="Rerun task"
                  >
                    <i class="operation-icon fa fa-solid fa-repeat"></i>
                  </button>
                  <button
                    class="btn btn-danger rounded-0 ml-3"
                    @click="deleteItem(item)"
                    aria-label="Delete task button"
                    :disabled="!cancelDisabled(item)"
                    title="Delete task"
                  >
                    <i class="operation-icon fa fa-sharp fa-solid fa-trash"></i>
                  </button>
                </div>
              </template>
            </EasyDataTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from "@/router";
import moment from "moment";
import requests from "@/common/requests";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

let loader = null;
const reportAddress = "/taskReport/";

export default {
  components: {
    VueDatePicker,
    EasyDataTable: window["vue3-easy-data-table"],
  },
  data() {
    return {
      myTasks: {
        itemsDb: [],
        page: 1,
        itemsPerPage: 5,
        headers: [
          {
            text: "NAME",
            value: "taskName",
            sortable: true,
          },
          {
            text: "CREATION DATE",
            value: "creationDate",
            sortable: true,
          },
          {
            text: "STATE",
            value: "state",
            sortable: true,
          },
          {
            text: "END DATE",
            value: "endDate",
          },
          {
            text: "ACTION",
            value: "action",
          },
        ],
      },
      searchField: ["state", "taskName"],
      searchValue: "",
      startDate: null,
      endDate: null,
      allTasks: [],
    };
  },
  methods: {
    cancelDisabled(item) {
      return !(item.state === "RUNNING" || item.state === "WAITING");
    },
    handleDates() {
      if (this.startDate !== null && this.endDate === null) {
        const startDate = moment(this.startDate).format("DD/MM/YYYY HH:mm:ss");
        this.myTasks.itemsDb = this.myTasks.itemsDb.filter(
          (item) => startDate <= item.creationDate
        );
        return;
      }
      if (this.endDate !== null && this.startDate === null) {
        const endDate = moment(this.endDate).format("DD/MM/YYYY HH:mm:ss");
        this.myTasks.itemsDb = this.myTasks.itemsDb.filter(
          (item) => item.endDate <= endDate
        );
        return;
      }
      if (this.startDate !== null && this.endDate !== null) {
        const startDate = moment(this.startDate).format("DD/MM/YYYY HH:mm:ss");
        const endDate = moment(this.endDate).format("DD/MM/YYYY HH:mm:ss");
        this.myTasks.itemsDb = this.myTasks.itemsDb.filter(
          (item) => startDate <= item.creationDate && item.endDate <= endDate
        );
        return;
      }
      this.myTasks.itemsDb = this.allTasks;
    },
    async getTasks() {
      try {
        let items = await requests.getTasks();
        for (let i = 0; i < items.length; i++) {
          items[i].creationDate = moment(items[i].creationDate).format(
            "DD/MM/YYYY HH:mm:ss"
          );
          if (items[i].endDate !== 0)
            items[i].endDate = moment(items[i].endDate).format(
              "DD/MM/YYYY HH:mm:ss"
            );
          else items[i].endDate = "-";
        }
        this.allTasks = items;
        this.myTasks.itemsDb = items;
      } catch (err) {
        console.log(err);
      }
    },
    async cancel(item) {
      try {
        loader = this.$loading.show({
          //waiting for task to finish
          container: null,
          canCancel: false,
        });
        await requests.cancelTask(item.id);
        loader.hide();
        await this.getTasks();
        this.$toast.success("Task successfully cancelled", {
          position: "bottom-left",
          duration: 3000,
          max: 3,
        });
      } catch (err) {
        loader.hide();
        console.log(err.response);
        this.$toast.error("You cannot cancel that task", {
          position: "bottom-left",
          duration: 3000,
          max: 3,
        });
      }
    },
    async seeReport(item) {
      try {
        const address = reportAddress + item.id;
        await router.push(address);
      } catch (err) {
        console.log(err);
      }
    },
    async deleteItem(item) {
      try {
        const status = await requests.deleteTask(item.id);
        if (status === 204) {
          this.$toast.success("Task successfully deleted!", {
            position: "top",
            duration: 3500,
            max: 3,
          });
          this.myTasks.itemsDb = this.myTasks.itemsDb.filter(
            (task) => task.id !== item.id
          );
        }
      } catch (err) {
        console.error(err.response.data["globalError"]);
        this.$toast.error(
          "Something went wrong! Operation could not be performed",
          {
            position: "top",
            duration: 3500,
            max: 3,
          }
        );
      }
    },
    async rerunTask(item) {
      try {
        if (item.state === "RUNNING" || item.state === "WAITING")
          this.$toast.error("You cannot rerun running or waiting tasks", {
            position: "bottom-left",
            duration: 3000,
            max: 3,
          });
        else await router.push("/rerunTask/" + item.id);
      } catch (err) {
        console.log(err);
      }
    },
    setColor(item) {
      if (item.state === "WAITING") return { color: "" };
      else if (item.state === "ERROR") return { color: "red" };
      else if (item.state === "OK") return { color: "darkblue" };
      else if (item.state === "CANCELED") return { color: "orange" };
      else if (item.state === "RUNNING") return { color: "blue" };
    },
  },
  beforeMount() {
    this.getTasks();
  },
};
</script>

<style scoped>
.operation-wrapper .operation-icon {
  width: 20px;
  cursor: pointer;
}

#bigContainer {
  background-color: cyan;
  height: 91.5vh;
}

.card-header {
  margin-bottom: 0;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background-color: #fff;
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

#myBadge {
  font-size: 15px;
  width: 30%;
}
</style>
