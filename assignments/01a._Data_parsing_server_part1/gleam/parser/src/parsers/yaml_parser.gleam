import gleam/list
import gleam/option.{type Option, None, Some}

import glaml.{type Node, Document, NodeInt, NodeMap, NodeSeq, NodeStr}

pub type JSFramework {
  JSFramework(
    name: String,
    author: String,
    total_contributors: Int,
    contributor_account_names: List(String),
  )
}

pub fn parse() -> Option(JSFramework) {
  case glaml.parse_file("./files/js_framework.yaml") {
    Ok([Document(NodeMap(keys))]) -> Some(build(keys))
    _ -> None
  }
}

fn build(nodes: List(#(Node, Node))) -> JSFramework {
  let name = case find_node("name", nodes) {
    Some(NodeStr(value)) -> value
    _ -> "Error: Could not retrieve name"
  }
  let author = case find_node("author", nodes) {
    Some(NodeStr(value)) -> value
    _ -> "Error: Could not retrieve author"
  }
  let total_contributors = case find_node("contributors", nodes) {
    Some(NodeMap(value)) ->
      case find_node("total", value) {
        Some(NodeInt(value)) -> value
        _ -> -1
      }
    _ -> -1
  }
  let contributor_account_names = case find_node("contributors", nodes) {
    Some(NodeMap(value)) ->
      case find_node("account_names", value) {
        Some(NodeSeq(values)) ->
          list.map(values, fn(value) {
            case value {
              NodeStr(str_value) -> str_value
              _ -> "Error: Could not retrieve value"
            }
          })
        _ -> ["Error: Could not retrieve account names"]
      }
    _ -> ["Error: Could not retrieve contributors"]
  }

  JSFramework(name, author, total_contributors, contributor_account_names)
}

fn find_node(key: String, nodes: List(#(Node, Node))) -> Option(Node) {
  case nodes {
    [#(NodeStr(node_key), node), ..] if node_key == key -> Some(node)
    [_, ..rest] -> find_node(key, rest)
    _ -> None
  }
}
