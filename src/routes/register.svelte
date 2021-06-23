<script>
    import { AuthAction } from "$lib/actions/AuthAction";
    import { Toast } from "$lib/helpers/Toast";
    import { BrowserStorage } from "$lib/helpers/BrowserStorage"
    import { token } from "/src/store";
    import { Response } from "$lib/helpers/Response";
    import { Request } from "$lib/helpers/Request";

    Request.ensureGuest()

    const authAction = new AuthAction()

    const data = {
      input:{
        username: '',
        password: '',
      },
      methods:{
        async registerUser() {
            const response = await authAction.registerUser(data.input)
            if (response.error) {
                Toast.error(response.message)
            } else {
                const storage = new BrowserStorage('localStorage')
                storage.set("token", response.data.token)
                token.set(response.data.token)
                Toast.success(response.message)
                return Response.redirect(new URL(`${window.location.protocol}//${window.location.hostname}:${window.location.port}`).toString())
            }
        }
      }
    }
</script>

<br />
<br />
<br />
<br />
<br />
<br />

<div class="row">
    <div class="col-md-6 col-lg-4 mx-auto">
        <div class="p-3">
            <h3 class="text-center fs-3 fw-light mb-3">Create an account</h3>
            <div class="mb-3">
                <label for="username" class="fw-bold form-label">Username</label>
                <input type="text" class="form-control" id="username" bind:value={data.input.username} required />
            </div>
            <div class="mb-3">
                <label for="password" class="fw-bold form-label">Password</label>
                <input type="password" class="form-control" id="password" bind:value={data.input.password} required />
            </div>
            <div class="d-grid">
                <button type="submit" class="btn btn-primary" on:click={data.methods.registerUser}>Create account</button>
            </div>
            <p class="mt-3 small">Already have an account? <a href="/login" class="text-decoration-none">Login</a></p>
        </div>
    </div>
</div>