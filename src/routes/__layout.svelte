<script>
	import "../app.css"
	import Topbar from "$lib/components/Topbar.svelte"
	import { page } from "$app/stores";
	import { SvelteToast } from "@zerodevx/svelte-toast";
</script>

{#if $page.path === "/login" || $page.path === "/register"}
	<!-- No Navbar here -->
{:else}
	<Topbar />
{/if}

<main class="container">
	<SvelteToast />
	<slot />
</main>
