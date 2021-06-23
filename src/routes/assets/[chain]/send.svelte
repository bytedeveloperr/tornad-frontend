<script>
  import { browser } from "$app/env";
  import { page } from "$app/stores";
  import { WalletAction } from "$lib/actions/WalletAction";
  import Loader from "$lib/components/Loader.svelte";
  import { Toast } from "$lib/helpers/Toast";
  import { onMount } from "svelte";
  import { wallet } from "/src/store";
  import { Clipboard } from "$lib/helpers/Clipboard"
  import { TransactionAction } from "$lib/actions/TransactionAction";
  import { Request } from "$lib/helpers/Request";
    
  Request.ensureAuth()

  const walletAction = new WalletAction()
  const transactonAction = new TransactionAction()
  const clipboard = new Clipboard()

  const data = {
    input:{},
    chain: $page.params.chain,
    viaUsername: true,
    address: $wallet.address,
    amount: '',
    loading: false,
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
      copyAddress() { 
        if (browser){
          clipboard.copy(document.querySelector("#address"))
           Toast.success("Address copied") 
           return
        }
      },
      async sendTransaction() {
        if (!data.viaUsername) {
          data.input.receiverUsername = undefined
        } else {
          data.input.receiverAddress = undefined
        }

        const response = await transactonAction.sendTransaction(data.input, data.chain)
        if(response.error) {
          Toast.error(response.message)
        } else {
          Toast.success(response.message)
        }
      }
    }
  }
  
  onMount(async () => {
    data.loading = true
    
    if(browser) {
      const detailsModal = new bootstrap.Modal(document.getElementById('sendModal'), { keyboard: true })
      const modalToggle = document.getElementById('sendModal') 
      detailsModal.show(modalToggle)
  
      data.methods.goBack = () => {
        return window.history.back()
      }
      
      window.onpopstate = () => {
        detailsModal.hide()
      }
    }

    if (!data.address) {
      await data.methods.fetchAssetBalance($page.params.chain)
    }
    data.loading = false
  })  
</script>

<div class="modal fade" id="sendModal" data-bs-backdrop="static" data-bs-keyboard="true" aria-labelledby="sendModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="sendModalLabel">Send {$page.params.chain}</h5>
        <button type="button" class="btn-close" on:click={data.methods.goBack} aria-label="Close"></button>
      </div>
      <div class="modal-body text-break">
        {#if data.loading}
          <Loader />
        {:else}
          <div class="d-block mx-auto">
            <div class="form-gorup mb-3">
              <label for="" class="form-label">Select Asset</label>
              <select class="form-select" aria-label="Select Asset" bind:value={data.chain}>
                <option selected>Select Asset</option>
                <option value="ETH">ETH</option>
                <option value="FTM">FTM</option>
                <option value="MATIC">MATIC</option>
                <option value="AVAX">AVAX</option>
              </select>
            </div>
            <div class="form-group mb-3">
              <label for="amount" class="form-label me-3">Amount:</label>
              <input type="number" id="amount" class="form-control" placeholder="Amount to send" bind:value={data.input.amount} />
            </div>
            <div class="form-check form-switch mb-3">
              <input class="form-check-input" type="checkbox" id="sendVia" bind:checked={data.viaUsername}>
              <label class="form-check-label" for="sendVia">Send via Username</label>
            </div>

            {#if data.viaUsername}   
              <div class="form-group mb-3">
                <input type="text" class="form-control" placeholder="Enter recipient username" bind:value={data.input.receiverUsername} />
              </div>
            {:else}
              <div class="form-group mb-3">
                <input type="text" class="form-control" placeholder="Enter recipient address" bind:value={data.input.receiverAddress} />
              </div>
            {/if}
            <div class="d-grid">
              <button class="btn btn-warning" on:click={data.methods.sendTransaction}>Continue</button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>