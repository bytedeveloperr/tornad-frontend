import { browser } from "$app/env"

export class Clipboard {
  copy(element) {
    if (browser) {
      element?.select()
      document.execCommand("copy")
    }
  }
}
