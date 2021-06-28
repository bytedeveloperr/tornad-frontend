<script>
  import { browser } from "$app/env";
  import { page } from "$app/stores";
  import Loader from "$lib/components/Loader.svelte";
  import { Toast } from "$lib/helpers/Toast";
  import { Util } from "$lib/helpers/Util";
  import { wallet } from "/src/store";
  import { onMount } from "svelte";
  import { Request } from "$lib/helpers/Request";
  import { ContactAction } from "$lib/actions/ContactAction";
  import { Response } from "$lib/helpers/Response";
    
  Request.ensureAuth()

  const contactAction = new ContactAction()

  const data = {
    loading: false,
    noEdit: true,
    contact: {},
    methods: {
      async fetchContact(){
        const response = await contactAction.fetchContact($page.params.id)
        if(response.error) {
          Toast.error(response.message)
        } else {
          data.contact = response.data
        }
      },

      async deleteContact(){
        const response = await contactAction.deleteContact($page.params.id)
        if(response.error) {
          Toast.error(response.message)
        } else {
          Toast.success(response.message)
          Response.redirect('/')
        }
      },

      async updateContact(){
        const response = await contactAction.updateContact($page.params.id, { name: data.contact.name, address: data.contact.addresses[0]?.address })
        if(response.error) {
          Toast.error(response.message)
        } else {
          Toast.success(response.message)
          Response.redirect('/')
        }
      },
    }
  }

  onMount(async () => {
    data.loading = true
    await data.methods.fetchContact()
    data.loading =  false
    
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
  })
</script>

<svelte:head>
  <title>Tornad | Contact</title>
</svelte:head>

<div class="modal fade" id="assetDetailsModal" data-bs-backdrop="static" data-bs-keyboard="true" aria-labelledby="assetDetailsModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="assetDetailsModalLabel">{data.contact.name}</h5>
        <button type="button" class="btn-close" on:click={data.methods.goBack} aria-label="Close"></button>
      </div>
      <div class="modal-body">
        {#if data.loading}
        <Loader />
        {:else}
        <div class="d-flex justify-content-between mb-3">
            <a href="/contacts/{data.contact._id}/send" class="btn btn-sm me-3 btn-success"><i class="lnr lnr-upload"></i> Send</a> 
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="sendVia" bind:checked={data.noEdit}>
              <label class="form-check-label" for="sendVia">Edit mode</label>
            </div>
        </div>

        <div class="form">
          <div class="form-group mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" class="form-control" id="name" bind:value={data.contact.name} disabled={data.noEdit} />
          </div>
          {#if data.contact.addresses != undefined}
          <div class="form-group mb-3">
            <label for="address" class="form-label">Address</label>
            <input type="text" class="form-control" id="address" bind:value={data.contact.addresses[0].address} disabled={data.noEdit} />
          </div>
          {/if}
        </div>
        <div class="mt-3 d-flex">
          <button class="btn btn-sm me-2" on:click={data.methods.deleteContact}>Delete</button>
          <button class="btn btn-warning btn-sm" disabled={data.noEdit} on:click={data.methods.updateContact}>Update</button>
        </div>
        {/if}
      </div>
    </div>
  </div>
</div>

