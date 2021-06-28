import { Request } from "$lib/helpers/Request"
import { Response } from "$lib/helpers/Response"

const request = new Request()

export class UserAction {
  async updateUser(data) {
    try {
      const response = await request.put(`/user`, data)
      return response.data
    } catch (e) {
      if (e.response.status == 401) {
        return Response.redirect("/logout")
      }
      return e.response.data
    }
  }

  async updatePassword(data) {
    try {
      const response = await request.put(`/user/password`, data)
      return response.data
    } catch (e) {
      if (e.response.status == 401) {
        return Response.redirect("/logout")
      }
      return e.response.data
    }
  }

  async getUser() {
    try {
      const response = await request.get(`/user`)
      return response.data
    } catch (e) {
      if (e.response.status == 401) {
        return Response.redirect("/logout")
      }
      return e.response.data
    }
  }
}
