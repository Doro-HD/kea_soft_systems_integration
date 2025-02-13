import gleam/list
import gleam/option.{type Option, None, Some}
import gleam/string

import simplifile

pub type Lang {
  Lang(
    name: String,
    paradigm: String,
    is_statically_typed: Bool,
    creator: String,
  )
}

pub fn parse() {
  let file_result = simplifile.read("./files/programming_lang.txt")
  let lines = case file_result {
    Ok(file) ->
      string.split(file, "\n")
      |> list.filter(fn(value) { !string.is_empty(value) })
      |> list.map(fn(val) { string.split(val, "=") |> list.window_by_2() })
      |> list.flatten()
    _ -> []
  }

  build_lang(lines)
}

fn build_lang(key_value_pairs: List(#(String, String))) -> Option(Lang) {
  case key_value_pairs {
    [
      #("name", name),
      #("paradigm", paradigm),
      #("is-statically-typed", is_statically_typed_text),
      #("creator", creator),
    ] -> {
      let is_statically_typed_option = case is_statically_typed_text {
        "True" -> Some(True)
        "False" -> Some(False)
        _ -> None
      }

      case is_statically_typed_option {
        Some(is_statically_typed) ->
          Some(Lang(name, paradigm, is_statically_typed, creator))
        _ -> None
      }
    }
    _ -> None
  }
}
