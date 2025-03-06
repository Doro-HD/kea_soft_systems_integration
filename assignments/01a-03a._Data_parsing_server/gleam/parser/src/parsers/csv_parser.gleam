import gleam/option.{type Option, None, Some}
import gleam/string

import simplifile

pub type Book {
  Book(name: String, author: String, year: String, publisher: String)
}

pub fn parse() -> Option(Book) {
  let file_result = simplifile.read("./files/book.csv")
  let lines = case file_result {
    Ok(file) -> string.split(file, "\n")
    _ -> []
  }

  let first_line_vals = case lines {
    [_, first_line, ..] -> string.split(first_line, ",")
    _ -> []
  }

  case first_line_vals {
    [name, author, year, publisher] -> Some(Book(name, author, year, publisher))
    _ -> None
  }
}
