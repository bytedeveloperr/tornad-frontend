<script>
  import { browser } from "$app/env";
  import { UserAction } from "$lib/actions/UserAction";
  import { WalletAction } from "$lib/actions/WalletAction";
  import { Toast } from "$lib/helpers/Toast";
import { onMount } from "svelte";

  const walletAction = new WalletAction()
  const userAction = new UserAction()

  const data = {
    keystorePassword: '',
    details: {
      email: '',
      name: '',
      username: ''
    },
    password: {
      oldPassword: '',
      newPassword: ''
    },
    methods: {
      async exportKeystore() {
        const response = await walletAction.exportKeystore(data.keystorePassword)
        if(response.error) {
          Toast.error(response.message)
        } else {
          if (browser) {
            const blob = new Blob([JSON.stringify(response.data)],{
              type: "application/json;charset=utf-8"
            })
            saveAs(blob, "keystore.json");
          }
        }
      },

      async getUser() {
        const response = await userAction.getUser()
        if (response.error) {
          Toast.error(response.message)
        } else {
          data.details = response.data
        }
      },
      
      async updateUser() {
        const response = await userAction.updateUser(data.details)
        if (response.error) {
          Toast.error(response.message)
        } else {
          Toast.success(response.message)
        }
      },

      async updatePassword() {
        const response = await userAction.updatePassword(data.password)
        if (response.error) {
          Toast.error(response.message)
        } else {
          Toast.success(response.message)
        }
      },
    }
  }

  onMount(async () => {
    await data.methods.getUser()
  })
</script>

<svelte:head>
	<title>Tornad | Settings</title>
</svelte:head>

<div class="row">
  <div class="col-lg-6 mx-auto">
    <h5 class="fs-5 fw-bold">Personal Details</h5>
      <div class="mb-3">
        <label for="name" class="form-label">Name (optional)</label>
        <input type="text" class="form-control" id="name" bind:value={data.details.name} />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email address (optional)</label>
        <input type="email" class="form-control" id="email" bind:value={data.details.email} />
      </div>
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input type="text" class="form-control" id="username" bind:value={data.details.username} />
      </div>
      <button class="btn btn-warning" on:click={data.methods.updateUser}>Update</button>
    
    <hr />

    <h5 class="fs-5 fw-bold mt-3">Reset Password</h5>
    <section>
      <div class="mb-3">
        <label for="oldPassword" class="form-label">Old Password</label>
        <input type="password" class="form-control" id="oldPassword" bind:value={data.password.oldPassword} autocomplete="off"/>
      </div>
      <div class="mb-3">
        <label for="newPassword" class="form-label">New Password</label>
        <input type="text" class="form-control" id="newPassword" bind:value={data.password.newPassword} />
      </div>
      <button class="btn btn-warning" on:click={data.methods.updatePassword}>Update</button>
    </section>

    <hr />
    <h5 class="fs-5 fw-bold">Export Wallet keystore</h5>
    <div class="form-group">
      <label for="keystorePassword" class="form-label">Keystore password</label>
      <input type="password" id="keystorePassword" class="form-control" bind:value={data.keystorePassword} />
    </div>

    <button class="btn btn-warning mt-3" on:click={data.methods.exportKeystore}>Export</button>
  </div>
</div>