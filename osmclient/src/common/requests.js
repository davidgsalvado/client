/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import HTTP from "./http.js";

export default {
  addDatabase,
  getDatabases,
  deleteDatabase,
  updateDatabase,
  getDatabaseTypes,
  createTask,
  getTasks,
  cancelTask,
  getTask,
  getTaskLogs,
  getTaskLogsAfterLogId,
  getGeoJson,
  deleteTask,
  getDatabaseTables,
};

async function getDatabaseTypes() {
  const response = await HTTP.get("/catalog/databaseTypes");
  return response.data;
}

function addDatabase(params) {
  return HTTP.post("/databases/add", params).then((response) => {});
}

async function getDatabases() {
  const response = await HTTP.get("/catalog/user/databases");
  return response.data;
}

async function deleteDatabase(id) {
  const response = await HTTP.delete("/databases/" + id + "/delete");
  return response.status;
}

async function updateDatabase(id, params) {
  const response = await HTTP.put("/databases/" + id + "/update", params);
  return response.data;
}

async function createTask(params) {
  const response = await HTTP.post("/tasks/add", params);
  return response.data;
}

async function getTasks() {
  const response = await HTTP.get("/catalog/user/tasks");
  return response.data;
}

async function cancelTask(taskId) {
  const response = await HTTP.put("/tasks/" + taskId + "/cancel");
  return response.status;
}

async function getTask(taskId) {
  const response = await HTTP.get("/catalog/tasks/" + taskId);
  return response.data;
}

async function getTaskLogs(taskId) {
  const response = await HTTP.get("/catalog/tasks/" + taskId + "/logs");
  return response.data;
}

async function getTaskLogsAfterLogId(taskId, logId) {
  const response = await HTTP.get(
    "/catalog/tasks/" + taskId + "/logs/" + logId
  );
  return response.data;
}

async function getGeoJson(databaseId, tableName) {
  const response = await HTTP.get(
    "/geoJson/database/" + databaseId + "/" + tableName
  );
  console.log(response.data);
  return response.data;
}

async function deleteTask(taskId) {
  const response = await HTTP.delete("/tasks/" + taskId + "/delete");
  return response.status;
}

async function getDatabaseTables(databaseId) {
  const response = await HTTP.get("/databases/" + databaseId + "/tables");
  return response.data;
}
