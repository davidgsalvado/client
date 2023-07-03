<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->

<template>
  <section>
    <div class="container py-5 h-100 mt-3">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5 mx-auto">
          <form novalidate>
            <div class="card text-dark shadow-lg" style="border-radius: 1rem">
              <div class="card-body p-4 p-sm-5 text-center">
                <div class="mb-md-5 mt-md-4 pb-5">
                  <h2 class="fw-bold mb-2">Login</h2>

                  <div v-if="loginForm.errors.length">
                    <span class="error-msg" v-for="error in loginForm.errors">{{
                      error
                    }}</span>
                  </div>

                  <div class="form-floating mb-3 mt-3">
                    <input
                      type="text"
                      class="form-control"
                      id="username"
                      placeholder="Username"
                      v-model="loginForm.userName"
                      aria-labelledby="userLabel"
                      aria-label="Username input"
                      aria-required="true"
                      tabindex="0"
                    />
                    <label for="Username" id="userLabel">Username</label>
                  </div>

                  <div class="form-floating mt-3 mb-3">
                    <input
                      type="password"
                      class="form-control"
                      id="Password"
                      placeholder="Password"
                      v-model="loginForm.password"
                      aria-label="Password input"
                      aria-labelledby="passLabel"
                      aria-required="true"
                      tabindex="0"
                    />
                    <label for="Password" id="passLabel">Password</label>
                  </div>

                  <div class="d-grid">
                    <button
                      class="btn btn-primary btn-login text-uppercase fw-bold text-white"
                      type="submit"
                      @click.prevent="login()"
                      :disabled="submitDisabled"
                      tabindex="0"
                    >
                      Login
                    </button>
                  </div>
                </div>
                <hr />
                <div>
                  <p class="mb-0 fw-bold">Don't have an account?</p>
                  <div class="d-grid">
                    <button
                      class="btn btn-primary btn-login text-uppercase fw-bold text-white"
                      type="submit"
                      @click.prevent="goSignUp()"
                      aria-label="Sign up button"
                      tabindex="0"
                    >
                      Sign Up
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

<style scoped>
section {
  background: url("@/assets/newback.png") no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  height: 90.5vh;
}

label {
  color: green;
}

.error-msg {
  color: red;
}

input:focus-visible {
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

input {
  transition: 125ms border-color ease-out;
  display: block;
}
</style>

<script>
import auth from "../common/auth";
import router from "@/router";

export default {
  data() {
    return {
      loginForm: {
        errors: [],
        userName: null,
        password: null,
      },
    };
  },
  computed: {
    submitDisabled() {
      return !(this.loginForm.userName && this.loginForm.password);
    },
  },
  methods: {
    async login() {
      this.loginForm.errors = [];
      try {
        await auth.login(this.loginForm);
        await router.push("/myTasks");
      } catch (err) {
        console.error(err.response.data["globalError"]);
        this.loginForm.errors.push(
          "The username or the password are not correct!"
        );
      }
    },
    async goSignUp() {
      await router.push("/signUp");
    },
  },
};
</script>
