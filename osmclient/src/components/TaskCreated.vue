<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->

<template>
  <section>
    <div class="container text-center">
      <div class="col">
        <div class="row">
          <span class="addedDb">Task successfully added!</span>
        </div>
        <div class="row">
          <router-link to="/"
            ><button class="btn btn-primary" aria-label="Back to main page button">Back</button></router-link
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script></script>

<style scoped>
.addedDb {
  color: green;
}
</style>
