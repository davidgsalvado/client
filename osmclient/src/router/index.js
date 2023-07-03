/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import SignUpView from "@/views/SignUpView.vue";
import AddDatabaseView from "@/views/AddDatabaseView.vue";
import MyDatabasesView from "@/views/MyDatabasesView.vue";
import CreateTaskView from "@/views/CreateTaskView.vue";
import MyTaskView from "@/views/MyTasksView.vue";
import TaskReportView from "@/views/TaskReportView.vue";
import SeeDataView from "@/views/SeeDataView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import auth from "@/common/auth";
import { getStore } from "@/common/store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: MyTaskView,
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { public: true, isLoginPage: true },
    },
    {
      path: "/signUp",
      name: "SignUp",
      component: SignUpView,
      meta: { public: true, isLoginPage: true },
    },
    {
      path: "/addDatabase",
      name: "AddDatabase",
      component: AddDatabaseView,
      meta: { public: false },
    },
    {
      path: "/myDatabases",
      name: "My databases",
      component: MyDatabasesView,
    },
    {
      path: "/createTask",
      name: "Create Task",
      component: CreateTaskView,
    },
    {
      path: "/rerunTask/:taskId",
      name: "Rerun task",
      component: CreateTaskView,
    },
    {
      path: "/myTasks",
      name: "My tasks",
      component: MyTaskView,
    },
    {
      path: "/taskReport/:taskId",
      name: "Task report",
      component: TaskReportView,
    },
    {
      path: "/data",
      name: "See data imported",
      component: SeeDataView,
    },
    {
      path: "/:catchAll(.*)*",
      component: NotFoundView,
      meta: { public: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  // Before loading any route we must check if the user is authenticated (checking the token)
  auth.isAuthenticationChecked.finally(() => {
    // by default, user must be authenticated to access the different views
    const requiresAuth = !to.meta.public;

    const userIsLogged = getStore().state.user.logged;
    if (requiresAuth) {
      // private page
      if (userIsLogged) {
        //user is logged, so we redirect it to the corresponding page
        next();
      } else {
        //user is not logged, so we redirect him to login page
        next("/login");
      }
    } else {
      // public page
      if (userIsLogged && to.meta.isLoginPage) {
        // if we are logged we don't need to show again login
        next({ name: "Home", replace: true });
      } else {
        next();
      }
    }
  });
});

export default router;
