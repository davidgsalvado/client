<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->

<template>
  <section>
    <div class="container py-5 h-100 mt-3">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5 mx-auto">
          <form novalidate>
            <div class="card text-white shadow-lg" style="border-radius: 1rem">
              <div class="card-body p-4 p-sm-5 text-center">
                <div class="mb-md-5 mt-md-4 pb-5">
                  <h2 class="fw-bold mb-2 text-black">Sign Up</h2>

                  <div class="form-floating mb-3 mt-3">
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      placeholder="Email"
                      v-model="signUpForm.email"
                      aria-labelledby="emailLabel"
                      tabindex="0"
                    />
                    <label for="email" id="emailLabel">Email</label>
                    <div
                      class="input-errors"
                      v-for="error of v$.signUpForm.email.$errors"
                      :key="error.$uid"
                    >
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="form-floating mb-3 mt-3">
                    <input
                      type="text"
                      class="form-control"
                      id="username"
                      placeholder="Username"
                      v-model="signUpForm.userName"
                      aria-labelledby="usernameLabel"
                      tabindex="0"
                    />
                    <label for="Username" id="usernameLabel">Username</label>
                    <div v-if="signUpForm.errors.length">
                      <span
                        class="error-msg"
                        v-for="error in signUpForm.errors"
                        >{{ error }}</span
                      >
                    </div>
                  </div>

                  <div class="form-floating mt-3 mb-3">
                    <input
                      type="password"
                      class="form-control"
                      id="Password"
                      placeholder="Password"
                      v-model="signUpForm.password"
                      aria-label="Password input"
                      aria-labelledby="passwordLabel"
                      tabindex="0"
                    />
                    <label for="Password" id="passwordLabel">Password</label>
                  </div>

                  <div class="form-floating mt-3 mb-3" id="div2">
                    <input
                      type="password"
                      class="form-control"
                      id="CheckPassword"
                      placeholder="Confirm password"
                      v-model="signUpForm.confirm"
                      aria-label="Confirm password input"
                      aria-labelledby="confirmPassLabel"
                      tabindex="0"
                    />
                    <label for="CheckPassword" id="confirmPassLabel"
                      >Confirm password</label
                    >
                    <div
                      class="input-errors"
                      v-for="error of v$.signUpForm.confirm.$errors"
                      :key="error.$uid"
                    >
                      <div class="error-msg">{{ error.$message }}</div>
                    </div>
                  </div>

                  <div class="d-grid">
                    <button
                      class="btn btn-primary btn-login text-uppercase fw-bold"
                      type="submit"
                      @click.prevent="signUp()"
                      :disabled="submitDisabled"
                      aria-label="Sign up button"
                      tabindex="0"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>

                <hr />

                <div>
                  <p class="mb-0 fw-bold">Already have an account?</p>
                  <div class="d-grid">
                    <button
                      class="btn btn-primary btn-login text-uppercase fw-bold text-white"
                      type="submit"
                      @click.prevent="goLogin()"
                      aria-label="Go login button"
                      tabindex="0"
                    >
                      Login
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
import auth from "../common/auth";
import router from "@/router";
import useVuelidate from "@vuelidate/core";
import { sameAs, email, helpers } from "@vuelidate/validators";

const customValidation = (param) =>
  helpers.withMessage("Passwords do not match", sameAs(param));

export default {
  setup: () => ({ v$: useVuelidate() }),
  validationConfig: {
    $lazy: true,
    $autoDirty: false,
  },
  data() {
    return {
      signUpForm: {
        errors: [],
        email: null,
        userName: null,
        password: null,
        confirm: null,
      },
    };
  },
  validations() {
    return {
      signUpForm: {
        email: { email },
        confirm: { mustBeEqual: customValidation(this.signUpForm.password) },
      },
    };
  },
  computed: {
    submitDisabled() {
      return !(
        this.signUpForm.userName &&
        this.signUpForm.password &&
        this.signUpForm.email &&
        this.signUpForm.confirm
      );
    },
  },
  methods: {
    async signUp() {
      try {
        this.signUpForm.errors = [];
        const isValid = await this.v$.$validate(); //check validity of the form
        const valuesForm = {
          email: this.signUpForm.email,
          userName: this.signUpForm.userName,
          password: this.signUpForm.password,
        };
        if (isValid) {
          await auth.signUp(valuesForm);
          await router.push("/myTasks");
        }
      } catch (err) {
        console.error(err.response.data["globalError"]);
        this.signUpForm.errors.push("This username is not available!");
      }
    },
    async goLogin() {
      await router.push("/login");
    },
  },
};
</script>

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

hr,
p {
  color: black;
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
