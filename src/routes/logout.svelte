<script>
  import { BrowserStorage } from "$lib/helpers/BrowserStorage";
  import { Response } from "$lib/helpers/Response";

  const storage = new BrowserStorage("localStorage")
  storage.clear()
  Response.redirect('/login')
</script>