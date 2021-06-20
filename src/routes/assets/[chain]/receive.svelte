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
        <h5 class="modal-title" id="receiveModalLabel">Receive {$page.params.chain}</h5>
        <button type="button" class="btn-close" on:click={data.methods.goBack} aria-label="Close"></button>
      </div>
      <div class="modal-body text-break">
        {#if data.loading}
          <Loader />
        {:else}
          <div class="d-block mx-auto">
            <label for="amount" class="float-left mt-2 form-label me-3">Set Amount:</label>
            <input type="number" id="amount" class="form-control form-control-sm" placeholder="Set amount to receive" bind:value={data.amount} on:input={async () =>  data.qrSrc = await qrcode.toDataURL(`ethereum:${data.address}?amount=${data.amount}`)}/>
            <hr class="mb-3" />

            <p class="text-center fw-light">Scan the QR Code below {data.amount ? `to receive ${data.amount} ${$page.params.chain}`: ''}</p>
            <img src={data.qrSrc} alt="" class="d-block mx-auto">
          </div>
          <h2 class="fs-2 my-3 text-center">OR</h2>
          <p class="fw-light text-center">Send your {$page.params.chain} to the address below</p>
          <div class="input-group my-3">
            <input type="text" class="form-control form-control-sm text-center" id="address" readonly bind:value={data.address} />
            <button class="btn copy btn-sm" on:click={data.methods.copyAddress()} style="background-color: #121326;"><i class="lnr lnr-select"></i></button>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

