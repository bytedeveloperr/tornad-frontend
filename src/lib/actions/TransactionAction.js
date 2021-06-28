import { Request } from "$lib/helpers/Request"
import { Response } from "$lib/helpers/Response"

const request = new Request()

export class TransactionAction {
  async getChainTransactions(chain) {
    try {
      const response = await request.get(`/transactions?chain=${chain}`)
      return response.data
    } catch (e) {
      if (e.response.status == 401) {
        return Response.redirect("/logout")
      }
      returne.response.data
    }
  }

  async getTransaction(hash, chain) {
    try {
      const response = await request.get(`/transactions/${hash}?chain=${chain}`)
      return response.data
    } catch (e) {
      if (e.response.status == 401) {
        return Response.redirect("/logout")
      }
      returne.response.data
    }
  }

  async sendTransaction(data, chain) {
    try {
      const response = await request.post(`/transfer?chain=${chain}`, data)
      return response.data
    } catch (e) {
      if (e.response.status == 401) {
        return Response.redirect("/logout")
      }
      returne.response.data
    }
  }
}
