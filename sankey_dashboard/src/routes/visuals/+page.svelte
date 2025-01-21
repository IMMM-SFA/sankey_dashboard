
<script>
  
	import { base } from '$app/paths';

  let fullScreenImage = null;
  let fullScreenCaption = '';
  
  const diagramsWater = [
    {
      src: '/water_basins.svg',
      alt: 'U.S. Water Withdrawals by Basin',
      title: 'U.S. Water Withdrawals by Basin',
      // caption: 'U.S. Water Withdrawals by Basin',
      tooltip: 'Click to enlarge the figure'
    },
    {
      src: '/water_availability.svg',
      alt: 'U.S. Water Availability by Water Source',
      title: 'U.S. Water Availability by Water Source',
      // caption: 'U.S. Water Availability by Water Source',
      tooltip: 'Click to enlarge the figure'
    },

    {
      src: '/water_demands.svg', 
      alt: 'U.S. Water Demands by Sector',
      title: 'U.S. Water Demands by Sector',
      // caption: 'U.S. Water Demands by Sector',
      tooltip: 'Click to enlarge the figure'
    },
    {
      src: '/water_use_sectors.svg',
      alt: 'U.S. Water Demands  by End-use Sector',
      title: 'U.S. Water Demands by End-use Sector',
      // caption: 'U.S. Water Demands by End-use Sector',
      tooltip: 'Click to enlarge the figure'
    }
  ];

    const diagramsEnergy = [
      {
      src: '/energy_supply.svg',
      alt: 'U.S. Primary Energy Supply',
      title: 'U.S. Primary Energy Supply',
      // caption: 'U.S. Primary Energy Supply',
      tooltip: 'Click to enlarge the figure'
    },
    {
      src: '/energy_transformation.svg',
      alt: 'U.S. Energy Transformation',
      title: 'U.S. Energy Transformation',
      // caption: 'U.S. Energy Transformation',
      tooltip: 'Click to enlarge the figure'
    },
    {
      src: '/energy_enduse.svg', 
      alt: 'U.S. Energy End-use',
      title: 'U.S. Energy End-use',
      // caption: 'U.S. Energy End-use',
      tooltip: 'Click to enlarge the figure'
    },
    {
      src: '/energy_losses.svg',
      alt: 'U.S. Energy Losses',
      title: 'U.S. Energy Losses',
      // caption: 'U.S. Energy Losses',
      tooltip: 'Click to enlarge the figure'
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
    max-width: 95%;
    max-height: 95%;
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
  <div id='resources'
  class="relative flex h-full w-full max-w-[90rem] p-8 flex-col rounded-xl bg-white bg-clip-border text-gray-700 border-2">
    <div class="p-2 mb-2">

      <h1 class="mb-7 text-slate-800 text-3xl font-semibold">
        Additional Visuals and Diagrams
      </h1>

        <h2 class="mb-5 mt-5 text-slate-800 text-xl font-semibold text-center"> Water System </h2>
          <div class="grid-container">
            {#each diagramsWater as diagram}
              <button
                type="button"
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

        <h2 class="mb-5 mt-5 text-slate-800 text-xl font-semibold text-center"> Energy System </h2>
          <div class="grid-container">
            {#each diagramsEnergy as diagram}
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
          >
            <img src={fullScreenImage} alt="Full Screen Diagram" class="max-w-full max-h-3/4 shadow-lg rounded-md border border-gray-300" />
            <div class="text-center text-gray-500 text-sm mt-4">{fullScreenCaption}</div>
          </button>
        {/if}        

    </div>
  </div>
</div>  
