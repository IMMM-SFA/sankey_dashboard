import { writable } from "svelte/store";
import Papa from "papaparse";
import { base } from "$app/paths";

const energywaterdata = writable([]);
const isLoading = writable(false);
const error = writable(null);

function loadEnergyWaterData() {
  isLoading.set(true);
  fetch(`${base}/energy_water_data.csv`)
    .then((response) => {
      if (!response.ok) throw new Error("Error loading the data file");
      return response.text();
    })
    .then((csv) => Papa.parse(csv, { header: true }).data)
    .then((parsedData) => {
      energywaterdata.set(parsedData);
      isLoading.set(false);
    })
    .catch((err) => {
      error.set(err.message);
      isLoading.set(false);
    });
}

export { energywaterdata, isLoading, error, loadEnergyWaterData };
