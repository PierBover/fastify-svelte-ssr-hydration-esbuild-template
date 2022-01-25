<script>
	import {onMount} from 'svelte';
    import Menu from '../Menu.svelte';
	import {somethingToTestChunks} from '../../utils/client/index';

	onMount(() => {
		somethingToTestChunks();
	});
</script>

<Menu/>
<div class="About">
	<h1>About</h1>
</div>
