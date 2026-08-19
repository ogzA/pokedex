const allPokemons = [];
const MAIN_PKM_URL = "https://pokeapi.co/api/v2/pokemon/";
const POKEMON_CONTAINER = document.getElementById("pokemon-container");

function init() {
	getData();
}

function render() {}

async function getData() {
	const response = await fetch(MAIN_PKM_URL);
	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}

	const result = await response.json();

	const mainPkmResults = result.results;

	console.log(mainPkmResults);

	mainPkmResults.map((pkmData) => {
		POKEMON_CONTAINER.innerHTML += /*html*/ `
			<article class="pokemon-card">
				<h2>${pkmData.name}</h2>
			</article>
		`;
	});
}
