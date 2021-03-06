import { Request } from "$lib/helpers/Request"
import { Response } from "$lib/helpers/Response"

const request = new Request()

export class WalletAction {
  async getWalletBalance() {
    try {
      const response = await request.get("/wallet/balances")
      return response.data
    } catch (e) {
      if (e.response.status == 401) {
        return Response.redirect("/logout")
      }
      return e.response.data
    }
  }

  async getChainBalance(chain) {
    try {
      const response = await request.get(`/wallet/balances?chain=${chain}`)
      return response.data
    } catch (e) {
      if (e.response.status == 401) {
        return Response.redirect("/logout")
      }
      return e.response.data
    }
  }

  async exportKeystore(password) {
    try {
      const response = await request.post(`/wallet/keystore`, { password })
      return response.data
    } catch (e) {
      if (e.response.status == 401) {
        return Response.redirect("/logout")
      }
      return e.response.data
    }
  }
}
