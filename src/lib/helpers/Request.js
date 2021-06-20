import { token } from "/src/store"
import axios from "axios"

let authToken
token.subscribe((token) => {
  authToken = token
})

export class Request {
  constructor() {
    const request = axios.create({
      baseURL: "https://tornad.herokuapp.com/",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${authToken}`,
      },
    })

    Object.assign(this, request)
  }
}
