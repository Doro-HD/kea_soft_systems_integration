import { parse as parser } from "jsr:@libs/xml";

export function parse(doc) {
	const guineaPig = parser(doc);

	return guineaPig;
}

