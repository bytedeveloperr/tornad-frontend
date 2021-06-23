<script>
  import Loader from "$lib/components/Loader.svelte";
import { Request } from "$lib/helpers/Request";
import { onMount } from "svelte";



  const request = new Request()

  const data = {
    loading: false,
    items: [],

    methods: {
      async fetchSpotPrices(){
        const response = await request.get('/spot-prices')
        if (response.error) {
            Toast.error(response.message)
        } else {
          data.items = response.data.data.items
          console.log(data.items)
        }
      }
    }
  }

  onMount(async () => {
    data.loading = true
    await data.methods.fetchSpotPrices()
    data.loading = false
  })
</script>

<h5 class="fs-5 fw-bold">Spot Prices</h5>

<div class="table-responsive">
  <table class="table table-striped">
    <thead>
      <tr>
        <th scope="col">Rank</th>
        <th scope="col">Cryptocurrency</th>
        <th scope="col">Symbol</th>
        <th scope="col">Price</th>
      </tr>
    </thead>
    {#if data.loading}
      <Loader />
    {:else}
    <tbody>
      {#each data.items as item}   
      <tr>
        <th scope="row">{item.rank}</th>
        <td><img src={item.logo_url} alt="" class="rounded-circle me-2" style="width: 30px; height:30px;" /> {item.contract_name}</td>
        <td>{item.contract_ticker_symbol}</td>
        <td>${item.quote_rate}</td>
      </tr>
      {/each}
    </tbody>
    {/if}
  </table>
</div>