<script>
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

  const columnsToDisplay = ["scenario", "source", "target", "year", "flow_value", "units", "diagram"];

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
        Data Behind Visualizations
      </h1>

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
</div>
