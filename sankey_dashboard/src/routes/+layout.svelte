<script>
	import '../app.css';
	// this variable will be important if deploying to a non-root url,
	// such as with github pages when you don't have a custom domain;
	// defined in `svelte.config.js`
	import { base } from '$app/paths';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	const nav_items = ['IM3 Sankey Diagrams', 'about'];
</script>

<div class="flex flex-row w-screen h-16 pl-8 bg-[#2B7F9E] items-center gap-8 text-white">
    
    {#each nav_items as item}
        <a href="{base}/{item === "IM3 Sankey Diagrams" ? '' : item}">{item.toUpperCase()}</a>
    {/each}
</div>

<slot></slot>
