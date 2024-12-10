
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>


        
        <div id="sankeyDiagram" style="width:100%;max-width:1200px;height:800px;"></div>
        <script>
            import { onMount } from 'svelte'
            import Papa from 'papaparse'
            import Plotly from 'plotly'

            onMount(() => {

            // Function to load CSV file
            function loadCSV(file, callback) {
                fetch(file)
                    .then(response => {
                        if (!response.ok) throw new Error("Network response was not ok");
                        return response.text();
                    })
                    .then(data => {
                        callback(Papa.parse(data, { header: true }).data);
                    })
                    .catch(error => console.error("Error loading CSV file:", error));
            }
    
            // Generate Sankey frames by year and scenario
            function generateSankeyFrames(data, selectedScenario) {
                const filteredData = data.filter(row => row.scenario === selectedScenario);
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
            function initializeSankey(data, selectedScenario) {
                const { frames, labels } = generateSankeyFrames(data, selectedScenario);
                const initialFrame = frames[0];
    
                const layout = {
                    title: "Water Sankey Diagram by Year",
                    font: { size: 12 },
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
                        ]
                    }]
                };
    
                Plotly.newPlot("sankeyDiagram", initialFrame.data, layout)
                    .then(() => {
                        Plotly.addFrames("sankeyDiagram", frames);
                    });
            }
    
            // Populate scenario dropdown
            function populateScenarioDropdown(data) {
                const scenarios = ['rcp45cooler_ssp3', 'rcp45cooler_ssp5', 
                                    'rcp45hotter_ssp3', 'rcp45hotter_ssp5', 
                                    'rcp85cooler_ssp3', 'rcp85cooler_ssp5', 
                                    'rcp85hotter_ssp3', 'rcp85hotter_ssp5', 
                                     ];
                const dropdown = document.getElementById("scenarioDropdown");
    
                scenarios.forEach(scenario => {
                    const option = document.createElement("option");
                    option.value = scenario;
                    option.textContent = scenario;
                    dropdown.appendChild(option);
                });
    
                dropdown.addEventListener("change", () => {
                    initializeSankey(data, dropdown.value);
                });
    
                // Initialize with the first scenario
                if (scenarios.length > 0) {
                    dropdown.value = scenarios[4];
                    initializeSankey(data, scenarios[4]);
                }
            }
    
            // Load CSV and initialize Sankey diagram
            document.addEventListener("DOMContentLoaded", () => {
                loadCSV("/data.csv", data => {
                    populateScenarioDropdown(data);
                });
            });
        })
        </script>

