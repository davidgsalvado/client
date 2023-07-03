<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->

<template>
  <section>
    <div class="container py-5 h-100 mt-3">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5 mx-auto">
          <form>
            <div class="card text-white" style="border-radius: 1rem">
              <div class="card-body text-center">
                <div class="mb-md-5 mt-md-4 pb-5">
                  <h2 class="fw-bold mb-2 text-black">Create new task</h2>

                  <div class="form-floating mb-3 mt-3">
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      placeholder="Name"
                      v-model="createTaskForm.taskName"
                      aria-labelledby="nameLabel"
                      tabindex="0"
                    />
                    <label for="name" id="nameLabel">Name*</label>
                  </div>

                  <div class="form mt-3 mb-3">
                    <select
                      class="form-select"
                      aria-label="Database type dropdown"
                      v-model="databaseInfo"
                      tabindex="0"
                    >
                      <option disabled value="" hidden>Select database</option>
                      <option
                        v-for="database in userDatabases"
                        :value="database"
                      >
                        {{ database.database }} - {{ database.host }}
                      </option>
                    </select>
                  </div>

                  <textarea
                    name="taskString"
                    id="taskString"
                    placeholder="Task content*"
                    v-model="createTaskForm.taskString"
                    aria-label="Task string input"
                    tabindex="0"
                    class="mb-3"
                  ></textarea>

                  <div class="d-grid">
                    <button
                      class="btn btn-primary btn-login text-uppercase fw-bold"
                      type="submit"
                      @click.prevent="createTask()"
                      :disabled="submitDisabled"
                      aria-label="Execute task button"
                      tabindex="0"
                    >
                      Execute
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import requests from "../common/requests.js";
import router from "@/router";

let loader = null;

export default {
  data() {
    return {
      createTaskForm: {
        taskName: null,
        taskString: null,
        databaseId: null,
      },
      databaseInfo: "",
      userDatabases: [],
      databaseTypes: [],
      task: null,
    };
  },
  computed: {
    submitDisabled() {
      return !(this.createTaskForm.taskName && this.createTaskForm.taskString);
    },
  },
  methods: {
    async createTask() {
      try {
        loader = this.$loading.show({
          container: null,
          canCancel: false,
        });
        if (this.databaseInfo !== "")
          this.createTaskForm.databaseId = this.databaseInfo.id;
        await requests.createTask(this.createTaskForm);
        setTimeout(async () => {
          loader.hide();
          this.$toast.success("Task successfully added!", {
            position: "top",
            duration: 3500,
          });
          await router.push("/myTasks");
        }, 2000);
      } catch (err) {
        console.log(err.response.data);
        this.$toast.error("Something went wrong!", {
          position: "top",
          duration: 3500,
        });
      }
    },
  },
  async beforeMount() {
    this.userDatabases = await requests.getDatabases();
    this.databaseTypes = await requests.getDatabaseTypes();
    if (router.currentRoute.value.params.taskId) {
      this.task = await requests.getTask(
        router.currentRoute.value.params.taskId
      );
      this.createTaskForm.taskName = this.task.taskName;
      this.createTaskForm.taskString = this.task.taskString;
      if (this.task.databaseId)
        this.databaseInfo = this.userDatabases.filter(
          (database) => database.id === this.task.databaseId
        )[0];
    }
    console.log(this.createTaskForm);
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

textarea {
  resize: vertical;
  border: 1px solid #bac2cc;
  border-radius: 1px;
  width: 100%;
  line-height: 1.6;
  padding: 6px 12px;
  height: calc(((40px * 1.6) + (6px * 2) + 2px) * 3);
}

input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 3px solid #9999ff;
}

form:focus-within {
  box-shadow: 0 0.2em 2.5em #c4c4c4;
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
select,
textarea {
  transition: 125ms border-color ease-out;
  display: block;
}
</style>
