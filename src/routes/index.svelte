<script>
	import Lazy from 'svelte-lazy';

	export let places
	let title = 'Viñedos, restaurantes y hoteles del Valle de Guadalupe | La Ruta del Vino Ensenada'
	let description = 'La Ruta del Vino Ensenada es una aplicación donde podrás encontrar información sobre viñedos, restaurantes y hoteles del Valle de Guadalupe'

	const type = {
		1: 'Viñedo',
		2: 'Restaurante',
		3: 'Hospedaje'
	}
</script>

<script context="module">
	export async function preload() {
		const response = await this.fetch('/places.json');
		const places = await response.json();

		return {
			places
		}
	}
</script>

<style>
	ul {
		padding: 0;
		list-style-type: none;
	}

	img {
		height: 454px;
		width: 100%;
		object-fit: cover;
	}

	h1 {
		padding: 220px 0;
		background-color: #660253;
		color: white;
		text-align: center;
	}

	h2, h3, p {
		padding: 0 12px;
	}
</style>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title}>
	<meta property="og:description" content={description}>
	<meta property="og:image" content="https://www.larutadelvinoensenada.com//banner.webp">
	<meta property="og:url" content="https://www.larutadelvinoensenada.com/">
	<meta name="description" content={description}>
	<link href="https://www.google-analytics.com" rel="dns-prefetch">
</svelte:head>

<h1>La Ruta del Vino <br /> Valle de Guadalupe</h1>
<p>
	La Ruta del Vino, es el nombre que se le da al conjunto de viñedos y restaurantes en el Valle de Guadalupe.
</p>

{#each places as place}
<ul>
	<li>
		<h2>{place.name}</h2>
		<h3>{type[place.type]}</h3>
		<Lazy height={300}>
			<img src={`ruta-vino-valle-guadalupe/${place.img}`} alt={place.name}>
		</Lazy>
		<p>{place.desc}</p>
	</li>
</ul>
{/each}

<footer>
	<p>{description}</p>
	<div>
		Proyecto en Colaboración con: <br />
		<a href="https://www.garitacenter.com/">Reporte de Garitas | Linea Tijuana / San Ysidro - Otay</a>
		<br />
		<a href="https://www.feedmetj.com/">¿Qué comer en Tijuana?</a>
		<br />
		<a href="http://www.playami.com">¿Qué comer en Playas de Tijuana?</a>
		<br />
		<a href="https://www.comprarcasatijuana.com/">Comprar casa en Tijuana</a>
		<br />
		<a href="https://www.noticiasmexico.org/">Últimas Noticias de México</a>
		<br />
		<a href="https://www.mintitmedia.com/">Desarrollo Web en Tijuana</a>
	</div>
</footer>
