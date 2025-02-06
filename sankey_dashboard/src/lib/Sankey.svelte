

<script>
    import Papa from 'papaparse';
    import { onMount } from 'svelte';
	import { base } from '$app/paths';
    import Icon from "@iconify/svelte";
 
    const sspMapping = { 'ssp3': 'Low', 'ssp5': 'High', };
    const rcpMapping = { 'rcp45': 'Low', 'rcp85': 'High',};
    const climateMapping = { 'cooler': 'Cooler', 'hotter': 'Hotter', };
    const diagramMapping = {'Energy & Water': 'Integrated Energy & Water', 'Energy': 'Energy', 'Water': 'Water'};
    const waterUnitMapping = {'km3': 'Cubic Kilometers', 'billion_gallons': 'Billion Gallons', 'million_acre_ft': 'Million Acre-Feet'};
    const energyUnitMapping = {'EJ': 'Exajoules', 'quads': 'Quads', 'terawatt_hours': 'Terawatt-hours'};

    const ssps = ['ssp3', 'ssp5']; // backend identifiers 
    let selectedSSP = ssps[0]; // default to 'ssp3'

    const rcps = ['rcp45', 'rcp85']; // backend identifiers 
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

    // Generate Sankey frames by year and scenario
    // this is the same as you had it
    function generateSankeyFrames(data, selectedSSP, selectedRCP, selectedClimate, selectedDiagram, selectedEnergyUnits, selectedWaterUnits) {
        
        const selectedUnitsList = [selectedEnergyUnits, selectedWaterUnits];
        const filteredData = data.filter(row => (row.ssp === selectedSSP) && (row.rcp === selectedRCP) && (row.climate_sensitivity === selectedClimate) && (row.diagram === selectedDiagram) && (selectedUnitsList.includes(row.units)));
        const years = [...new Set(filteredData.map(row => row.year))];
        const labels = new Set();
        const xCoords = [];
        const yCoords = [];
        const frames = [];

        // collect all unique labels
        filteredData.forEach(row => {
            labels.add(row.source);
            labels.add(row.target);
        });

        const labelsArray = [...labels];

        // apply custom coordinates to "Wind" only if the diagram is "Energy & Water"
        if ('Energy & Water' === selectedDiagram) {
            const windIndex = labelsArray.indexOf("Wind");
            if (windIndex !== -1) { xCoords[windIndex] = 0.335; yCoords[windIndex] = 0.05; }
        }

        years.forEach(year => {
            const yearData = filteredData.filter(row => row.year === year);
            const sources = [];
            const targets = [];
            const values = [];
            const linkColors = [];
            const flowHoverLabels = [];
            const nodeColors = Array(labelsArray.length).fill(null);
            
            yearData.forEach(row => {
                sources.push(labelsArray.indexOf(row.source));
                targets.push(labelsArray.indexOf(row.target));
                values.push(parseFloat(row.value));
                linkColors.push(row.link_color);

                nodeColors[labelsArray.indexOf(row.source)] = row.source_color;
                nodeColors[labelsArray.indexOf(row.target)] = row.target_color;
                flowHoverLabels.push(parseFloat(row.unit_value));
            });

            frames.push({
                name: year,
                data: [{
                    type: "sankey",
                    valueformat: '.3r',
                    orientation: "h",
                    node: {
                        pad: 15,
                        thickness: 20,
                        line: { color: "black", width: 0.5 },
                        label: labelsArray,
                        hoverinfo: "none",
                        color: nodeColors,
                        x: xCoords,
                        y: yCoords
                    },
                    link: {
                        source: sources,
                        target: targets,
                        value: values,
                        color: linkColors,
                        customdata: flowHoverLabels,
                        hovertemplate: "Source: %{source.label}<br>Target: %{target.label}<br>Value: %{customdata}<extra></extra>"

                    }
                }]
            });
        });

        return { frames, labels: labelsArray };
    }

    // Energy-water Sankey
    function initializeHybridSankey(energywaterdata, selectedSSP, selectedRCP, selectedClimate, selectedDiagram, selectedEnergyUnits, selectedWaterUnits) {
        const { frames, labels } = generateSankeyFrames(energywaterdata, selectedSSP, selectedRCP, selectedClimate, selectedDiagram, selectedEnergyUnits, selectedWaterUnits);
        const initialFrame = frames[0];

        const layout = {
            title: `${diagramMapping[selectedDiagram]} Sankey Diagram for the United States`,
            font: { size: 14 },
            sliders: [{
                steps: frames.map(frame => ({
                    method: "animate",
                    label: frame.name,
                    args: [[frame.name], { mode: "next", frame: { duration: 2000, redraw: true }, transition: { duration: 2000 , easing: "cubic-in-out"} }]
                })),
                active: 0,
                currentvalue: {
                    prefix: "Year: ",
                    font: { size: 16, color: "#666" }
                },
                pad: { t: 10 }
            }],
            updatemenus: [{
                type: "buttons",
                showactive: false,
                buttons: [
                    {
                        label: "Play",
                        method: "animate",
                        args: [null, { frame: { duration: 2000, redraw: true }, fromcurrent: true, mode: "next", transition: { duration: 1000 } }]
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
            }],
            annotations: [
            {
                text: `${rcpMapping[selectedRCP]} Fossil-fuel Emphasis & ${sspMapping[selectedSSP]} Population and Economic Growth Scenario`,
                x: 0.5,
                y: 1.05,
                xref: "paper",
                yref: "paper",
                showarrow: false,
                font: {
                    size: 16,
                    color: "gray"
                },
                align: "center"
            }
        ],
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
    $: if (energywaterdata && selectedSSP && selectedRCP && selectedClimate && selectedDiagram && selectedEnergyUnits && selectedWaterUnits) {
        initializeHybridSankey(energywaterdata, selectedSSP, selectedRCP, selectedClimate, selectedDiagram, selectedEnergyUnits, selectedWaterUnits);
    }

    // var csv = Papa.unparse(filteredData);

    // var csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});

    // var csvURL = window.URL.createObjectURL(csvData);

    // var testLink = document.createElement('a');

    // testLink.href = csvURL;
    // testLink.setAttribute('download', 'test.csv');
    // testLink.click();


    function downloadCSV(energywaterdata, selectedSSP, selectedRCP, selectedClimate, selectedDiagram, selectedEnergyUnits, selectedWaterUnits) {
        if (!energywaterdata.length) return;
        
        const selectedUnitsList = [selectedEnergyUnits, selectedWaterUnits];
        const filteredData = energywaterdata.filter(row => (row.ssp === selectedSSP) && (row.rcp === selectedRCP) && (row.climate_sensitivity === selectedClimate) && (row.diagram === selectedDiagram) && (selectedUnitsList.includes(row.units)));
        
        const columnsToDownload = ["rcp", 'ssp', "source", "target", "year", "unit_value", "units", "diagram"];

        const selectedData = filteredData.map(item => {
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



<div class="flex flex-row w-screen">

    <div id='scenarioSelectionBar'
    class="sticky top-0 flex h-full w-full max-w-[21rem] p-7 flex-col rounded-xl bg-white bg-clip-border text-gray-700 border-2 drop-shadow-xl">
    <div class="p-2 mb-2">
        <div class="flex items-center">
        <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
        Scenario Selection 
        </h5>
        <!-- <span>
        <Icon icon="lucide:info" style="font-size: 15px" />
        </span>  -->

        </div>
    </div>
    
    <nav class="flex min-w-[240px] flex-col gap-3 mb-8 font-sans text-base font-normal text-blue-gray-700">
        <div role="contentinfo"
        class="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
        
        <div class="grid mr-4 place-items-center">
            <Icon icon="tabler:building-factory" style="font-size: 30px" />
            </div>

            <div class="group flex relative">
            <span>Fossil-fuel Emphasis</span> 
            <!-- <span class="absolute bottom-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                Projected levels of global warming by 2100 due to changing greenhouse gas concentrations.
            </span> -->
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
            <span>Population & Economic Growth</span> 
            <!-- <span class="absolute bottom-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                Projected global population and economy dynamics.
            </span> -->
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
    <!-- <div role="contentinfo"
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
    </div> -->
    <div class="pt-9 ">
        <h5 class="block font-sans text-xl antialiased font-semibold tracking-normal text-blue-gray-900">
        Visualization Options
        </h5>
    </div>
    <nav class="flex min-w-[240px] flex-col font-sans text-base font-normal text-blue-gray-700">
        <div role="contentinfo"
        class="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
        
        <div class="grid mr-4 place-items-center">
            <Icon icon="tabler:mist" style="font-size: 25px" />
            </div>

            <div class="group flex relative">
            <span>Show flows for:</span> 
            </div>
        </div>

        <div class="flex leading-normal m-8 pl-7 font-light h-6 bg-[#FFFFFF] items-center gap-8 text-[#000000]">
            <fieldset>
                <div class="flex flex-col  top-15 gap-2">
                {#each diagrams as s}
                <div>
                    <input type="radio" id={s} name="diagram" value={s} bind:group={selectedDiagram}/>
                    <label for={s}>{s}</label>
                </div>
                {/each}
            </div>
            </fieldset>
        </div>
    </nav>

    <nav class="flex min-w-[240px] flex-col font-sans text-base font-normal text-blue-gray-700">
        <div role="contentinfo"
        class="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
        
        <div class="grid mr-4 place-items-center">
            <Icon icon="lets-icons:water" style="font-size: 25px" />
            </div>

            <div class="group flex relative">
            <span>Select Water Units:</span> 
            </div>
        </div>

        <div class="flex leading-normal m-8 pl-7 font-light h-6 bg-[#FFFFFF] items-center gap-8 text-[#000000]">
            <fieldset>
                <div class="flex flex-col top-15 gap-2">
                {#each water_units as s}
                <div>
                    <input type="radio" id={s} name="waterUnits" value={s} bind:group={selectedWaterUnits}/>
                    <label for={s}>{waterUnitMapping[s]}</label>
                </div>
                {/each}
            </div>
            </fieldset>
        </div>
    </nav>
    
    <nav class="flex min-w-[240px] flex-col font-sans text-base font-normal text-blue-gray-700">
        <div role="contentinfo"
        class="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
        
        <div class="grid mr-4 place-items-center">
            <Icon icon="nimbus:fire" style="font-size: 25px" />
            </div>

            <div class="group flex relative">
            <span>Select Energy Units:</span> 
            </div>
        </div>

        <div class="flex leading-normal m-8 pl-7 font-light h-6 bg-[#FFFFFF] items-center gap-8 text-[#000000]">
            <fieldset>
                <div class="flex flex-col  top-15 gap-2">
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

    
    
    <!-- Sankey placement -->


    <div id="sankeyWrapper" class="h-full w-full min-h-[800px] flex flex-col items-stretch flex-1 m-0 p-0">
        <div id="hybridSankeyDiagram" class="w-full min-h-[800px] m-0 p-0"></div> 
    </div>



</div>

