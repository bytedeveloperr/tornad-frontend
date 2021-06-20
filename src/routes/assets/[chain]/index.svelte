<script>
  import { browser } from "$app/env";
  import { page } from "$app/stores";
  import { TransactionAction } from "$lib/actions/TransactionAction";
  import { WalletAction } from "$lib/actions/WalletAction";
  import Loader from "$lib/components/Loader.svelte";
  import { Toast } from "$lib/helpers/Toast";
  import { Util } from "$lib/helpers/Util";
  import { wallet } from "/src/store";
  import { onMount } from "svelte";

  const walletAction = new WalletAction()
  const transactionAction = new TransactionAction()

  const data = {
    address: $wallet.address,
    balance: { loading: false },
    transactions: { loading: false, items: [] },
    methods: {
      async fetchAssetBalance(chain){
        const response = await walletAction.getChainBalance(chain)
        if(response.error) {
          Toast.error(response.message)
        } else {
          data.address = response.data.address
          data.balance = response.data.items[0]
        }
      },

      async fetchAssetTransactions(chain){
        const response = await transactionAction.getChainTransactions(chain)
        if(response.error) {
          Toast.error(response.message)
        } else {
          data.transactions.items = response.data.items
        }
      },
    }
  }

  onMount(async () => {
    data.balance.loading = true
    data.transactions.loading = true

    if(browser) {
      const detailsModal = new bootstrap.Modal(document.getElementById('assetDetailsModal'), { keyboard: true })
      const modalToggle = document.getElementById('assetDetailsModal') 
      detailsModal.show(modalToggle)
  
      data.methods.goBack = () => {
        return window.history.back()
      }
      
      window.onpopstate = () => {
        detailsModal.hide()
      }
    }

    if ($wallet.items?.length < 1) {
      await data.methods.fetchAssetBalance($page.params.chain)
    } else {
      data.address = $wallet.address
      const balance = $wallet.items?.find(item => item.items[0]?.contract_ticker_symbol.toLowerCase() === $page.params.chain.toLowerCase())
      if (!balance) {
        await data.methods.fetchAssetBalance($page.params.chain)
      } else {
        data.balance = balance.items[0]
      }
    }
    data.balance.loading = false
    await data.methods.fetchAssetTransactions($page.params.chain)
    data.transactions.loading = false
  })
  
</script>

<div class="modal fade" id="assetDetailsModal" data-bs-backdrop="static" data-bs-keyboard="true" aria-labelledby="assetDetailsModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="assetDetailsModalLabel">{data.balance?.contract_ticker_symbol}</h5>
        <button type="button" class="btn-close" on:click={data.methods.goBack} aria-label="Close"></button>
      </div>
      <div class="modal-body">
        {#if data.balance.loading}
          <Loader />
        {:else}
        <img src={data.balance?.logo_url || '/images/no-image.jpg'} style="height: 45px; width: 45px;" alt="" class="rounded-circle mx-auto d-block">
        <h1 class="fs-1 text-center mt-2">{Util.formatToDecimal(data.balance.balance, data.balance.contract_decimals)} <small class="fs-6">{data.balance?.contract_ticker_symbol}</small></h1>
        {/if}

        <div class="d-block mt-4 mx-auto">
            <a href="/assets/{$page.params.chain}/send" class="btn btn-sm me-3 btn-success"><i class="lnr lnr-upload"></i> Send</a>
            <a href="/assets/{$page.params.chain}/receive" class="btn btn-sm btn-warning"><i class="lnr lnr-download"></i> Receive</a>
        </div>

        <br />
        <h4 class="fs-5 mb-3">Transactions</h4>

        {#if data.transactions.loading}
          <Loader />
        {:else}
        {#if data.transactions.items?.length < 1}
          <p class="text-center">No transactions yet</p>
        {:else}
        <div class="list-group text-truncate" style="border-radius:0;">
          {#each data.transactions.items as transaction}
            <a href="#/" class="list-group-item mb-2 border border-{transaction.successful ? 'success' : 'danger'} border-3 border-end-0 border-top-0 border-bottom-0" style="background-color: rgba(255, 255, 255, 0.05);" aria-current="true">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">{transaction.to_address === data.address ? "Received" : "Sent"}</h5>
                <span class="fs-4 fw-bold">{Util.formatToDecimal(transaction.value, data.balance.contract_decimals)} <small class="fs-6">{data.balance?.contract_ticker_symbol}</small></span>
              </div>
              <p class="mb-1 fw-light">{transaction.to_address === data.address ? `From: ${transaction.from_address}` : `To: ${transaction.to_address}`}</p>
            </a>
          {/each}
        </div>
        {/if}
        {/if}
      </div>
    </div>
  </div>
</div>

