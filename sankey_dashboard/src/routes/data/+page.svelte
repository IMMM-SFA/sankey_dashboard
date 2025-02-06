

<script>
  import Papa from 'papaparse';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import Icon from "@iconify/svelte";

  const sspMapping = {'all': 'All', 'ssp3': 'Low', 'ssp5': 'High', };
  const rcpMapping = { 'all': 'All', 'rcp45': 'Low', 'rcp85': 'High',};
  const climateMapping = { 'cooler': 'Cooler', 'hotter': 'Hotter', };
  const diagramMapping = {'Energy & Water': 'Integrated Energy & Water', 'Energy': 'Energy', 'Water': 'Water'};
  const waterUnitMapping = {'km3': 'Cubic Kilometers', 'billion_gallons': 'Billion Gallons', 'million_acre_ft': 'Million Acre-Feet'};
  const energyUnitMapping = {'EJ': 'Exajoules', 'quads': 'Quads', 'terawatt_hours': 'Terawatt-hours'};

  const ssps = ['all', 'ssp3', 'ssp5']; // backend identifiers 
  let selectedSSP = ssps[0]; // default to 'ssp3'

  const rcps = ['all', 'rcp45', 'rcp85']; // backend identifiers 
  let selectedRCP = rcps[0]; // default to 'rcp45'

  const climates = ['cooler', 'hotter']; // backend identifiers 
  let selectedClimate = climates[0]; // default to 'Cooler'
  
  const diagrams = ['Energy & Water', 'Energy', 'Water'];  // backend identifiers 
  let selectedDiagram = diagrams[0]; // default to 'Energy & Water'

  const water_units = ['km3', 'billion_gallons', 'million_acre_ft'];  // backend identifiers
  let selectedWaterUnits = water_units[0]; // default to km3

  const energy_units = ['EJ', 'quads', 'terawatt_hours'];  // backend identifiers
  let selectedEnergyUnits = energy_units[0]; // default to EJ

  // data is now fetched in a svelte-like way; see below
  let energywaterdata;

  // when the page loads into a user's browser (onMount),
  // fetch the data and store in the the `data` variable defined above
  onMount(() => {
      fetch(`${base}/energy_water_data.csv`).then(response => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.text();
      }).then(
          d => Papa.parse(d, { header: true }).data
      ).then(d => {
          // this is the modele scoped `data` variable defined above
          energywaterdata = d;
      }).catch(
          error => console.error("Error loading CSV file:", error)
      );
  });

  // this is how to make a "reactive" construct in svelte, using the $: syntax
  $: if (energywaterdata && selectedSSP && selectedRCP && selectedClimate && selectedDiagram && selectedEnergyUnits && selectedWaterUnits) {
      initializeHybridSankey(energywaterdata, selectedSSP, selectedRCP, selectedClimate, selectedDiagram, selectedEnergyUnits, selectedWaterUnits);
  }


  function downloadCSV(energywaterdata, selectedSSP, selectedRCP, selectedClimate, selectedDiagram, selectedEnergyUnits, selectedWaterUnits) {
      if (!energywaterdata.length) return;
      
      const selectedUnitsList = [selectedEnergyUnits, selectedWaterUnits];
      
      // const filteredData = energywaterdata.filter(row => (row.ssp === selectedSSP) && (row.rcp === selectedRCP) && (row.climate_sensitivity === selectedClimate) && (row.diagram === selectedDiagram) && (selectedUnitsList.includes(row.units)));
      
      let sspFilteredSubset;
      if (selectedSSP === "all") {
        // If "all" is selected, include all data
        sspFilteredSubset = energywaterdata.filter(row => (row.climate_sensitivity === selectedClimate) && (row.diagram === selectedDiagram) && (selectedUnitsList.includes(row.units)));
      } else {
        sspFilteredSubset = energywaterdata.filter(row => (row.ssp === selectedSSP) && (row.climate_sensitivity === selectedClimate) && (row.diagram === selectedDiagram) && (selectedUnitsList.includes(row.units)));
      }

      let rcpFilteredSubset;
      if (selectedRCP === "all") {
        // If "all" is selected, include all data
        rcpFilteredSubset = sspFilteredSubset;
      } else {
        rcpFilteredSubset = sspFilteredSubset.filter(row => (row.rcp === selectedRCP));
      }    


      const columnsToDownload = ["rcp", 'ssp', "source", "target", "year", "unit_value", "units", "diagram"];

      const selectedData = rcpFilteredSubset.map(item => {
          let filteredItem = {};
          columnsToDownload.forEach(key => {
              filteredItem[key] = item[key];
          });
          return filteredItem;
          });

      // Convert data to CSV format


      const csv = Papa.unparse(selectedData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      
      link.setAttribute("href", url);
      link.setAttribute("download", "sankey_data_download.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
  }
</script>

<!-- Svelte will always rerender the html when variables change reactively -->
<div class="relative flex flex-col my-6 bg-white m-8">
  <div id='data' class="relative flex h-full w-full max-w-[90rem] p-8 flex-col rounded-xl bg-white bg-clip-border text-gray-700 border-2">
  
    <div class="p-2 mb-2">
  <h1 class="mb-0 text-slate-800 text-3xl font-semibold">
    Download Data
  </h1>
    </div>  

  
  <nav class="flex min-w-[240px] flex-col gap-3 mb-8 font-sans text-base font-normal text-blue-gray-700">
    <div role="contentinfo" class="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
        <div class="grid mr-0 place-items-center">
        </div>

        <div class="group flex relative">
        <span>Fossil-fuel Emphasis Scenario</span> 
        </div>
          
    </div>

    <div class="flex-row leading-normal pl-10 font-light h-6 bg-[#FFFFFF] items-center gap-8 text-[#000000]">
      <fieldset>
        <div class="flex flex-row gap-5">
          {#each rcps as r}
          <div>
            <input type="radio" id={r} name="rcps" value={r} bind:group={selectedRCP}/>
            <label for={r}>{rcpMapping[r]}</label>
          </div>
          {/each}
        </div>
      </fieldset>
    </div>
      

      <div role="contentinfo" class="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
          <div class="grid mr-0 place-items-center">
          </div>
          <div class="group flex relative">
          <span>Population & Economic Growth Scenario:</span> 
      </div>
  </div>
  <div class="flex leading-normal pl-10 font-light h-6 bg-[#FFFFFF] items-center gap-8 text-[#000000]">
      <fieldset>
          <div class="flex flex-row gap-5">
          {#each ssps as s}
          <div>
              <input type="radio" id={s} name="ssps" value={s} bind:group={selectedSSP}/>
              <label for={s}>{sspMapping[s]}</label>
          </div>
          {/each}
      </div>
      </fieldset>
  </div>


    <div role="contentinfo" class="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
        <div class="grid mr-0 place-items-center">
        </div>

        <div class="group flex relative">
          <span>Select Flow Data:</span> 
          </div>
      </div>

      <div class="flex leading-normal pl-10 font-light h-6 bg-[#FFFFFF] items-center gap-8 text-[#000000]">
          <fieldset>
              <div class="flex flex-row  top-15 gap-2">
              {#each diagrams as s}
              <div>
                  <input type="radio" id={s} name="diagram" value={s} bind:group={selectedDiagram}/>
                  <label for={s}>{s}</label>
              </div>
              {/each}
          </div>
          </fieldset>
      </div>

    <div role="contentinfo" class="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
        <div class="grid mr-0 place-items-center">
        </div>

        <div class="group flex relative">
          <span>Select Water Units:</span> 
          </div>
      </div>

      <div class="flex leading-normal pl-10 font-light h-6 bg-[#FFFFFF] items-center gap-8 text-[#000000]">
        <fieldset>
            <div class="flex flex-row  top-15 gap-2">
              {#each water_units as s}
              <div>
                  <input type="radio" id={s} name="waterUnits" value={s} bind:group={selectedWaterUnits}/>
                  <label for={s}>{waterUnitMapping[s]}</label>
              </div>
              {/each}
          </div>
          </fieldset>
      </div>
  
    <div role="contentinfo" class="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
        <div class="grid mr-0 place-items-center">
        </div>

        <div class="group flex relative">
          <span>Select Energy Units:</span> 
          </div>
      </div>

      <div class="flex leading-normal pl-10 font-light h-6 bg-[#FFFFFF] items-center gap-8 text-[#000000]">
        <fieldset>
            <div class="flex flex-row  top-15 gap-2">
              {#each energy_units as s}
              <div>
                  <input type="radio" id={s} name="energyUnits" value={s} bind:group={selectedEnergyUnits}/>
                  <label for={s}>{energyUnitMapping[s]}</label>
              </div>
              {/each}
          </div>
          </fieldset>
      </div>



  <div class="pt-8">
  <button on:click={() => downloadCSV(energywaterdata, selectedSSP, selectedRCP, selectedClimate, selectedDiagram, selectedEnergyUnits, selectedWaterUnits)} class="bg-gray-200 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
          <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
          <span>Download Selected Data</span>
  </button>
  </div>
  </nav>



</div>

</div>





<!-- <script>
  import Papa from 'papaparse';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  import { energywaterdata, isLoading, error, loadEnergyWaterData } from '../../stores/energywaterdata';

  let filteredData = [];
  let currentPage = 1;
  let rowsPerPage = 10;
  let search = ""; // global search filter
  let sortColumn = null;
  let sortDirection = "asc"; // or "desc"

  const columnsToDisplay = ["rcp", 'ssp', 'climate_sensitivity', "source", "target", "year", "flow_value", "units", "diagram"];

  // capitalize column names for display
  const displayColumns = columnsToDisplay.map(
    (col) => col.charAt(0).toUpperCase() + col.slice(1)
  );

  // subscribe to the store aka load data once when the component mounts
  onMount(() => {
    loadEnergyWaterData();
  });

  // filter data based on search term
  $: filteredData = $energywaterdata.filter((row) =>
    Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  // sort data based on column and direction
  function sortByColumn(column) {
    if (sortColumn === column) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortColumn = column;
      sortDirection = "asc";
    }

    filteredData = [...filteredData].sort((a, b) => {
      const valA = a[column]?.toString().toLowerCase();
      const valB = b[column]?.toString().toLowerCase();

      if (valA === undefined || valB === undefined) return 0;

      if (!isNaN(valA) && !isNaN(valB)) {
        return sortDirection === "asc"
          ? parseFloat(valA) - parseFloat(valB)
          : parseFloat(valB) - parseFloat(valA);
      }

      return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    currentPage = 1; // reset to the first page after sorting
  }

  $: paginatedData = [...filteredData].slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  

  function goToPage(page) {
    currentPage = Math.max(1, Math.min(page, Math.ceil(filteredData.length / rowsPerPage)));
  }

  function updateRowsPerPage(event) {
    rowsPerPage = parseInt(event.target.value);
    currentPage = 1;
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function downloadCSV(data, filename) {
      // Convert data to CSV format
      const csv = data.map(row => row.join(",")).join("\n");

      // Create a Blob (binary large object)
      const blob = new Blob([csv], { type: "text/csv" });

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create a link element and trigger a click event to download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
}

  
</script>

<style>
  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  .search-container {
    flex-grow: 1;
    margin-right: 1rem;
  }
  .search-container input {
    width: 90%;
  }
  .pagination-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .table-container {
    overflow-x: auto;
    margin-bottom: 1rem;
  }
  table {
    width: 95%;
    border-collapse: collapse;
    margin: 1rem auto;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 6px;
    text-align: left;
    /* width: 150px; */
  }
  th {
    background-color: #f4f4f4;
    cursor: pointer;
  }
  tr:hover {
    background-color: #f7f7f7;
  }
  .pagination {
    display: flex;
    gap: 0.5rem;
    margin-top: 0rem;
  }
 .scroll-to-top {
    margin-top: 20px;
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    position: absolute;
    right: 40px;
  }
  .scroll-to-top:hover {
    background-color: #0056b3;
  }
</style>



<div class="relative flex flex-col my-6 bg-white m-8">
  <div id='outline'
    class="relative flex h-full w-full max-w-[100rem] p-8 flex-col rounded-xl bg-white bg-clip-border text-gray-700 border-2">

    <div class="p-2 mb-2">

      <h1 class="mb-7 text-slate-800 text-3xl font-semibold">
        Sankey Data
      </h1>
      <div>

            <button on:click={() => downloadCSV(energywaterdata, "data.csv")} >
              <strong><span> Download Data </span></strong>
            </button>
      
      </div>

      <div class="controls">
        <div class="search-container">
          <input
            type="text"
            placeholder="Search..."
            bind:value={search}
            class="p-2 border border-gray-300 rounded"
          />
        </div>

        <div class="pagination-container">
          <label>
            Rows:
            <select on:change={updateRowsPerPage} class="p-2 border border-gray-300 rounded">
              <option value="10" selected>10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>

          <div class="pagination">
            <button on:click={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              <strong><span>←</span></strong> Previous
            </button>
            <span>
              Page <strong>{currentPage}</strong> of {Math.ceil(filteredData.length / rowsPerPage)}
            </span>
            <button
              on:click={() => goToPage(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage)}
            >
              Next <strong><span>→</span></strong>
            </button>
          </div>
        </div>
      </div>

      <div class="table-container">
        {#if $isLoading}
        <p>Loading...</p>
        {:else if $error}
        <p>Error: {$error}</p>
        {:else}  
          <table>
            <thead>
              <tr>
                {#each columnsToDisplay as column, index}
                  <th on:click={() => sortByColumn(column)}>
                    {displayColumns[index]} {sortColumn === column ? (sortDirection === "asc" ? "▲" : "▼") : ""}
                  </th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each paginatedData as row}
                <tr>
                  {#each columnsToDisplay as column}
                    <td>{row[column]}</td>
                  {/each}
                </tr>
              {/each}
              {#if paginatedData.length === 0}
                <tr>
                  <td colspan={columnsToDisplay.length} style="text-align: center;">
                    No results found
                  </td>
                </tr>
              {/if}
            </tbody>
          </table>
          
          <button class="scroll-to-top" on:click={scrollToTop}>
            Scroll to Top
          </button>
          
        {/if}

      </div>
    </div>
  </div>
</div> -->
