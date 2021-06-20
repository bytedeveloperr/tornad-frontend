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
  
  const walletAction = new WalletAction()
  const clipboard = new Clipboard()

  const data = {
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
      }
    }
  }
  
  onMount(async () => {
    data.loading = true
    
    if(browser) {
      const detailsModal = new bootstrap.Modal(document.getElementById('receiveModal'), { keyboard: true })
      const modalToggle = document.getElementById('receiveModal') 
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

    if (data.address) {
      data.qrSrc = await qrcode.toDataURL(`ethereum:${data.address}`)
    }
  })  
</script>

<div class="modal fade" id="receiveModal" data-bs-backdrop="static" data-bs-keyboard="true" aria-labelledby="receiveModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="receiveModalLabel">Send {$page.params.chain}</h5>
        <button type="button" class="btn-close" on:click={data.methods.goBack} aria-label="Close"></button>
      </div>
      <div class="modal-body text-break">
        {#if data.loading}
          <Loader />
        {:else}
          <div class="d-block mx-auto">
            <div class="form-gorup mb-3">
              <label for="" class="form-label">Select Asset</label>
              <select class="form-select" aria-label="Select Asset">
                <option selected>Select Asset</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
            <div class="form-group mb-3">
              <label for="amount" class="form-label me-3">Amount:</label>
              <input type="number" id="amount" class="form-control" placeholder="Amount to send" />
            </div>
            <div class="form-group mb-3">
              <label for="recipient" class="form-label me-3">Recipient Username:</label>
              <input type="text" id="recipient" class="form-control" placeholder="Enter recipient username" />
            </div>
            <div class="form-group mb-3">
              <label for="recipient" class="form-label me-3">Recipient Address:</label>
              <input type="text" id="recipient" class="form-control" placeholder="Enter recipient address" />
            </div>

            <div class="d-grid">
              <button class="btn btn-warning">Continue</button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>