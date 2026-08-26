function showLoadError() {
	if (allPokemons.length === 0) {
		POKEMON_CONTAINER_REF.innerHTML = pokemonLoadErrorMessage();
		return;
	}
	ERROR_REF.textContent = "Could not load more Pokémon. Please try again.";
}

function pokemonLoadErrorMessage() {
	return /*html*/ `
		<p class="error">Pokémon could not be loaded. Please try again later.</p>
	`;
}

function noResultsMessage() {
	return /*html*/ `
		<p data-id="not-found" class="no-results">No Pokémon matched "${searchTerm}".</p>
	`;
}
