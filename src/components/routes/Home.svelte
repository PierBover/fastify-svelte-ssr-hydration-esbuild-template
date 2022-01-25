<script>
	import {onMount, getContext} from 'svelte';
	import {somethingToTestChunks} from '../../utils/client/index';
    import Menu from '../Menu.svelte';

	let hydrated = false;
	const {message} = getContext('routeData');

	onMount(() => {
		hydrated = true;
		somethingToTestChunks();
	});
</script>

<Menu/>

<div class="Home">
	<h1>
		Home

		{#if hydrated}
			(hydrated)
		{:else}
			(SSR)
		{/if}
	</h1>

	<p>{message}</p>
</div>
