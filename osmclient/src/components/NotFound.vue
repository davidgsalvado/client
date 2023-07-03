<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->

<template>
  <div>
    <div>
      <h1>404</h1>

      <h3>You have tried to enter: {{ path }}</h3>

      <h3>¡There is nothing here!</h3>

      <router-link to="/" custom v-slot="{ href }">
        <a type="button" class="btn btn-primary" :href="href"> Go Home </a>
      </router-link>
    </div>
  </div>
</template>

<script>
import router from "@/router";

export default {
  data() {
    return {
      path: router.currentRoute.value.fullPath,
    };
  },
};
</script>

<style scoped>
h1 {
  font-size: 30vh;
}
h2,
h3 {
  opacity: 0.6;
}
</style>
