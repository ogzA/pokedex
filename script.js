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
				<span class="pokemon-id">#${pokemon.id}</span>
				<img
					src="${pokemon.sprites.other["official-artwork"].front_default}"
					alt="${pokemon.name}"
				/>

				<h2>${pokemon.name}</h2>

				<div class="pokemon-types">
					${renderTypes(pokemon.types)}
				</div>

				<ul class="pokemon-stats">
					${renderStats(pokemon.stats)}
				</ul>
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

function renderTypes(types) {
	return types
		.map((typeInfo) => {
			return /*html*/ `
				<span class="type-badge type-${typeInfo.type.name}">
					${typeInfo.type.name}
				</span>
			`;
		})
		.join("");
}

function renderStats(stats) {
	return stats
		.map((statInfo) => {
			return /*html*/ `
				<li>
					<span class="stat-name">${statInfo.stat.name}</span>
					<span class="stat-value">${statInfo.base_stat}</span>
				</li>
			`;
		})
		.join("");
}
