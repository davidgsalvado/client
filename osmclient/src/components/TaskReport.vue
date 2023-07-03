<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->

<template>
  <div class="d-flex flex-column overflow-hidden" id="container">
    <div class="row flex-grow-1">
      <div class="col-4 d-flex flex-column">
        <div class="row">
          <h1 class="mt-5" aria-label="Task name">
            {{ this.myTask.taskName }}
          </h1>
        </div>
        <div class="row mb-3 justify-content-center">
          <span ref="stateBadge" id="myBadge">{{ this.myTask.state }}</span>
        </div>
        <div class="row">
          <h6 aria-label="Task creation date">
            Started: {{ this.myTask.creationDate }}
          </h6>
        </div>
        <div class="row">
          <h6 ref="endDate" aria-label="Task end date">
            Finished: {{ this.myTask.endDate }}
          </h6>
        </div>
        <div class="row justify-content-center align-items-center">
          <div class="col">
            <button
              class="btn btn-danger mb-3"
              id="cancelButton"
              :disabled="cancelDisabled(this.myTask.state)"
              @click="cancelTask(this.myTask.id)"
              aria-label="Cancel task button"
            >
              Cancel
            </button>
          </div>
          <div class="col">
            <button
              class="btn btn-primary mb-3"
              ref="rerunButton"
              id="rerunButton"
              @click="rerunTask(this.myTask.id)"
              aria-label="Execute button"
            >
              Execute again
            </button>
          </div>
        </div>
        <div class="row ml-1 flex-grow-1">
          <textarea
            name="taskString"
            id="taskStringPanel"
            ref="queryPanel"
            aria-label="Task string text"
            disabled
          ></textarea>
        </div>
      </div>
      <div class="col-8 mt-5">
        <textarea
          name="taskReport"
          id="reportPanel"
          ref="reportPanel"
          aria-label="Task report text"
          disabled
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import router from "@/router";
import requests from "@/common/requests";

let loader = null;

export default {
  data() {
    return {
      myTask: null,
      interval: null,
      lastLogId: null,
    };
  },
  methods: {
    cancelDisabled(state) {
      return !(state === "RUNNING" || state === "WAITING");
    },
    async getTaskDetails(taskId) {
      try {
        const task = await requests.getTask(taskId);
        this.myTask = task;
        this.$refs.queryPanel.value = this.myTask.taskString;
        this.setColor(this.myTask);
        this.modifyDates();
        if (
          this.myTask.state === "RUNNING" ||
          this.myTask.state === "WAITING"
        ) {
          this.$refs.endDate.style.display = "none";
          this.$refs.rerunButton.disabled = true;
        }
        if (this.myTask.state === "ERROR") {
          this.$refs.reportPanel.style.border = "4px solid red";
        } else this.$refs.reportPanel.style.border = "2px solid black";
        const logs = await requests.getTaskLogs(
          router.currentRoute.value.params.taskId
        );
        this.lastLogId = await this.updatePanel(logs);
        setTimeout(() => {}, 2000);
        if (this.myTask.state === "RUNNING")
          this.interval = setInterval(() => {
            this.getTaskLogsWithIdAfter(this.myTask.id, this.lastLogId);
          }, 8000);
      } catch (err) {
        console.log(err);
      }
    },
    async getTaskLogsWithIdAfter(taskId, logId) {
      try {
        if (this.myTask.state === "RUNNING") {
          const logs = await requests.getTaskLogsAfterLogId(taskId, logId);
          if (logs.length === 0) {
            const task = await requests.getTask(taskId);
            this.myTask = task;
            this.modifyDates();
            this.setColor(this.myTask);
            this.$refs.endDate.style.display = "";
            this.$refs.rerunButton.disabled = false;
            this.showNotification(this.myTask.state);
          } else {
            this.lastLogId = await this.updatePanel(logs);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
    showNotification(state) {
      if (state === "OK") {
        this.$toast.success("Task finished successfully!", {
          position: "bottom-left",
          duration: 3000,
          max: 3,
        });
      } else if (state === "ERROR") {
        this.$refs.reportPanel.style.border = "4px solid red";
        this.$toast.error("Task finished execution with an error", {
          position: "top",
          duration: 3000,
          max: 3,
        });
      }
    },
    modifyDates() {
      this.myTask.creationDate = moment(this.myTask.creationDate).format(
        "DD/MM/YYYY HH:mm:ss"
      );
      if (this.myTask.endDate !== 0)
        this.myTask.endDate = moment(this.myTask.endDate).format(
          "DD/MM/YYYY HH:mm:ss"
        );
      else this.myTask.endDate = "-";
    },
    async updatePanel(logs) {
      const last = logs[logs.length - 1];
      logs.forEach((l) => {
        this.$refs.reportPanel.value += l.log;
      });
      return last.id;
    },
    async rerunTask(taskId) {
      try {
        await router.push("/rerunTask/" + taskId);
      } catch (err) {
        console.log(err);
      }
    },
    async cancelTask(taskId) {
      try {
        loader = this.$loading.show({
          //waiting for task to finish
          container: null,
          canCancel: false,
        });
        await requests.cancelTask(taskId);
        loader.hide();
        await this.getTasks();
        this.$toast.success("Task successfully cancelled", {
          position: "top",
          duration: 3000,
          max: 3,
        });
      } catch (err) {
        loader.hide();
        console.log(err.response);
        this.$toast.error("You cannot cancel this task", {
          position: "top",
          duration: 3000,
          max: 3,
        });
      }
    },
    setColor(item) {
      if (item.state === "WAITING")
        this.$refs.stateBadge.className =
          "badge rounded-pill text-bg-secondary";
      else if (item.state === "ERROR")
        this.$refs.stateBadge.className = "badge rounded-pill text-bg-danger";
      else if (item.state === "OK")
        this.$refs.stateBadge.className = "badge rounded-pill text-bg-success";
      else if (item.state === "CANCELED")
        this.$refs.stateBadge.className = "badge rounded-pill text-bg-info";
      else if (item.state === "RUNNING")
        this.$refs.stateBadge.className = "badge rounded-pill text-bg-primary";
    },
  },
  async beforeMount() {
    await this.getTaskDetails(router.currentRoute.value.params.taskId);
  },
  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.$refs.reportPanel.value = ""; //reset the panel before leaving
  },
};
</script>

<style scoped>
#container {
  background-color: cyan;
  height: 91.5vh;
}

#reportPanel {
  width: 80%;
  height: 100%;
  border-radius: 1px;
  padding: 6px 12px;
  font-family: "Courier New", serif;
  color: black;
  background-color: white;
}

#taskStringPanel {
  height: 100%;
  border: 2px solid black;
  border-radius: 1px;
  padding: 3px 6px;
  color: black;
  font-family: "Courier New", serif;
  background-color: white;
}

#rerunButton,
#cancelButton {
  width: 100%;
}

#myBadge {
  font-size: 15px;
  width: 30%;
}
</style>
