import { Request } from "$lib/helpers/Request"

const request = new Request()

export class TransactionAction {
  async getChainTransactions(chain) {
    try {
      const response = await request.get(`/transactions?chain=${chain}`)
      return response.data
    } catch (e) {
      return e.data
    }
  }

  async getTransaction(hash, chain) {
    try {
      const response = await request.get(`/transactions/${hash}?chain=${chain}`)
      return response.data
    } catch (e) {
      return e.data
    }
  }

  async sendTransaction(data, chain) {
    console.log(data)
    try {
      const response = await request.post(`/transfer?chain=${chain}`, data)
      return response.data
    } catch (e) {
      return e.data
    }
  }
}
