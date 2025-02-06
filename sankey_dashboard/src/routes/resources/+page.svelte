<script>
  
	import { base } from '$app/paths';
  


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
  <div id='resources'
  class="relative flex h-full w-full max-w-[90rem] p-8 flex-col rounded-xl bg-white bg-clip-border text-gray-700 border-2">
    <div class="p-2 mb-2">


  

      
      <!-- RESOURCES  -->
      <h1 class="mb-7 text-slate-800 text-3xl font-semibold">
        Resources
      </h1>
      <hr class="border-1 border-gray-300">
      <br>
        <!-- 
        <h2 class="mb-5 mt-5 text-slate-800 text-xl font-semibold"> Integrated Water Power Resilience Project Website</h2>

        <p class="mb-7 text-slate-800 text-l font-light"> The motivation of the <a class='text-[#2B7F9E]' href="https://www.pnnl.gov/projects/integrated-water-power-resilience-project" target="_blank"> Integrated Water Power Resilience Project</a> is to identify and develop opportunities to improve resilience in the water and power sectors through coordinated planning, investment, and operations and thereby provide benefits to power and water utilities, consumers, and the environment. The project website provides access to other water and energy research supported under this project as well as previously developed historic Sankey diagrams of water and energy sectors at the aggregate US level and for each major US electricity interconnection.</p>
        <br>
        <a href="https://www.pnnl.gov/projects/integrated-water-power-resilience-project" target="_blank">
          <img src="EED_1253_BRAND_WaterPowerResLogo-HERO-03.jpg" alt="iwpr-project-logo" class='h-[150px]'/>
        </a>
        
        <br>
        <br> -->

        <div class="flex flex-row items-start">
          <div class="flex-1">
            <h2 class="mb-5 mt-5 text-slate-800 text-xl font-semibold"> Integrated Water Power Resilience Project Website</h2>
            <p class="mb-7 text-slate-800 text-l font-light"> The motivation of the <a class='text-[#2B7F9E]' href="https://www.pnnl.gov/projects/integrated-water-power-resilience-project" target="_blank"> Integrated Water Power Resilience Project</a> is to identify and develop opportunities to improve resilience in the water and power sectors through coordinated planning, investment, and operations and thereby provide benefits to power and water utilities, consumers, and the environment. The project website provides access to other water and energy research supported under this project as well as previously developed historic Sankey diagrams of water and energy sectors at the aggregate US level and for each major US electricity interconnection.</p>
          </div>
          <div class="ml-4">
            <a href="https://www.pnnl.gov/projects/integrated-water-power-resilience-project" target="_blank">
              <img src="EED_1253_BRAND_WaterPowerResLogo-HERO-03.jpg" alt="iwpr-project-logo" class='h-[190px]'/>
            </a>
          </div>
        
          <!-- <div class="ml-4 flex justify-center items-center">
            <a href="https://www.pnnl.gov/projects/integrated-water-power-resilience-project" target="_blank">
              <img src="EED_1253_BRAND_WaterPowerResLogo-HERO-03.jpg" alt="iwpr-project-logo" class='h-[190px] transition-transform duration-200 hover:scale-105'/>
            </a>
          </div> -->
        
        </div>
        <div class="flex flex-row items-start">
        <div class="flex-1">
          <h2 class="mb-5 mt-5 text-slate-800 text-xl font-semibold"> Integrated MultiSector MultiScale Modeling (IM3) Project Website</h2>
          <p class="mb-7 text-slate-800 text-l font-light"> The <a class='text-[#2B7F9E]' href="https://im3.pnnl.gov/" target="_blank"> IM3 Project</a> couples open-source, process-based, human and natural system models to project vulnerability and resilience from local to continental scales in the United States to both short- and long-term influences.
          </p>
        </div>
        <div class="ml-20 mt-10">
          <a href="https://im3.pnnl.gov/" target="_blank">
            <img src="IM3_logo.jpeg" alt="im3-project-logo" class='h-[140px] '/>
          </a>
        </div>
        </div>
        <br>
        <br>
        
        <!-- RESOURCES  -->
        <h1 class="mb-7 text-slate-800 text-3xl font-semibold">
          FAQ
        </h1>
        <hr class="border-1 border-gray-300">
        <h2 class="mb-5 mt-5 text-slate-800 text-xl font-semibold"> What is a Sankey Diagram?</h2>
        <p>
          Sankey diagrams provide a visual representation of processes and transfers within a given system, shown as proportional flows. The width of given flows in the same units are proportional to the amount of the given unit being transferred. 
        </p>
        <br>
        <h2 class="mb-5 mt-5 text-slate-800 text-xl font-semibold"> How do I download the data in the Sankey diagrams?</h2>
        <p>
          Data in the Sankey diagrams can be directly downloaded as a csv from the <a href="{base}/data" class="text-[#2B7F9E] hover:text-[#9e422b] hover:scale-105">Data</a> page.
        </p>
        <br>
        <br>
        <br>
        <br>      
      
      <!-- PUBLICATIONS  -->
      <h1 class="mb-7 text-slate-800 text-3xl font-semibold">
        Publications
      </h1>
      <hr class="border-1 border-gray-300">
      
        <h2 class="mb-5 mt-5 text-slate-800 text-xl font-semibold"> Journal Articles</h2>
        
          <p class="mb-7 text-slate-800 text-l font-light"> Mongird K., J.S. Rice, K. Oikonomou, and J.S. Homer. 2023. "Energy-water interdependencies across the three major United States electric grids: a multi-sectoral analysis." Utilities Policy 85. PNNL-SA-175036. doi:<a class='text-[#2B7F9E]' href="https://doi.org/10.1016/j.jup.2023.101673" target="_blank"> 10.1016/j.jup.2023.101673</a>  
          </p>

          <p class="mb-7 text-slate-800 text-l font-light">Mongird K., K. Oikonomou, J.S. Homer, and J.S. Rice. 2022. "interflow: A Python package to organize, calculate, and evaluate cross-sectoral resource interdependency data." Journal of Open Source Software 7, no. 74:4336. PNNL-SA-171534. doi:<a class='text-[#2B7F9E]' href="https://doi.org/10.21105/joss.04336" target="_blank"> 10.21105/joss.04336</a> 
          </p>
          
          <p class="mb-7 text-slate-800 text-l font-light"> Zhao et al. (In-prep). Dominant Water Sector Response Adapts to Climate and Socioeconomic Change in the United States.
          </p>
        
        <h2 class="mb-5 mt-5 text-slate-800 text-xl font-semibold"> Technical Reports</h2>
          
          <p class="mb-7 text-slate-800 text-l font-light"> Mongird K., J.S. Homer, J.S. Rice, and K. Oikonomou. 2024. <a class='text-[#2B7F9E]' href="https://www.pnnl.gov/main/publications/external/technical_reports/PNNL-36021.pdf" target="_blank">Water & Energy Interdependencies Across Economic Sectors of the United States.</a> PNNL-36021. Richland, WA: Pacific Northwest National Laboratory. </p>
        
        <h2 class="mb-5 mt-5 text-slate-800 text-xl font-semibold"> Presentations</h2>

          <p class="mb-7 text-slate-800 text-l font-light">Homer J.S., H. Niazi, K. Mongird, and J.S. Rice. 10/22/2024. "Looking back and Looking forward: Water & Energy Interdependencies Across Sectors." Presented by J.S. Homer, H. Niazi at EPRI Water-Energy Transformation Forum, Atlanta, Georgia. PNNL-SA-204849.</p>
          <p class="mb-7 text-slate-800 text-l font-light">Mongird K., J.S. Homer, J.S. Rice, and K. Oikonomou. 09/24/2024. "Synergies and Challenges: Mapping Energy-Water Dependencies at Multiple Scales." Presented by K. Mongird at Water Smart Innovations Conference 2024, Las Vegas, Nevada. PNNL-SA-203538.</p>
          <p class="mb-7 text-slate-800 text-l font-light">Mongird K., and J.S. Homer. 08/14/2024. "Water & Energy Interdependencies: Data and Visuals." Presented by J.S. Homer, K. Mongird at IEEE Energy and Water Nexus Industry Connection Workshop, Online, Washington. PNNL-SA-202380.</p>
          <p class="mb-7 text-slate-800 text-l font-light">Mongird K., and J.S. Homer. 06/24/2024. "Integrated Water Power Resilience Project Briefing." Presented by J.S. Homer, K. Mongird at National Lab Monthly Energy-Water Exchange, Online, Washington. PNNL-SA-199971.</p>
          <p class="mb-7 text-slate-800 text-l font-light">Mongird K., and J.S. Homer. 02/07/2024. "Integrated Water Power Resilience." Presented by J.S. Homer, K. Mongird at Interagency Water Working Group (IWWG) monthly meeting, Online, Washington. PNNL-SA-194517.</p>
          <p class="mb-7 text-slate-800 text-l font-light">Mongird K., J.S. Homer, J.S. Rice, and K. Oikonomou. 11/09/2023. "Energy-water Interdependencies Across Sectors and Scales: Sankey Diagram Visualizations." Presented by K. Mongird, J.S. Homer at NEWS RD&D Interagency Meeting, Online, District Of Columbia. PNNL-SA-192272.</p>
        

    </div>
  </div>
</div>  
