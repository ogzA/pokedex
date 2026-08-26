function capitalize(text) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatId(id) {
	return String(id).padStart(4, "0");
}

function getArtwork(pokemon) {
	const art = pokemon.sprites.other["official-artwork"].front_default;
	return art;
}
