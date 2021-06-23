<script>
  import { browser } from "$app/env";
  import { page } from "$app/stores";
  import { WalletAction } from "$lib/actions/WalletAction";
  import Loader from "$lib/components/Loader.svelte";
  import { Toast } from "$lib/helpers/Toast";
  import { onMount } from "svelte";
  import qrcode from "qrcode"
  import { wallet } from "/src/store";
  import { Clipboard } from "$lib/helpers/Clipboard"
  import { Request } from "$lib/helpers/Request";
import { TransactionAction } from "$lib/actions/TransactionAction";
import { Util } from "$lib/helpers/Util";
    
  Request.ensureAuth()

  const transactionAction = new TransactionAction()
  const clipboard = new Clipboard()

  const data = {
    address: $wallet.address,
    loading: false,
    tx: {},
    methods: {
      async fetchTransaction(hash, chain){
        const response = await transactionAction.getTransaction(hash, chain)
        if(response.error) {
          Toast.error(response.message)
        } else {
          data.tx = response.data.items[0]
          console.log(response.data)
        }
      }
    }
  }
  
  onMount(async () => {
    data.loading = true
    
    if(browser) {
      const detailsModal = new bootstrap.Modal(document.getElementById('txModal'), { keyboard: true })
      const modalToggle = document.getElementById('txModal') 
      detailsModal.show(modalToggle)
  
      data.methods.goBack = () => {
        return window.history.back()
      }
      
      window.onpopstate = () => {
        detailsModal.hide()
      }
    }

    await data.methods.fetchTransaction($page.params.hash, $page.params.chain)
    data.loading = false
  })  
</script>

<div class="modal fade" id="txModal" data-bs-backdrop="static" data-bs-keyboard="true" aria-labelledby="txModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="txModalLabel">{$page.params.chain} Transaction</h5>
        <button type="button" class="btn-close" on:click={data.methods.goBack} aria-label="Close"></button>
      </div>
      <div class="modal-body text-break">
        {#if data.loading}
          <Loader />
        {:else}
          <h3 class="fs-3 fw-bold text-center text-{ data.tx.from_address === data.address ? "danger" : "success" }">{data.tx.from_address === data.address ? "-" : "+" } {Util.formatToDecimal(data.tx.value)}</h3>
          
          <ul class="list-unstyled">
            {#if data.tx.from_address === data.address}
              <li class="py-2">To: {data.tx.to_address}</li>
              <hr class="p-0">
              {:else}
              <li class="py-2">From: {data.tx.from_address}</li>
              <hr class="p-0">
              {/if}
            <li class="py-2">Transaction Hash: {data.tx.tx_hash}</li>
            <hr class="p-0">
            <li class="py-2">Tranasction Date: {data.tx.block_signed_at}</li>
            <hr class="p-0">
            <li class="py-2">Status: {data.tx.successful}</li>
          </ul>
        {/if}
      </div>
    </div>
  </div>
</div>

