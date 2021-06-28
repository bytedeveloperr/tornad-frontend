<script>
    import { WalletAction } from "$lib/actions/WalletAction";
    import { onMount } from "svelte";
    import { Toast } from "$lib/helpers/Toast";
    import { Util } from "$lib/helpers/Util";
    import Loader from "$lib/components/Loader.svelte";
    import { wallet } from "/src/store";
    import { BrowserStorage } from "$lib/helpers/BrowserStorage";
    import { Request } from "$lib/helpers/Request";
    import { ContactAction } from "$lib/actions/ContactAction";
    
    Request.ensureAuth()


    const contactAction = new ContactAction()
    const walletAction = new WalletAction()
    const storage = new BrowserStorage('localStorage')

    const data = {
        balance: {
            loading: false,
            items: []
        },
        contact: {
            loading: false,
            items: []
        },
        methods: {
            async getWalletBalance() {
                data.balance.loading = true
                const response = await walletAction.getWalletBalance()
                if (response.error) {
                    Toast.error(response.message)
                } else {
                    const walletData = {
                        address: response.data[0].address, 
                        items: response.data
                    }
                    data.balance.items = response.data || []
                    wallet.set(walletData)
                    storage.set('wallet', JSON.stringify(walletData))
                }
                data.balance.loading = false
            },

            // async getChartData(ticker){
            //     const request = new Request()
            //     const response = await request.get(`https://api.covalenthq.com/v1/pricing/historical/USD/${ticker}/?key=ckey_5cb85ded97a049bf941b70fbac1&from=2021-01-01`)
            //     if (response.error) {
            //         Toast.error(response.message)
            //     } else {
            //         data.chart = {
            //             title: response.data.data.contract_name,
            //             prices: response.data.data.prices.map((p) => p.price),
            //             dates: response.data.data.prices.map((p) => p.date),
            //         }
            //     } 
            // },

            async fetchContacts(){
                const response = await contactAction.fetchContacts()
                console.log(response)
                if(response.error) {
                    Toast.error(response.message)
                } else {
                    data.contact.items = response.data
                }
            },
        }
    }
    
    onMount(async () => {
        data.balance.loading = true
        data.contact.loading = true
        if ($wallet.items?.length < 1) {
            await data.methods.getWalletBalance()
        } else {
            data.balance.items = $wallet.items
        }
        data.balance.loading = false

        await data.methods.fetchContacts()
        data.contact.loading = false
    })    
</script>

<svelte:head>
	<title>Tornad | Dashboard</title>
</svelte:head>

<section class="row">
    <div class="d-flex justify-content-between">
        <h5 class="fw-bold fs-5">Assets</h5>
        <button class="btn" style="background-color: #121326;" on:click={data.methods.getWalletBalance}><i class="lnr lnr-sync"></i></button>
    </div>
    {#if data.balance.loading}
        <Loader />
    {:else} 
        {#each data.balance.items as balance}    
        <div class="col-md-6 col-lg-3 mb-3">
            <div class="card shadow-sm" style="border-radius:0; background-color: rgba(255, 255, 255, 0.05);">
                <div class="card-body">
                    <div class="h4 fs-3">{balance.items[0].contract_ticker_symbol}</div>
                    <h5 class="fw-light">{Util.formatToDecimal(balance.items[0].balance, balance.items[0].contract_decimals)}</h5>

                    <div class="d-flex justify-content-between mt-4">
                        <a href="/assets/{balance.items[0].contract_ticker_symbol}/send" class="btn btn-sm btn-success"><i class="lnr lnr-upload"></i> Send</a>
                        <a href="/assets/{balance.items[0].contract_ticker_symbol}/receive" class="btn btn-sm btn-warning"><i class="lnr lnr-download"></i> Receive</a>
                        <a href="/assets/{balance.items[0].contract_ticker_symbol}" class="btn btn-sm" style="background-color: #121326"><i class="lnr lnr-plus-circle"></i> Details</a>
                    </div>
                </div>
            </div>
        </div>
        {/each}
    {/if}
</section>

<hr class="text-white bg-white" />

<!-- <div class="card" style="width: 100%;">
    <div class="card-body">
        <canvas id="chartArea" style="height: 300px;"></canvas>
    </div>
</div> -->

<div class="row">
    {#if data.contact.loading}
        <Loader />
    {:else} 
    <div class="d-flex justify-content-between">
        <h5 class="mb-3 fs-5 fw-bold">Contacts</h5>
        <a href="/contacts/new" class="text-white text-decoration-none"><i class="lnr lnr-plus-circle"></i></a>
    </div>
    {#if data.contact.items.length < 1}
        <p class="text-center text-muted">You do not have any contact yet. click the <i class="lnr lnr-plus-circle small"></i> icon above to add a new contact</p>
    {:else}
    {#each data.contact.items as contact}   
    <div class="col-lg-6">
        <div class="card mb-3 shadow-sm" style="border-radius:0; background-color: rgba(255, 255, 255, 0.05);">
            <div class="card-body">
                <div class="d-flex justify-content-between mt-2">
                    <h5 class="fs-5 fw-bold">{contact.name || ''}</h5>
                    <a href="/contacts/{contact._id}" class="text-white text-decoration-none" style="/**background-color: #121326;*/">view</a>
                </div>
                <p class="text-muted">{contact.addresses[0].address}</p>
            </div>
        </div>
    </div>
    {/each}
    {/if}
    {/if}
</div>


<!-- 



        // await data.methods.getChartData("ETH")
        // if (browser) {
        // Chart.defaults.backgroundColor = "#fff"
        // Chart.defaults.color = "#fff"

        // const ctx = document.querySelector("#chartArea").getContext('2d')

        // var gradient = ctx.createLinearGradient(0, 100, 0, 10);
        // gradient.addColorStop(0, "#121326");
        // gradient.addColorStop(1, "#fff");

        // new Chart(ctx, {
        //   type: "line",
        //   data: {
        //     labels: data.chart.dates,
        //     datasets: [
        //       {
        //         label: "$",
        //         data: data.chart.prices,
        //         borderColor: "#414591",
        //         backgroundColor: gradient,
        //         fill: true,
        //         borderJoinStyle: "round",
        //         borderCapStyle: "round",
        //         borderWidth: 1.5,
        //         pointRadius: 0,
        //         pointHitRadius: 10,
        //         lineTension: 0.2,
        //       },
        //     ],
        //   },
        //   options: {
        //     responsive: true,
        //     maintainAspectRatio: false,
        //     plugins: {
        //       title: {
        //         display: true,
        //         text: data.chart.title,
        //       },
        //     },
        //     legend:{
        //         display: false,
        //         position:"bottom"
        //     },
        //     scales: {
        //       x: {
        //         display: false,
        //       },
        //       y: {
        //         display: false,
        //       },
        //     },
        //   }})
        // }
 -->