import simplifile

pub fn parse() -> Result(GuineaPig, String) {
  let file_result = simplifile.read("./files/guinea_pig.xml")
  case file_result {
    Ok(file) -> Ok(ffi_parser(file))
    _ -> Error("Could not read file")
  }
}

pub type GuineaPig

@external(javascript, "./ffi_xml_parser.mjs", "parse")
fn ffi_parser(doc: String) -> GuineaPig
