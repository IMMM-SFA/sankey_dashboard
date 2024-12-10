

<script>
const nav_items = ["home", "about"] ;

</script>

<style>

</style>

<div> 

{#each nav_items as item}
<a href="/{item}"> {item}</a>
{/each}

</div>

<slot></slot>