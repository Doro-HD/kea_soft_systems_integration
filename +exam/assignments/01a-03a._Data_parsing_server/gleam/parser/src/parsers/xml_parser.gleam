pub fn parse() -> String {
  ffi_parse("./files/guinea_pig.xml")
}

@external(erlang, "ffi_xml_parser", "parse")
fn ffi_parse(doc: String) -> String
