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
}
