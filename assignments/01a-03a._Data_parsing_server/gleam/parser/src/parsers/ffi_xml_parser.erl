-module(ffi_xml_parser).

-export([parse/1]).

parse(FileName) ->
	File = xmerl_scan:file(FileName),
	{{xmlElement, 'guinea-pig', _, _, _, _, _, _, Children, _, _, _}, _} = File,

	extract_guinea_pig(Children).

extract_guinea_pig(Children) ->
	{Name, Age, Likes, FavSnack} = extract_fields(Children),
	jsx:encode(#{name => Name, age => Age, likes => Likes, favSnack => FavSnack}).

extract_fields(Children) ->
	Name = extract_text(find_element(name, Children)),
	Age = extract_text(find_element(age, Children)),
	Likes = extract_likes(find_element(likes, Children)),
	FavSnack = extract_text(find_element('favourite-snack', Children)),

	{unicode:characters_to_binary(Name), list_to_integer(Age), Likes, unicode:characters_to_binary(FavSnack)}.

find_element(Name, [{xmlElement, Name, _, _, _, _, _, _, _, _, _, _} = Elem | _]) -> Elem;
find_element(Name, [_ | Rest]) -> 
	find_element(Name, Rest).

extract_text({xmlElement, _, _, _, _, _, _, _, [{xmlText, _, _, _, Text, _}], _, _, _}) ->
	Text.

extract_likes({xmlElement, _, _, _, _, _, _, _, Children, _, _, _}) ->
	[unicode:characters_to_binary(extract_text(Elem)) || {xmlElement, like, _, _, _, _, _, _, _, _, _, _} = Elem <- Children].

