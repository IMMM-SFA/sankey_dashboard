<script>
    import Sankey from "$lib/Sankey.svelte";

</script>

<div class="w-full hidden lg:block ">
    <Sankey />
</div>

<div class="w-full block lg:hidden ">
    <div id='scenarioSelectionBar' class="sticky top-0 flex h-full w-full p-7 flex-col rounded-xl bg-white bg-clip-border text-gray-700 border-2 drop-shadow-xl">
    <div class="p-2 mb-2">
        <h5 class="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
        This page is not available on small screens or mobile devices. Please use a desktop or larger screen view contents.
        </h5>
    </div>
</div>
</div>