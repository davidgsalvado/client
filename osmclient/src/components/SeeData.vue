<!-- This Source Code Form is subject to the terms of the Mozilla Public
   - License, v. 2.0. If a copy of the MPL was not distributed with this
   - file, You can obtain one at https://mozilla.org/MPL/2.0/. -->

<template>
  <div id="container">
    <div id="mapContainer"></div>
    <div class="selector">
      <div class="card text-white" id="myCard">
        <div class="card-body text-center">
          <div class="mb-md-5 mt-md-4 pb-5">
            <form>
              <h2 class="fw-bold mb-2 text-black">Data filter</h2>

              <div class="form mt-3 mb-3">
                <select
                  class="form-select"
                  aria-label="User databases dropdown"
                  tabindex="0"
                  v-model="selectedDatabase"
                >
                  <option disabled value="" hidden>Select database</option>
                  <option v-for="database in userDatabases" :value="database">
                    {{ database.database }} - {{ database.host }}
                  </option>
                </select>
              </div>

              <div class="d-grid">
                <button
                  class="btn btn-primary btn-login text-uppercase fw-bold"
                  type="submit"
                  :disabled="submitDisabled"
                  @click.prevent="asyncShowElements()"
                  aria-label="See data from selected database"
                  tabindex="0"
                >
                  Select
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import requests from "@/common/requests";
import HTTP from "../common/http.js";

export default {
  data() {
    return {
      center: [42.84866, -8.59242],
      geoJsonList: [],
      userDatabases: [],
      databaseTables: [],
      mapDiv: null,
      selectedDatabase: "",
      layerControl: null,
      index: 0,
      styles: [
        { id: "blue", color: "#106CB6" },
        { id: "red", color: "#D4321B" },
        { id: "green", color: "#008F3F" },
        { id: "yellow", color: "#F4B62C" },
        { id: "pink", color: "#BC4C9A" },
        { id: "orange", color: "#EE8A1A" },
        { id: "brown", color: "#9C2529" },
        { id: "grey", color: "#231F20" },
      ],
    };
  },
  computed: {
    submitDisabled() {
      return !this.selectedDatabase;
    },
  },
  methods: {
    getRandomColor() {
      if (this.index === this.styles.length) this.index = 0;
      return this.styles[this.index++].color;
    },
    async setupLeafletMap() {
      try {
        this.userDatabases = await requests.getDatabases();
        let osm = L.tileLayer(
          "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 18,
          }
        );
        this.mapDiv = L.map("mapContainer", {
          center: this.center,
          zoom: 13,
          layers: [osm],
        });
      } catch (err) {
        console.log(err);
      }
    },
    async asyncShowElements() {
      if (this.selectedDatabase !== "") {
        this.databaseTables = await requests.getDatabaseTables(
          this.selectedDatabase.id
        );
        L.AsyncGeoJSONLayer = L.GeoJSON.extend({
          initialize: function (geojson, options) {
            if (typeof geojson == "function") {
              this._data = geojson;
              L.setOptions(this, options);
              this._layers = {};
            } else {
              L.GeoJSON.prototype.initialize.call(geojson, options);
            }
          },
          onAdd: function (map) {
            if (typeof this._data == "function") {
              this._data = this._data();
              Promise.resolve(this._data).then((data) => {
                L.GeoJSON.prototype.onAdd.call(this, map);
                L.GeoJSON.prototype.addData.call(
                  this,
                  JSON.parse(data.data.geoJson)
                );
              });
            } else {
              Promise.resolve(this._data).then((data) => {
                L.GeoJSON.prototype.onAdd.call(this, map);
                L.GeoJSON.prototype.addData.call(
                  this,
                  JSON.parse(data.data.geoJson)
                );
              });
            }
          },
        });
        if (this.layerControl !== null) this.layerControl.remove();
        this.layerControl = L.control.layers(null, null).addTo(this.mapDiv);
        if (!this.databaseTables || this.databaseTables.length === 0) {
          this.$toast.error("No data to show", {
            duration: 3500,
            position: "top",
            max: 3,
          });
        } else {
          this.databaseTables.forEach((table) => {
            let randomColor = this.getRandomColor();
            let visitedEntity = L.layerGroup();
            let newEntityLayer = new L.AsyncGeoJSONLayer(
              () =>
                HTTP.get(
                  "/geoJson/database/" + this.selectedDatabase.id + "/" + table
                ),
              {
                style: { color: randomColor, weight: 6, opacity: 1 },
                pointToLayer: function (feature, latlng) {
                  return L.circleMarker(latlng, {
                    radius: 6,
                    fillColor: randomColor,
                    color: randomColor,
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 1,
                  });
                },
                onEachFeature: function (feature, layer) {
                  let popupContent = [];
                  // render properties
                  for (let keyProperty in feature.properties) {
                    if (keyProperty === "id") continue;
                    if (feature.properties[keyProperty] !== null)
                      popupContent.push(
                        keyProperty.charAt(0).toUpperCase() +
                          keyProperty.substring(1) +
                          ": " +
                          feature.properties[keyProperty]
                      );
                  }
                  // render coordinates
                  if (feature.geometry.type === "Point") {
                    popupContent.push(
                      "Latitude: " + feature.geometry.coordinates[1]
                    );
                    popupContent.push(
                      "Longitude: " + feature.geometry.coordinates[0]
                    );
                  }
                  layer.bindPopup(popupContent.join("<br/>"));
                  L.circleMarker(
                    L.latLng(
                      feature.geometry.coordinates[1],
                      feature.geometry.coordinates[0]
                    ),
                    {
                      radius: 6,
                      fillColor: randomColor,
                      color: randomColor,
                      weight: 1,
                      opacity: 1,
                      fillOpacity: 0.6,
                    }
                  )
                    .bindPopup(popupContent.join("<br/>"))
                    .addTo(visitedEntity);
                },
              }
            );
            this.layerControl.addOverlay(newEntityLayer, table);
          });
        }
      }
    },
  },
  async beforeMount() {
    await this.setupLeafletMap();
  },
};
</script>

<style scoped>
#mapContainer {
  width: 100%;
  height: 91.5vh;
  margin: auto;
  z-index: 0;
}

.selector {
  position: absolute;
  top: 25%;
  left: 0;
  z-index: 999;
}

#container {
  display: flex;
  justify-content: end;
  align-items: baseline;
}

#myCard {
  border: 2px solid black;
}
</style>
