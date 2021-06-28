<script>
  import { browser } from "$app/env";
  import { page } from "$app/stores";
  import { ContactAction } from "$lib/actions/ContactAction";
  import Loader from "$lib/components/Loader.svelte";
  import { Toast } from "$lib/helpers/Toast";
  import { onMount } from "svelte";
  import { wallet } from "/src/store";
  import { Clipboard } from "$lib/helpers/Clipboard"
  import { TransactionAction } from "$lib/actions/TransactionAction";
  import { Request } from "$lib/helpers/Request";
    
  Request.ensureAuth()

  const contactAction = new ContactAction()
  const clipboard = new Clipboard()

  const data = {
    input:{},
    contact: {},
    chain: 'FTM',
    methods: {
      copyAddress() { 
        if (browser){
          clipboard.copy(document.querySelector("#address"))
           Toast.success("Address copied") 
           return
        }
      },

      async fetchContact(){
        const response = await contactAction.fetchContact($page.params.id)
        if(response.error) {
          Toast.error(response.message)
        } else {
          data.contact = response.data
        }
      },

      async sendTransaction() {
        if (confirm(`Are you sure to send ${data.input.amount} ${data.chain} to ${data.input.receiverAddress}?`)) {
          const response = await transactonAction.sendTransaction(data.input, data.chain)
          if(response.error) {
            Toast.error(response.message)
          } else {
            Toast.success(response.message)
          }
        } else {
          return
        }
      }
    }
  }
  
  onMount(async () => {
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

    await data.methods.fetchContact()
    if (data.contact.addresses != undefined) {
      data.input.receiverAddress = data.contact.addresses[0].address
    }
  })  
</script>

<svelte:head>
	<title>Tornad | Send {data.chain}</title>
</svelte:head>

<div class="modal fade" id="sendModal" data-bs-backdrop="static" data-bs-keyboard="true" aria-labelledby="sendModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="sendModalLabel">Send {data.chain}</h5>
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
                <option value="BSC">BSC</option>
                <option value="AVAX">AVAX</option>
              </select>
            </div>
            <div class="form-group mb-3">
              <label for="amount" class="form-label me-3">Amount:</label>
              <input type="number" id="amount" class="form-control" placeholder="Amount to send" bind:value={data.input.amount} />
            </div>
            <div class="form-group mb-3">
              <label for="address" class="form-label me-3">Address:</label>
              <input type="text" id="address" class="form-control" placeholder="Enter recipient address" bind:value={data.input.receiverAddress} />
            </div>
            <div class="d-grid">
              <button class="btn btn-warning" on:click={data.methods.sendTransaction}>Send</button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>