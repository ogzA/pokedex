const allPokemons = [];
const MAIN_PKM_URL = "https://pokeapi.co/api/v2/pokemon/";
const POKEMON_CONTAINER = document.getElementById("pokemon-container");

async function init() {
	await getData();
	render();
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

async function getData() {
	const response = await fetch(MAIN_PKM_URL);

	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}
	const result = await response.json();
	const PokemonResults = result.results;

	const detailsPromises = PokemonResults.map((pokemon) => {
		return fetch(pokemon.url).then((res) => res.json());
	});

	const pokemonDetails = await Promise.all(detailsPromises);

	allPokemons.push(...pokemonDetails);
}
