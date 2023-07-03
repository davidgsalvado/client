/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import "bootstrap/dist/css/bootstrap.css";
import { createApp } from "vue";
import App from "./App.vue";
import { registerPlugins } from "./plugins";
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import "leaflet/dist/leaflet.css";

const app = createApp(App);
app.component("EasyDataTable", Vue3EasyDataTable);
app.component("VueDatePicker", VueDatePicker);

registerPlugins(app);
app.mount("#app");

import "bootstrap/dist/js/bootstrap.js";
