import { Request } from "$lib/helpers/Request"

const request = new Request()

export class AuthAction {
  async loginUser(data) {
    try {
      console.log(data)
      const response = await request.post("/auth/login", data)
      return response.data
    } catch (e) {
      return e.response.data
    }
  }

  async registerUser(data) {
    try {
      const response = await request.post("/auth/register", data)
      return response.data
    } catch (e) {
      return e.response.data
    }
  }
}
