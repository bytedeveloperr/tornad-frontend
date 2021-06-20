import { browser } from "$app/env"

export class BrowserStorage {
  constructor(driver) {
    if (browser) {
      this.driver = driver
    } else {
      this.driver = null
    }
  }

  set(key, value) {
    if (typeof value === "object") {
      value = JSON.stringify(value)
    }

    if (this.driver === "localStorage") {
      return localStorage.setItem(key, value)
    } else if (this.driver === "sessionStorage") {
      return sessionStorage.setItem(key, value)
    }
  }

  get(key) {
    if (this.driver === "localStorage") {
      return localStorage.getItem(key)
    } else if (this.driver === "sessionStorage") {
      return sessionStorage.getItem(key)
    }
  }

  remove(key) {
    if (this.driver === "localStorage") {
      return localStorage.removeItem(key)
    } else if (this.driver === "sessionStorage") {
      return sessionStorage.removeItem(key)
    }
  }

  clear() {
    if (this.driver === "localStorage") {
      return localStorage.clear()
    } else if (this.driver === "sessionStorage") {
      return sessionStorage.clear()
    }
  }
}
