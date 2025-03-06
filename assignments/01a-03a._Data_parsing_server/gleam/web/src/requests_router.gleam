import gleam/hackney
import gleam/http/request
import gleam/result
import gleam/string_tree

import wisp.{type Response}

pub fn handler(path: List(String)) -> Response {
  case path {
    ["txt"] -> request_txt()
    ["csv"] -> request_csv()
    ["json"] -> request_json()
    ["xml"] -> request_xml()
    ["yaml"] -> request_yaml()
    _ -> wisp.not_found()
  }
}

fn send_request(path: String) -> Response {
  let response_result = case request.to("http://127.0.0.1:8000/" <> path) {
    Ok(req) ->
      hackney.send(req) |> result.map_error(fn(_) { "Could not send request" })
    _ -> Error("Could not construct request")
  }

  case response_result {
    Ok(value) ->
      wisp.ok() |> wisp.json_body(value.body |> string_tree.from_string())
    _ -> wisp.internal_server_error()
  }
}

fn request_txt() -> Response {
  send_request("txt")
}

fn request_csv() -> Response {
  send_request("csv")
}

fn request_json() -> Response {
  send_request("json")
}

fn request_xml() -> Response {
  send_request("xml")
}

fn request_yaml() -> Response {
  send_request("yaml")
}
