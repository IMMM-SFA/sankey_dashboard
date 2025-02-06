<script>
	import '../app.css';
	// this variable will be important if deploying to a non-root url,
	// such as with github pages when you don't have a custom domain;
	// defined in `svelte.config.js`
	import { base } from '$app/paths';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	const nav_items = ['Energy-Water Flows for the United States over the 21st Century'];
	const page_items = ['sankeys', 'methodology',  'data', 'resources', 'acknowledgments'];

	import Icon from "@iconify/svelte";
</script>


<div class="flex flex-row w-screen font-sans h-[120px] pl-8  bg-gradient-to-r from-[#2B7F9E] to-[#5e1f04] items-center gap-8 text-white text-3xl">	

	<a href="{base}/">Integrated Energy-Water Flows for the United States over the 21st Century</a>
    <div class="flex flex-col items-center ml-auto pr-4">
        <div class="bg-red-500 text-white text-sm font-semibold px-2 py-1 text-center rounded">Alpha Version</div>
        <div class="text-white text-xs mt-1">For internal use only. Do not share</div>
    </div>
	<img src="PNNLVerticalLogo.png" alt="card-image" class='h-[100px] ml-auto pr-7'/>

</div>

<div class="flex flex-row w-screen font-sans h-auto pl-8 bg-none items-center gap-8 text-gray-800 rounded-s text-gray-700 border-2">
	
	{#each page_items as item}
	<a href="{base}/{item==="sankeys" ? " " : item==="data & resources" ? "resources" : item}" class="hover:text-[#2B7F9E] hover:scale-105">{item.toUpperCase()}</a>
    {/each}
	
</div>

<div class="flex flex-row w-screen h-[20px] pl-8  bg-white gap-8">	


</div>




<slot></slot>
