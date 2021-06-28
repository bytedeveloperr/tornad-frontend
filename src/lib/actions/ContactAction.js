import { Request } from "$lib/helpers/Request"
import { Response } from "$lib/helpers/Response"

const request = new Request()

export class ContactAction {
  async createContact(data) {
    try {
      const response = await request.post(`/contacts`, data)
      return response.data
    } catch (e) {
      if (e.response.status == 401) {
        return Response.redirect("/logout")
      }
      return e.response.data
    }
  }

  async fetchContacts() {
    try {
      const response = await request.get(`/contacts`)
      return response.data
    } catch (e) {
      if (e.response.status == 401) {
        return Response.redirect("/logout")
      }
      return e.response.data
    }
  }

  async fetchContact(id) {
    try {
      const response = await request.get(`/contacts/${id}`)
      return response.data
    } catch (e) {
      if (e.response.status == 401) {
        return Response.redirect("/logout")
      }
      return e.response.data
    }
  }

  async updateContact(id, data) {
    try {
      const response = await request.put(`/contacts/${id}`, data)
      return response.data
    } catch (e) {
      if (e.response.status == 401) {
        return Response.redirect("/logout")
      }
      return e.response.data
    }
  }

  async deleteContact(id) {
    try {
      const response = await request.delete(`/contacts/${id}`)
      return response.data
    } catch (e) {
      if (e.response.status == 401) {
        return Response.redirect("/logout")
      }
      return e.response.data
    }
  }
}
