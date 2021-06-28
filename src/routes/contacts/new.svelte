<script>
  import { browser } from "$app/env";
  import { ContactAction } from "$lib/actions/ContactAction";
  import { Toast } from "$lib/helpers/Toast";
  import { onMount } from "svelte";
  import { Request } from "$lib/helpers/Request";
  import { Response } from "$lib/helpers/Response";
    
  Request.ensureAuth()

  const contactAction = new ContactAction()

  const data = {
    input:{
      name: '',
      type: '',
      address: ''
    },
    methods: {
      async createContact(){
        const response = await contactAction.createContact(data.input)
        if(response.error) {
          Toast.error(response.message)
        } else {
          Response.redirect(`/contacts/${response.data._id}`)
        }
      },
    }
  }

  onMount(async () => {
    if(browser) {
      const detailsModal = new bootstrap.Modal(document.getElementById('newContactModal'), { keyboard: true })
      const modalToggle = document.getElementById('newContactModal') 
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

<div class="modal fade" id="newContactModal" data-bs-backdrop="static" data-bs-keyboard="true" aria-labelledby="newContactModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="newContactModalLabel">New Contact</h5>
        <button type="button" class="btn-close" on:click={data.methods.goBack} aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
          <label for="name" class="form-label">Contact Name</label>
          <input type="text" class="form-control" id="name" bind:value={data.input.name}/>
        </div>
        <div class="mb-3">
          <label for="address" class="form-label">Address</label>
          <input type="text" class="form-control" id="address" bind:value={data.input.address} />
        </div>
        <!-- <div class="mb-3">
          <label for="type" class="form-label">Address Type</label>
          <input type="text" class="form-control" id="type" bind:value={data.input.type} />
        </div> -->
        <button class="btn btn-warning" on:click={data.methods.createContact}>Create</button>
      </div>
    </div>
  </div>
</div>

