<script>
  
	import { base } from '$app/paths';
  
  let fullScreenImage = null;
  let fullScreenCaption = '';
  

  const scenarioResources = [
    {
      src: 'im3_scenarios.png',
      alt: 'IM3 Scenarios Design',
      title: 'IM3 Scenarios Design',
      // caption: 'GCAM market-based structure, sectors, interactions, and typical inputs and outputs',
      tooltip: 'Click to enlarge the diagram.'
    },
  ];

  const diagramsResources = [
    {
      src: 'gcam.svg',
      alt: 'Global Change Analysis Model (GCAM)',
      title: 'Global Change Analysis Model (GCAM)',
      // caption: 'GCAM market-based structure, sectors, interactions, and typical inputs and outputs',
      tooltip: 'Click to enlarge the GCAM diagram.'
    },
    {
      src: 'experiment.svg',
      alt: 'GCAM-USA IM3 Experiment Diagram',
      title: 'GCAM-USA IM3 Experiment',
      // caption: 'GCAM-USA IM3 experimental design',
      tooltip: 'Click to enlarge the GCAM-USA IM3 experiment diagram'
    },

    // {
    //   src: 'im3scenarios.svg', 
    //   alt: 'IM3 Scenarios Design',
    //   title: 'IM3 Scenarios Design',
    //   // caption: 'A Wide, Yet Plausible Range of 21st Century Futures',
    //   tooltip: 'Click to enlarge the IM3 scenarios design diagram'
    // },
    {
      src: 'resolutions.svg',
      alt: 'GCAM-USA Spatial Resolutions',
      title: 'GCAM-USA Spatial Resolutions',
      // caption: 'Details of spatial and temporal resolutions.',
      tooltip: 'Click to enlarge the resolutions diagram'
    }
  ];

  const openFullScreen = (src, caption) => {fullScreenImage = src; fullScreenCaption = caption;};
  const closeFullScreen = () => {fullScreenImage = null; fullScreenCaption = '';};

</script>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 16px;
  }

  .grid-item {
    border: 1px solid #ccc;
    padding: 5px;
    cursor: pointer;
    transition: transform 0.2s;
    position: relative;
    box-shadow: 1px 3px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid #ccc;
    border-radius: 0.375rem;
  }

  .grid-item:hover {
    transform: scale(1.05);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  }

  .grid-item-title {
    background-color: #e2e8f0;
    text-align: center;
    font-size: 0.875rem;
    padding: 0.25rem;
    border-top-left-radius: 0.375rem;
    border-top-right-radius: 0.375rem;
  }

  .grid-item-caption {
    text-align: center;
    color: #6b7280;
    font-size: 0.75rem;
    padding: 0.25rem;
  }

  .modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 1000;
  }

  .modal img {
    max-width: 90%;
    max-height: 90%;
  }

  .backdrop {
    background-color: rgba(255, 255, 255, 0.95);
  }

  .close {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 24px;
    color: white;
    cursor: pointer;
  }
</style>


<div class="relative flex flex-col my-6 bg-white m-8">
  <div id='scenarioSelectionBar' class="relative flex h-full w-full max-w-[90rem] p-8 flex-col rounded-xl bg-white bg-clip-border text-gray-700 border-2">
  <div class="p-2 mb-2">
    <h1 class="mb-7 text-slate-800 text-3xl font-semibold">
      Methodology
    </h1>

    
    <br>

    <h2 class="mb-7 text-slate-800 text-2xl font-semibold">
      Scenario Design 
    </h2>
    <hr class="border-1 border-gray-300">
    <br>

    <p> The scenarios shown in the Sankey diagrams cover the responses of interacting energy, water, land, and urban systems to the compounding influences of climate, population change, energy futures, and technology change over the course of the 21st century.
    
    </p>

        <!-- add diagrams -->
        <div class="grid-container">
          {#each scenarioResources as diagram}
            <button
              class="grid-item"
              title={diagram.tooltip}
              on:click={() => openFullScreen(diagram.src, diagram.caption)}
            >
              <div class="grid-item-title">
                {diagram.title}
              </div>
              <img src={diagram.src} alt={diagram.alt} class="w-full h-auto" />
              <div class="grid-item-caption">
                {diagram.caption}
              </div>
            </button>
          {/each}
        </div>
    
        {#if fullScreenImage}
          <button
            class="modal backdrop"
            on:click={closeFullScreen}
            aria-label="Full Screen Diagram"
          >
            <img src={fullScreenImage} alt="Full Screen Diagram" class="max-w-full max-h-3/4 shadow-lg rounded-md border border-gray-300" />
            <div class="text-center text-gray-500 text-sm mt-4">{fullScreenCaption}</div>
          </button>
        {/if}

      <br>
    <!-- MODEL DOCUMENTATION -->

    <h2 class="mb-7 text-slate-800 text-2xl font-semibold">
      Modeling 
    </h2>
    <hr class="border-1 border-gray-300">
    
      <h2 class="mb-5 mt-5 text-slate-800 text-xl font-semibold"> Global Change Analysis Model - USA </h2>

        <p class="mb-7 text-slate-800 text-l font-light"> The Global Change Analysis Model (GCAM) Wiki (version 5.3): <a class='text-[#2B7F9E]' href="https://jgcri.github.io/gcam-doc/v5.3/toc.html" target="_blank"> jgcri.github.io/gcam-doc/v5.3/toc.html</a> </p>

        <p class="mb-7 text-slate-800 text-l font-light">GCAM Modeling Outputs Underlying Visualizations: Zhao, M., Ahsan, H., Binsted, M., Patel, P., Rice, J. S., Snyder, A., Vernon, C. R., & Wild, T. B. (2024). GCAM-USA: IM3 Phase 2 Official Simulations (Version v1) [Data set]. MSD-LIVE Data Repository. doi:<a class='text-[#2B7F9E]' href="https://doi.org/10.57931/2428940" target="_blank"> 10.57931/2428940 </a> </p>

        <!-- add diagrams -->
        <div class="grid-container">
          {#each diagramsResources as diagram}
            <button
              class="grid-item"
              title={diagram.tooltip}
              on:click={() => openFullScreen(diagram.src, diagram.caption)}
            >
              <div class="grid-item-title">
                {diagram.title}
              </div>
              <img src={diagram.src} alt={diagram.alt} class="w-full h-auto" />
              <div class="grid-item-caption">
                {diagram.caption}
              </div>
            </button>
          {/each}
        </div>

        {#if fullScreenImage}
          <button
            class="modal backdrop"
            on:click={closeFullScreen}
            aria-label="Full Screen Diagram"
          >
            <img src={fullScreenImage} alt="Full Screen Diagram" class="max-w-full max-h-3/4 shadow-lg rounded-md border border-gray-300" />
            <div class="text-center text-gray-500 text-sm mt-4">{fullScreenCaption}</div>
          </button>
        {/if}
      
      <br>
      <br>
              
    
  </div>
</div>
</div>  
