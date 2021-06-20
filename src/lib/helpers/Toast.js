import { toast } from "@zerodevx/svelte-toast"

export class Toast {
  static success(message) {
    return toast.push(message, {
      theme: {
        "--toastBackground": "#48BB78",
        "--toastProgressBackground": "#2F855A",
      },
    })
  }

  static error(message) {
    return toast.push(message, {
      theme: {
        "--toastBackground": "#F56565",
        "--toastProgressBackground": "#C53030",
      },
    })
  }
}
