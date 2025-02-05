import txt_parser
import csv_parser
import json_parser
import xml_parser
import yaml_parser


def main():
    txt_pok = txt_parser.parse()
    print(txt_pok)

    csv_pok = csv_parser.parse()
    print(csv_pok)

    json_pok = json_parser.parse()
    print(json_pok)

    xml_pok = xml_parser.parse()
    print(xml_pok)

    yaml_pok = yaml_parser.parse()
    print(yaml_pok)


if __name__ == '__main__':
    main()
