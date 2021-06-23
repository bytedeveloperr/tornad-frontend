import { token } from "/src/store"
import axios from "axios"
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
