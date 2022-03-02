<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<style>
	main, footer {
		position: relative;
		max-width: 56em;
		background-color: white;
		margin: 0 auto;
		box-sizing: border-box;
		font-size: 1.2em;
	}
	ul {
		padding: 0;
		list-style-type: none;
	}
</style>

<Nav {segment}/>

<main>
	<slot></slot>
</main>

<footer>
	<div>
		<p>
			Proyecto en Colaboración con: 
		</p>
		<div>
			<ul>
				<li><a href="https://www.garitacenter.com/">Reporte de Garitas</a></li>
				<li><a href="https://www.feedmetj.com/">Restaurantes en Tijuana</a></li>
				<li><a href="http://www.playami.com">Restaurantes en Playas de Tijuana</a></li>
				<li><a href="https://www.comprarcasatijuana.com/">Comprar Casa en Tijuana</a></li>
				<li><a href="https://www.noticiasmexico.org/">Últimas Noticias de México</a></li>
				<li><a href="https://www.mintitmedia.com/">Desarrollo Web en Tijuana</a></li>
			</ul>
		</div>
	</div>
</footer>
