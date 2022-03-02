<script>
	import Lazy from 'svelte-lazy';

  import { publish } from "../../support/events"

  export let category
	export let places

  publish('update_menu', category)

  const sections = {
    vinedos: {
      title: 'Viñedos en el Valle de Guadalupe',
      description: 'Encuentra los mejores Viñedos de la Ruta del Vino Ensenada del Valle de Guadalupe'
    },
    restaurantes: {
      title: 'Restaurantes en el Valle de Guadalupe',
      description: 'Encuentra los mejores Restaurantes de la Ruta del Vino Ensenada del Valle de Guadalupe'
    },
    hoteles: {
      title: 'Hoteles en el Valle de Guadalupe',
      description: 'Encuentra los mejores Hoteles de la Ruta del Vino Ensenada del Valle de Guadalupe'
    }
  }

	const type = {
		vinedo: 'Viñedo',
		restaurante: 'Restaurante',
		hotel: 'Hotel'
	}
</script>

<script context="module">
	export async function preload(page) {
    const { category } = page.params;
		const response = await this.fetch('/places.json');
		const places = await response.json();

    const adjustedCategory = {
      vinedos: 'vinedo',
      restaurantes: 'restaurante',
      hoteles: 'hotel'
    }

		return {
			places: places.filter(place => place.type === adjustedCategory[category]),
      category
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
	<title>{sections[category].title}</title>
	<meta property="og:title" content={sections[category].title}>
	<meta property="og:description" content={sections[category].description}>
	<meta property="og:image" content="https://www.larutadelvinoensenada.com/banner.webp">
	<meta property="og:url" content="https://www.larutadelvinoensenada.com/">
	<meta name="description" content={sections[category].description}>
	<link href="https://www.google-analytics.com" rel="dns-prefetch">
</svelte:head>

<div class="cover">
	<h1>{sections[category].title}</h1>
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

<p>{sections[category].description}</p>
