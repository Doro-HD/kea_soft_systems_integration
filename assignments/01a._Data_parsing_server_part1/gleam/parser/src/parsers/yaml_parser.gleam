import simplifile

pub fn parse() {
  let file_result = simplifile.read("./files/js_framework.yaml")
  let foo = case file_result {
    Ok(file) -> Ok(ffi_parse(file))
    _ -> Error("Could not read file")
  }
}

pub type JSFramework

@external(javascript, "./ffi_yaml_parser.mjs", "ffi_parse")
fn ffi_parse(doc: String) -> JSFramework
