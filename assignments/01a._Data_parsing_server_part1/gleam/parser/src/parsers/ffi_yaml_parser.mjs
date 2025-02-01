import { parse } from "jsr:@std/yaml";

export function ffi_parse(doc) {
	return parse(doc);
}

