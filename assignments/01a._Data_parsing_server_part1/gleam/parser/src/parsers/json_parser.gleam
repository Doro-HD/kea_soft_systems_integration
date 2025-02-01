import gleam/dynamic/decode
import gleam/json
import gleam/result

pub opaque type VideoGame {
  VideoGame(
    name: String,
    developed_by: String,
    published_by: String,
    platform: String,
    released: String,
    genre: String,
  )
}

import simplifile

pub fn parse() {
  let file_result = simplifile.read("./files/video_game.json")
  case file_result {
    Ok(json_text) ->
      json.parse(json_text, get_video_game_decoder())
      |> result.map_error(fn(_) { "Could not parse text file as json" })
    _ -> Error("File reading error")
  }
}

fn get_video_game_decoder() {
  use name <- decode.field("Name", decode.string)
  use devloped_by <- decode.field("Developed by", decode.string)
  use published_by <- decode.field("Published by", decode.string)
  use platform <- decode.field("Platform", decode.string)
  use released <- decode.field("Released", decode.string)
  use genre <- decode.field("Genre", decode.string)

  decode.success(VideoGame(
    name,
    devloped_by,
    published_by,
    platform,
    released,
    genre,
  ))
}
