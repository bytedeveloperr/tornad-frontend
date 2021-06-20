import { Request } from "$lib/helpers/Request"

const request = new Request()

export class WalletAction {
  async getWalletBalance() {
    try {
      const response = await request.get("/wallet/balances")
      return response.data
    } catch (e) {
      return e.data
    }
  }

  async getChainBalance(chain) {
    try {
      const response = await request.get(`/wallet/balances?chain=${chain}`)
      return response.data
    } catch (e) {
      return e.data
    }
  }
}
