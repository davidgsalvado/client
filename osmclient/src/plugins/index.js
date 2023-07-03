/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import "vuetify/styles";
import router from "../router";
import { createVuetify } from "vuetify";
import { Toaster } from "@meforma/vue-toaster";
import { LoadingPlugin } from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

const vuetify = createVuetify();

export function registerPlugins(app) {
  app.use(vuetify).use(router).use(Toaster).use(LoadingPlugin);
}
