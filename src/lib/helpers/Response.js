import { browser } from "$app/env"

export class Response {
  static redirect(url) {
    if (browser) {
      window.location = url
      return
    }
  }
}
