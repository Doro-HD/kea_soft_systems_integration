import gleam/erlang/process

import mist
import wisp
import wisp/wisp_mist

import router

pub fn main() {
  let secret_key_base = wisp.random_string(64)
  let assert Ok(_) =
    wisp_mist.handler(router.handler, secret_key_base)
    |> mist.new()
    |> mist.port(8000)
    |> mist.start_http()

  process.sleep_forever()
}
