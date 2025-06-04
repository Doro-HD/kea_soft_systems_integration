import gleam/json
import gleam/option.{None, Some}
import gleam/string_tree

import wisp.{type Request, type Response}

import parsers/csv_parser
import parsers/json_parser
import parsers/txt_parser
import parsers/xml_parser
import parsers/yaml_parser
import requests_router

pub fn handler(req: Request) -> Response {
  case wisp.path_segments(req) {
    ["txt"] -> {
      wisp.ok() |> wisp.json_body(txt_body())
    }
    ["csv"] -> wisp.ok() |> wisp.json_body(csv_body())
    ["json"] -> wisp.ok() |> wisp.json_body(json_body())
    ["xml"] -> wisp.ok() |> wisp.json_body(xml_body())
    ["yaml"] -> wisp.ok() |> wisp.json_body(yaml_body())
    ["requests", ..rest] -> requests_router.handler(rest)
    _ -> wisp.not_found()
  }
}

fn json_error() {
  json.object([#("Error", json.string("Could not build object"))])
}

fn txt_body() {
  let json_lang = case txt_parser.parse() {
    Some(lang) ->
      json.object([
        #("Name", json.string(lang.name)),
        #("Creator", json.string(lang.creator)),
        #("Paradigm", json.string(lang.paradigm)),
        #("Is statically typed", json.bool(lang.is_statically_typed)),
      ])
    _ -> json_error()
  }

  json.to_string_tree(json_lang)
}

fn csv_body() {
  let json_book = case csv_parser.parse() {
    Some(book) ->
      json.object([
        #("Name", json.string(book.name)),
        #("Author", json.string(book.author)),
        #("Publisher", json.string(book.publisher)),
        #("Year", json.string(book.year)),
      ])
    _ -> json_error()
  }

  json.to_string_tree(json_book)
}

fn json_body() {
  let json_video_game = case json_parser.parse() {
    Ok(video_game) ->
      json.object([
        #("Name", json.string(video_game.name)),
        #("Developed by", json.string(video_game.developed_by)),
        #("Published by", json.string(video_game.published_by)),
        #("Released", json.string(video_game.released)),
        #("Genre", json.string(video_game.genre)),
      ])
    _ -> json_error()
  }

  json.to_string_tree(json_video_game)
}

fn xml_body() {
  let guinea_json_string = xml_parser.parse()
  string_tree.from_string(guinea_json_string)
}

fn yaml_body() {
  let js_framework_json = case yaml_parser.parse() {
    Some(js_framework) -> {
      json.object([
        #("Name", json.string(js_framework.name)),
        #("Author", json.string(js_framework.author)),
        #(
          "Contributors",
          json.object([
            #("Total", json.int(js_framework.total_contributors)),
            #(
              "Account names",
              json.array(js_framework.contributor_account_names, json.string),
            ),
          ]),
        ),
      ])
    }
    None ->
      json.object([#("Error", json.string("Could not retrive framework"))])
  }

  json.to_string_tree(js_framework_json)
}
