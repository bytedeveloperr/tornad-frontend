import { BrowserStorage } from "$lib/helpers/BrowserStorage"
import { writable } from "svelte/store"

let existingWallet
const storage = new BrowserStorage("localStorage")
try {
  existingWallet = JSON.parse(storage.get("wallet"))
} catch (e) {}

export const token = writable(storage.get("token"))
export const wallet = writable(existingWallet || { address: "", items: [] })
