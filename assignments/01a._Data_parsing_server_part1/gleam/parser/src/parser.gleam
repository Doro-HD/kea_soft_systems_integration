import gleam/io

import parsers/csv_parser
import parsers/json_parser
import parsers/txt_parser
import parsers/xml_parser
import parsers/yaml_parser

pub fn main() {
  let programming_lang = txt_parser.parse()
  io.debug(programming_lang)

  let book = csv_parser.parse()
  io.debug(book)

  let video_game = json_parser.parse()
  let _ = io.debug(video_game)

  let guinea_pig = xml_parser.parse()
  let _ = io.debug(guinea_pig)

  let js_framework = yaml_parser.parse()
  io.debug(js_framework)
}
