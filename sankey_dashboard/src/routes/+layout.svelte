<script>
	import '../app.css';
	// this variable will be important if deploying to a non-root url,
	// such as with github pages when you don't have a custom domain;
	// defined in `svelte.config.js`
	import { base } from '$app/paths';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	const nav_items = ['Energy-Water Flows for the United States over the 21st Century'];
	const page_items = ['sankeys', 'methodology', 'data', 'other visuals', 'resources', 'acknowledgements'];

	import Icon from "@iconify/svelte";
</script>

<div class="flex flex-row w-screen font-sans h-[120px] pl-8  bg-gradient-to-r from-[#2B7F9E] to-[#5e1f04] items-center gap-8 text-white text-3xl">	

	<a href="{base}/">Integrated Energy-Water Flows for the United States over the 21st Century</a>
	<img src="PNNLVerticalLogo.png" alt="card-image" class='h-[100px] ml-auto pr-7'/>

</div>

<div class="flex flex-row w-screen font-sans h-auto pl-8 bg-none items-center gap-8 text-gray-800 rounded-s text-gray-700 border-2">
    
	{#each page_items as item}
	<a href="{base}/{item==="sankeys" ? " " : item==="other visuals" ? "visuals" : item}" class="hover:text-gray-500">{item.toUpperCase()}</a>
    {/each}
</div>
<!-- <a href="{base}/{item === "sankeys" ? ''  : item}" class="hover:text-gray-500">{item.toUpperCase()}</a> -->

<div class="flex flex-row w-screen h-[20px] pl-8  bg-white gap-8">	


</div>




<slot></slot>
