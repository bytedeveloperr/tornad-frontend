import { token } from "/src/store"
import axios from "axios"

let authToken
token.subscribe((token) => {
  authToken = token
})

export class Request {
  constructor() {
    const request = axios.create({
      baseURL: "http://localhost:5000/",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${authToken}`,
      },
    })

    Object.assign(this, request)
  }
}
