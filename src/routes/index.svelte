<script>
	import Lazy from 'svelte-lazy';

	export let places
	let title = 'Restaurantes, Hoteles y Viñedos | La Ruta del Vino Ensenada'
	let description = 'La Ruta del Vino, es el nombre que se le da al conjunto de viñedos, restaurantes y hoteles en el Valle de Guadalupe'

	const type = {
		vinedo: 'Viñedo',
		restaurante: 'Restaurante',
		hotel: 'Hotel'
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

	li {
		margin: 40px 0;
	}

	img {
		height: 454px;
		width: 100%;
		object-fit: cover;
	}

	.cover {
		padding: 220px 0;
		background-color: #660253;
		color: white;
		text-align: center;	
	}

	h2, h3, p {
		padding: 0 12px;
	}

	a {
		text-decoration: none;
	}
</style>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title}>
	<meta property="og:description" content={description}>
	<meta property="og:image" content="https://www.larutadelvinoensenada.com/banner.webp">
	<meta property="og:url" content="https://www.larutadelvinoensenada.com/">
	<meta name="description" content={description}>
	<link href="https://www.google-analytics.com" rel="dns-prefetch">
</svelte:head>

<div class="cover">
	<h1>Restaurantes, Hoteles y Viñedos del Valle de Guadalupe</h1>
	<h2>La Ruta del Vino Ensenada</h2>
</div>
<p>
	La Ruta del Vino, es el nombre que se le da al conjunto de viñedos, restaurantes y hoteles en el Valle de Guadalupe.
</p>

<ul>
	{#each places as place}
	<li>
		<h2><a href={place.web} target="_blank" rel="nofollow noreferrer">{place.name}</a></h2>
		<h3>{type[place.type]}</h3>
		<Lazy height={300}>
			<img src={`ruta-vino-valle-guadalupe/${place.img}`} alt={place.name}>
		</Lazy>
		<p>{place.desc}</p>
		<p><a href={`https://www.google.com/maps/@${place.lat},${place.lng},17z`} target="_blank" rel="nofollow noreferrer">{place.address}</a></p>
	</li>
	{/each}
</ul>

<p>{description}</p>
