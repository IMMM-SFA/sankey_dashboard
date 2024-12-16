


<script>
    import Papa from 'papaparse';
    import { onMount } from 'svelte';
	import { base } from '$app/paths';
    import Icon from "@iconify/svelte";

    // the plotly javascript library appears to have some serious bugs when loaded
    // into a module context, so i moved the load back into <head> in app.html;
    // also just 'plotly' was a different library... :\
    // import Plotly from 'plotly.js-dist-min';

    // the dropdown is now built in a svelte-like way; see below
    // const scenarios = [
    //     'rcp45cooler_ssp3', 'rcp45cooler_ssp5', 
    //     'rcp45hotter_ssp3', 'rcp45hotter_ssp5', 
    //     'rcp85cooler_ssp3', 'rcp85cooler_ssp5', 
    //     'rcp85hotter_ssp3', 'rcp85hotter_ssp5', 
    // ];
    // let selectedScenario = scenarios[0];

    const ssps = ['ssp3', 'ssp5'];
    let selectedSSP = ssps[0];

    const rcps = ['rcp45', 'rcp85'];
    let selectedRCP = rcps[0];

    const climates = ['cooler', 'hotter'];
    let selectedClimate = climates[0];

    // data is now fetched in a svelte-like way; see below
    let data;
    let energydata;

    // Generate Sankey frames by year and scenario
    // this is the same as you had it
    function generateSankeyFrames(data, selectedSSP, selectedRCP, selectedClimate) {
        const filteredData = data.filter(row => row.ssp === selectedSSP && row.rcp === selectedRCP && row.climate_sensitivity === selectedClimate);

        const years = [...new Set(filteredData.map(row => row.year))];
        const labels = new Set();
        const frames = [];

        filteredData.forEach(row => {
            labels.add(row.source);
            labels.add(row.target);
        });

        years.forEach(year => {
            const yearData = filteredData.filter(row => row.year === year);
            const sources = [];
            const targets = [];
            const values = [];
            const linkColors = [];
            const nodeColors = Array.from({ length: labels.size });

            yearData.forEach(row => {
                sources.push([...labels].indexOf(row.source));
                targets.push([...labels].indexOf(row.target));
                values.push(parseFloat(row.value));
                linkColors.push(row.link_color);
                nodeColors[[...labels].indexOf(row.source)] = row.source_color;
                nodeColors[[...labels].indexOf(row.target)] = row.target_color;
            });

            frames.push({
                name: year,
                data: [{
                    type: "sankey",
                    orientation: "h",
                    node: {
                        pad: 15,
                        thickness: 20,
                        line: { color: "black", width: 0.5 },
                        label: [...labels],
                        color: nodeColors
                    },
                    link: {
                        source: sources,
                        target: targets,
                        value: values,
                        color: linkColors
                    }
                }]
            });
        });

        return { frames, labels: [...labels] };
    }

    // Initialize Sankey animation
    // this is the same as you had it
    function initializeSankey(data, selectedSSP, selectedRCP, selectedClimate) {
        const { frames, labels } = generateSankeyFrames(data, selectedSSP, selectedRCP, selectedClimate);
        const initialFrame = frames[0];

        const layout = {
            title: " ",
            font: { size: 14 },
            sliders: [{
                steps: frames.map(frame => ({
                    method: "animate",
                    label: frame.name,
                    args: [[frame.name], { mode: "immediate", frame: { duration: 1000, redraw: true }, transition: { duration: 500 } }]
                })),
                active: 0,
                currentvalue: {
                    prefix: "Year: ",
                    font: { size: 16, color: "#666" }
                },
                pad: { t: 30 }
            }],
            // updatemenus: [{
            //     type: "buttons",
            //     showactive: false,
            //     buttons: [
            //         {
            //             label: "Play",
            //             method: "animate",
            //             args: [null, { frame: { duration: 1000, redraw: true }, fromcurrent: true, mode: "immediate", transition: { duration: 500 } }]
            //         },
            //         {
            //             label: "Pause",
            //             method: "animate",
            //             args: [[null], { mode: "immediate", frame: { duration: 0, redraw: false }, transition: { duration: 0 } }]
            //         }
            //     ]
            // }]
        };

        Plotly.newPlot("sankeyDiagram", initialFrame.data, layout)
            .then(() => {
                Plotly.addFrames("sankeyDiagram", frames);
            });
    }

    function initializeEnergySankey(energydata, selectedSSP, selectedRCP, selectedClimate) {
        const { frames, labels } = generateSankeyFrames(energydata, selectedSSP, selectedRCP, selectedClimate);
        const initialFrame = frames[0];

        const layout = {
            title: " ",
            font: { size: 14 },
            sliders: [{
                steps: frames.map(frame => ({
                    method: "animate",
                    label: frame.name,
                    args: [[frame.name], { mode: "immediate", frame: { duration: 1000, redraw: true }, transition: { duration: 500 } }]
                })),
                active: 0,
                currentvalue: {
                    prefix: "Year: ",
                    font: { size: 16, color: "#666" }
                },
                pad: { t: 30 }
            }],
            // updatemenus: [{
            //     type: "buttons",
            //     showactive: false,
            //     buttons: [
            //         {
            //             label: "Play",
            //             method: "animate",
            //             args: [null, { frame: { duration: 1000, redraw: true }, fromcurrent: true, mode: "immediate", transition: { duration: 500 } }]
            //         },
            //         {
            //             label: "Pause",
            //             method: "animate",
            //             args: [[null], { mode: "immediate", frame: { duration: 0, redraw: false }, transition: { duration: 0 } }]
            //         }
            //     ]
            // }]
        };

        Plotly.newPlot("energySankeyDiagram", initialFrame.data, layout)
            .then(() => {
                Plotly.addFrames("energySankeyDiagram", frames);
            });
    }


    // when the page loads into a user's browser (onMount),
    // fetch the data and store in the the `data` variable defined above
    onMount(() => {
        fetch(`${base}/water_data.csv`).then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.text();
        }).then(
            d => Papa.parse(d, { header: true }).data
        ).then(d => {
            // this is the modele scoped `data` variable defined above
            data = d;
        }).catch(
            error => console.error("Error loading CSV file:", error)
        );

        fetch(`${base}/energy_data.csv`).then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.text();
        }).then(
            d => Papa.parse(d, { header: true }).data
        ).then(d => {
            // this is the modele scoped `data` variable defined above
            energydata = d;
        }).catch(
            error => console.error("Error loading CSV file:", error)
        );

    });

    // this is how to make a "reactive" construct in svelte, using the $: syntax
    // the code here will run anytime the referenced, in-scope variables change
    // (in this case, `data` and `selectedScenario`), but the "if" construct means
    // we only run initializeSankey if both `data` and `selectedScenario` are "truthy",
    // meaning they have any non-false, non-zero, non-empty string value;
    // there are many other ways to use "$:" too
    $: if (data && selectedSSP && selectedRCP && selectedClimate) {
        initializeSankey(data, selectedSSP, selectedRCP, selectedClimate);
    }
    $: if (energydata && selectedSSP && selectedRCP && selectedClimate) {
        initializeEnergySankey(energydata, selectedSSP, selectedRCP, selectedClimate);
    }

</script>

<!-- Svelte will always rerender the html when variables change reactively -->



<div class="flex flex-row">

<div id='scenarioSelectionBar'
  class="relative flex h-full w-full max-w-[22rem] p-8 flex-col rounded-xl bg-white bg-clip-border text-gray-700 border-2">
  <div class="p-2 mb-2">
    <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
      Scenario Selection
    </h5>
  </div>
  <nav class="flex min-w-[240px] flex-col gap-3 font-sans text-base font-normal text-blue-gray-700">
    <div role="contentinfo"
      class="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
      
	  <div class="grid mr-4 place-items-center">
		<Icon icon="ix:trend" style="font-size: 30px" />
		</div>

		<div class="group flex relative">
		<span>Representative Concentration Pathway (RCP)</span> 
		<span class="absolute bottom-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
			Projected greenhouse gas concentration in the atmosphere. 
		</span>
		</div>
        
    </div>
    <div class="flex leading-normal pl-16 font-light h-6 bg-[#FFFFFF] items-center gap-8 text-[#000000]">
        <fieldset>
            <div class="flex flex-row gap-5">
            {#each rcps as s}
              <div>
                <input type="radio" id={s} name="rcps" value={s} bind:group={selectedRCP}/>
                <label for={s}>{s}</label>
              </div>
            {/each}
        </div>
          </fieldset>
    </div>
    

	<div role="contentinfo"
	class="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
	<div class="grid mr-4 place-items-center">
	  <Icon icon="ix:user-management" style="font-size: 30px" />
	  </div>
	  <div class="group flex relative">
		<span>Shared Socioeconomic Pathway (SSP)</span> 
		<span class="absolute bottom-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
			Projected global population and economy dynamics.
		</span>
	  </div>
  </div>
  <div class="flex leading-normal pl-16 font-light h-6 bg-[#FFFFFF] items-center gap-8 text-[#000000]">
    <!-- <select id="scenarioSelector" bind:value={selectedSSP} >
    {#each ssps as s}
        <option value={s}>{s}</option>
    {/each}
    </select> -->
    <fieldset>
        <div class="flex flex-row gap-5">
        {#each ssps as s}
          <div>
            <input type="radio" id={s} name="ssps" value={s} bind:group={selectedSSP}/>
            <label for={s}>{s}</label>
          </div>
        {/each}
    </div>
      </fieldset>
</div>
  <div role="contentinfo"
  class="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
  <div class="grid mr-4 place-items-center">
	<Icon icon="ix:cloud" style="font-size: 30px" />
	</div>
	<div class="group flex relative">
		<span>Climate Model Sensitivity</span> 
		<span class="absolute bottom-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
			Projected change in climate in response to greenhouse gas emissions.
		</span>
		</div>
</div>

<div class="flex leading-normal pl-16 font-light h-1 bg-[#FFFFFF] items-center gap-8 text-[#000000]">
    <fieldset>
        <div class="flex flex-row gap-5">
        {#each climates as s}
          <div>
            <input type="radio" id={s} name="climates" value={s} bind:group={selectedClimate}/>
            <label for={s}>{s}</label>
          </div>
        {/each}
    </div>
      </fieldset>
</div>
  </nav>
  
</div>

<div id="sankeyWrapper">

    <!-- the Plotly looks for this id; this is non-svelte-like but we can do it anyway -->
    <h5 class="block p-5 font-sans text-xl antialiased leading-snug tracking-normal text-blue-gray-900">
        Water Flows across Sectors (cubic-meters)
      </h5>
    <div id="sankeyDiagram"></div> 
    <h5 class="block p-5 m-4 font-sans text-xl antialiased leading-snug tracking-normal text-blue-gray-900">
        Energy Flows across Sectors (EJ)
      </h5>
    <div id="energySankeyDiagram"></div>

    <div class="flex flex-row flex-column  h-20 pl-8 bg-[#FFFFFF] items-center gap-8 text-white"></div>
    <!-- <div class="flex flex-row h-16 pl-8 bg-[#2B7F9E] items-center gap-8 text-white"></div> -->
</div>



</div>

<style>
    #scenarioSelectionBar {
        position: sticky; 
        top: 0;
    }
    #sankeyWrapper {
        width: 100vw;
        height: 800px;
        /* overflow-x: hidden;
        overflow-y: auto; */
        position: static;
        /* display: flex; */
        flex-direction: column;
        align-items: center;
        justify-content: start;
        right: 5px;
    }
    #sankeyDiagram {
        width: 100%;
        /* max-width: 1200px; */
        height: 100%;
    }
    #energySankeyDiagram {
        width: 100%;
        /* max-width: 1500px; */
        height: 100%;
    }

</style>