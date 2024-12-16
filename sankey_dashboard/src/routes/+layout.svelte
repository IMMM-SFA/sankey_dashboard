<script>
	import '../app.css';
	// this variable will be important if deploying to a non-root url,
	// such as with github pages when you don't have a custom domain;
	// defined in `svelte.config.js`
	import { base } from '$app/paths';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	const nav_items = ['Water-Energy Sankey Diagrams for the United States'];
	const page_items = ['diagrams', 'methodology', 'data', 'publications', 'acknowledgements'];

	import Icon from "@iconify/svelte";
</script>

<div class="flex flex-row w-screen font-sans h-20 pl-8 bg-[#2B7F9E] items-center gap-8 text-white text-xl">
    
    {#each nav_items as item}
        <a href="{base}/{item === "Water-Energy Sankey Diagrams for the United States" ? '' : item}">{item.toUpperCase()}</a>
    {/each}
</div>

<div class="flex flex-row w-screen font-sans h-18 pl-8 bg-[#b5bdb7] items-center gap-8 text-white text-l">
    
    {#each page_items as item}
        <a href="{base}/{item === "diagrams" ? '' : item}">{item.toUpperCase()}</a>
    {/each}
</div>




<slot></slot>
