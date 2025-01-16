


<script>
    import Papa from 'papaparse';
    import { onMount } from 'svelte';
	import { base } from '$app/paths';
    import Icon from "@iconify/svelte";

    const sspMapping = { 'ssp3': 'SSP3', 'ssp5': 'SSP5', };
    const rcpMapping = { 'rcp45': 'RCP4.5', 'rcp85': 'RCP8.5',};
    const climateMapping = { 'cooler': 'Cooler', 'hotter': 'Hotter', };
    const unitMapping = {'Energy & Water': 'Energy (EJ) & Water (km<sup>3</sup>)', 'Energy': 'Energy (EJ)', 'Water': 'Water (km3)'};

    const ssps = ['ssp3', 'ssp5']; // backend identifiers 
    let selectedSSP = ssps[0]; // default to 'ssp3'

    const rcps = ['rcp45', 'rcp85']; // backend identifiers 
    let selectedRCP = rcps[0]; // default to 'rcp45'

    const climates = ['cooler', 'hotter']; // backend identifiers 
    let selectedClimate = climates[0]; // default to 'Cooler'
    
    const units = ['Energy & Water','Energy', 'Water'];  // backend identifiers 
    let selectedUnit = units[0]; // default to 'Energy & Water'

    // data is now fetched in a svelte-like way; see below
    let energywaterdata;

    // Generate Sankey frames by year and scenario
    // this is the same as you had it
    function generateSankeyFrames(data, selectedSSP, selectedRCP, selectedClimate, selectedUnit) {
        const filteredData = data.filter(row => row.ssp === selectedSSP && row.rcp === selectedRCP && row.climate_sensitivity === selectedClimate && row.diagram === selectedUnit);
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
    // Energy-water Sankey
    function initializeHybridSankey(energywaterdata, selectedSSP, selectedRCP, selectedClimate, selectedUnit) {
        const { frames, labels } = generateSankeyFrames(energywaterdata, selectedSSP, selectedRCP, selectedClimate, selectedUnit);
        const initialFrame = frames[0];

        const layout = {
            title: `${unitMapping[selectedUnit]} Sankey Diagram for ${rcpMapping[selectedRCP]} ${climateMapping[selectedClimate]} ${sspMapping[selectedSSP]} Scenario`,
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
            updatemenus: [{
                type: "buttons",
                showactive: false,
                buttons: [
                    {
                        label: "Play",
                        method: "animate",
                        args: [null, { frame: { duration: 1000, redraw: true }, fromcurrent: true, mode: "immediate", transition: { duration: 500 } }]
                    },
                    {
                        label: "Pause",
                        method: "animate",
                        args: [[null], { mode: "immediate", frame: { duration: 0, redraw: false }, transition: { duration: 0 } }]
                    }
                ],
                    // button position
                    x: 0,
                    y: 0, 
                    pad: {t: 10, r: 10}
            }]
        };

        Plotly.newPlot("hybridSankeyDiagram", initialFrame.data, layout)
            .then(() => {
                Plotly.addFrames("hybridSankeyDiagram", frames);
            });
    }

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
    // the code here will run anytime the referenced, in-scope variables change
    // (in this case, `data` and `selectedScenario`), but the "if" construct means
    // we only run initializeSankey if both `data` and `selectedScenario` are "truthy",
    // meaning they have any non-false, non-zero, non-empty string value;
    // there are many other ways to use "$:" too
    $: if (energywaterdata && selectedSSP && selectedRCP && selectedClimate && selectedUnit) {
        initializeHybridSankey(energywaterdata, selectedSSP, selectedRCP, selectedClimate, selectedUnit);
    }

</script>

<!-- Svelte will always rerender the html when variables change reactively -->



<div class="flex flex-row w-screen">

    <div id='scenarioSelectionBar'
    class="sticky top-0 flex h-full w-full max-w-[21rem] p-7 flex-col rounded-xl bg-white bg-clip-border text-gray-700 border-2 drop-shadow-xl">
    <div class="p-2 mb-2">
        <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
        Scenario Selection
        </h5>
    </div>
    <nav class="flex min-w-[240px] flex-col gap-3 mb-8 font-sans text-base font-normal text-blue-gray-700">
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
                {#each rcps as r}
                <div>
                    <input type="radio" id={r} name="rcps" value={r} bind:group={selectedRCP}/>
                    <label for={r}>{rcpMapping[r]}</label>
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
            {#each climates as c}
            <div>
                <input type="radio" id={c} name="climates" value={c} bind:group={selectedClimate}/>
                <label for={c}>{climateMapping[c]}</label>
            </div>
            {/each}
        </div>
        </fieldset>
    </div>
    <div class="pt-9 ">
        <h5 class="block font-sans text-xl antialiased font-semibold tracking-normal text-blue-gray-900">
        Visualization Options
        </h5>
    </div>
    <nav class="flex min-w-[240px] flex-col gap-3 font-sans text-base font-normal text-blue-gray-700">
        <div role="contentinfo"
        class="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
        
        <div class="grid mr-4 place-items-center">
            <Icon icon="tabler:mist" style="font-size: 30px" />
            </div>


            <div class="group flex relative">
            <span>Show flows for:</span> 
            </div>
            
        </div>
        <div class="flex leading-normal m-8 pl-7 font-light h-6 bg-[#FFFFFF] items-center gap-8 text-[#000000]">
            <fieldset>
                <div class="flex flex-col  top-15 gap-5">
                {#each units as s}
                <div>
                    <input type="radio" id={s} name="units" value={s} bind:group={selectedUnit}/>
                    <label for={s}>{s}</label>
                </div>
                {/each}
            </div>
            </fieldset>
        </div>


    </nav>
    
    </div>





    <!-- Sankey placement -->

    <div id="sankeyWrapper" class="h-full w-full min-h-[800px] flex flex-col items-stretch flex-1">
        <div id="hybridSankeyDiagram" class="w-full min-h-[800px]"></div> 
        
    </div>

</div>
