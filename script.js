const allPokemons = [];
const MAIN_PKM_URL = "https://pokeapi.co/api/v2/pokemon/";
const POKEMON_CONTAINER = document.getElementById("pokemon-container");

async function init() {
	try {
		await getData();
		render();
	} catch (error) {
		console.log(error);

		POKEMON_CONTAINER.innerHTML = pokemonLoadErrorMessage();
	}
}

function pokemonLoadErrorMessage() {
	return /*html*/ `
		<p class="error">Pokémon could not be loaded. Please try again later.</p>
	`;
}

function render() {
	const cardsHTML = allPokemons.map((pokemon) => {
		return /*html*/ `
			<article class="pokemon-card">
				<h2>${pokemon.name}</h2>
				<div>${pokemon.base_experience}</div>
			</article>
		`;
	});

	POKEMON_CONTAINER.innerHTML = cardsHTML.join("");
}

async function fetchJson(url) {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}

	return await response.json();
}

async function fetchPokemonDetails(pokemonList) {
	const detailPromises = pokemonList.map((pokemon) => fetchJson(pokemon.url));
	return await Promise.all(detailPromises);
}

async function getData() {
	const result = await fetchJson(MAIN_PKM_URL);
	const details = await fetchPokemonDetails(result.results);
	allPokemons.push(...details);
}
