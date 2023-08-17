<script>
  import Nav from "../components/Nav.svelte";

  export let segment;
</script>

<Nav {segment} />

<main>
  <slot />
</main>

<footer>
  <div>
    <p>Proyecto en Colaboración con:</p>
    <div>
      <ul>
        <li><a href="https://www.garitacenter.com/">Reporte de Garitas</a></li>
        <li><a href="https://www.feedmetj.com/">Restaurantes en Tijuana</a></li>
        <li>
          <a href="http://www.playami.com">Restaurantes en Playas de Tijuana</a>
        </li>
        <li>
          <a href="https://coupons.garitacenter.com/"
            >Papa Johns Coupons and Promo Codes</a
          >
        </li>
        <li>
          <a href="https://www.mintitmedia.com/">Desarrollo Web en Tijuana</a>
        </li>
      </ul>
    </div>
  </div>
</footer>

<style>
  main,
  footer {
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
