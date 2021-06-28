import axios from "axios"
import { token } from "/src/store"
import { Response } from "./Response"

let authToken
token.subscribe((token) => {
  authToken = token
})

export class Request {
  constructor() {
    const request = axios.create({
      // baseURL: "https://tornad.herokuapp.com/",
      baseURL: "http://localhost:5000/",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${authToken}`,
      },
    })

    // request.interceptors.response.use(async (response) => {
    //   try {
    //     return response
    //   } catch (err) {
    //     if (err.response.status == 401) {
    //       return Response.redirect("/logout")
    //     }
    //     return Promise.reject(err)
    //   }
    // })

    Object.assign(this, request)
  }

  static ensureAuth() {
    if (!authToken) {
      Response.redirect("/login")
    }
  }

  static ensureGuest() {
    if (authToken) {
      Response.redirect("/")
    }
  }
}
