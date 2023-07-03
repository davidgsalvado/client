/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { ref } from "vue";

const store = ref({
  state: {
    user: {
      authority: "",
      login: "",
      email: "",
      logged: false,
    },
  },
});

export { getStore };

function getStore() {
  return store.value;
}
