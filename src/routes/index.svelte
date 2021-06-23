<script>
    import { WalletAction } from "$lib/actions/WalletAction";
    import { onMount } from "svelte";
    import { Toast } from "$lib/helpers/Toast";
    import { Util } from "$lib/helpers/Util";
    import Loader from "$lib/components/Loader.svelte";
    import { wallet } from "/src/store";
    import { BrowserStorage } from "$lib/helpers/BrowserStorage";
    import { Request } from "$lib/helpers/Request";
    
    Request.ensureAuth()
    
    const walletAction = new WalletAction()
    const storage = new BrowserStorage('localStorage')

    const data = {
        balances: {
            loading: false,
            items: []
        },

        methods: {
            async getWalletBalance() {
                data.balances.loading = true
                const response = await walletAction.getWalletBalance()
                if (response.error) {
                    Toast.error(response.message)
                } else {
                    const walletData = {
                        address: response.data[0].address, 
                        items: response.data
                    }
                    data.balances.items = response.data || []
                    wallet.set(walletData)
                    storage.set('wallet', JSON.stringify(walletData))
                }
                data.balances.loading = false
            }
        }
    }

    
    onMount(async () => {
        if ($wallet.items?.length < 1) {
            console.log("no")
            await data.methods.getWalletBalance()
        } else {
            data.balances.items = $wallet.items
        }
    })
</script>

<section class="row">
    <div class="d-flex justify-content-between">
        <h4 class="fw-bold-4">Your Assets</h4>
        <button class="btn" style="background-color: #121326;" on:click={data.methods.getWalletBalance}><i class="lnr lnr-sync"></i></button>
    </div>
    {#if data.balances.loading}
        <Loader />
    {:else} 
        {#each data.balances.items as balance}    
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

<div class="row">
    <div class="col-lg-6">
        <h5 class="mb-3">Transactions</h5>
        <div class="list-group text-truncate" style="border-radius:0;">
          <a href="#/" class="list-group-item mb-2 border border-success border-3 border-end-0 border-top-0 border-bottom-0" style="background-color: rgba(255, 255, 255, 0.05);" aria-current="true">
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">Receive</h5>
              <span class="fs-4 fw-bold">3.095 ETH</span>
            </div>
            <p class="mb-1 fw-light">from: 0x4d6bb4ed029b33cf25d0810b029bd8b1a6bcab7b</p>
          </a>
          <a href="#/" class="list-group-item mb-2 border border-danger border-3 border-end-0 border-top-0 border-bottom-0" style="background-color: rgba(255, 255, 255, 0.05);" aria-current="true">
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">Sent</h5>
              <span class="fs-4 fw-bold">0.05 ETH</span>
            </div>
            <p class="mb-1 fw-light">from: 0x4d6bb4ed029b33cf25d0810b029bd8b1a6bcab7b</p>
          </a>
          <a href="#/" class="list-group-item mb-2 border border-success border-3 border-end-0 border-top-0 border-bottom-0" style="background-color: rgba(255, 255, 255, 0.05);" aria-current="true">
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">Sent</h5>
              <span class="fs-4 fw-bold">0.095 ETH</span>
            </div>
            <p class="mb-1 fw-light">from: 0x4d6bb4ed029b33cf25d0810b029bd8b1a6bcab7b</p>
          </a>
        </div>
    </div>

    <div class="col-lg-6">
        <h5 class="mb-3">Your Contacts</h5>
        <div class="card mb-3 shadow-sm" style="border-radius:0; background-color: rgba(255, 255, 255, 0.05);">
            <div class="card-body">
                <div class="h4 fs-3">Contact Name</div>
                <p class="text-muted">0xC46793273fE67d30b165842F8B63855e2d02EF0b</p>
                <div class="d-flex mt-2">
                    <a href="/" class="btn btn-sm me-2 btn-success"><i class="fa fa-paper-plane"></i> Send</a>
                    <a href="/" class="btn btn-sm me-2" style="background-color: #121326"><i class="fa fa-info-circle"></i> Details</a>
                </div>
            </div>
        </div>

        <div class="card mb-3 shadow-sm" style="border-radius:0; background-color: rgba(255, 255, 255, 0.05);">
            <div class="card-body">
                <div class="h4 fs-3">Contact Name</div>
                <p class="text-muted">0xC46793273fE67d30b165842F8B63855e2d02EF0b</p>
                <div class="d-flex mt-2">
                    <a href="/" class="btn btn-sm me-2 btn-success"><i class="fa fa-paper-plane"></i> Send</a>
                    <a href="/" class="btn btn-sm me-2" style="background-color: #121326"><i class="fa fa-info-circle"></i> Details</a>
                </div>
            </div>
        </div>
    </div>
</div>