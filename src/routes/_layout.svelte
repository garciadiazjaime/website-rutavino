<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<style>
	main {
		position: relative;
		max-width: 56em;
		background-color: white;
		margin: 0 auto;
		box-sizing: border-box;
		font-size: 1.2em;
	}
</style>

<Nav {segment}/>

<main>
	<slot></slot>
</main>
