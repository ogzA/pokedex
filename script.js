const allPokemons = [];
const MAIN_PKM_URL = "https://pokeapi.co/api/v2/pokemon/";
const POKEMON_CONTAINER_REF = document.getElementById("pokemon-container");
const SEARCH_INPUT_REF = document.getElementById("search-input");
const SEARCH_HINT_REF = document.getElementById("search-hint");
const LOAD_MORE_BTN_REF = document.getElementById("load-more-btn");
const LOADING_REF = document.getElementById("loading");
const ERROR_REF = document.getElementById("error-message");
const MIN_SEARCH_LENGTH = 3;
const LIMIT = 20;
let searchTerm = "";
let isLoading = false;
let hasMore = true;

async function init() {
	SEARCH_INPUT_REF.addEventListener("input", handleSearch);
	LOAD_MORE_BTN_REF.addEventListener("click", loadPokemons);

	loadPokemons();
}

async function loadPokemons() {
	if (isLoading) return;
	setLoading(true);

	ERROR_REF.textContent = "";

	try {
		hasMore = await getData();
		render();
	} catch (error) {
		console.error(error);
		showLoadError();
	} finally {
		setLoading(false);
	}
}

function setLoading(value) {
	isLoading = value;
	renderLoadingState();
}

function renderLoadingState() {
	LOADING_REF.classList.toggle("d-none", !isLoading);
	LOAD_MORE_BTN_REF.disabled = isLoading;
	LOAD_MORE_BTN_REF.classList.toggle("d-none", !hasMore);
}

function handleSearch(event) {
	searchTerm = event.target.value.trim().toLowerCase();
	renderSearchHint();
	render();
}

function renderSearchHint() {
	const isTooShort =
		searchTerm.length > 0 && searchTerm.length < MIN_SEARCH_LENGTH;
	SEARCH_HINT_REF.textContent = isTooShort
		? "Type at least 3 characters"
		: "";
}

function getVisiblePokemons() {
	if (!isSearchActive()) {
		return allPokemons;
	}

	return allPokemons.filter((pokemon) => pokemon.name.includes(searchTerm));
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

function isSearchActive() {
	return searchTerm.length >= MIN_SEARCH_LENGTH;
}

function render() {
	const visiblePokemons = getVisiblePokemons();

	if (isSearchActive() && visiblePokemons.length === 0) {
		POKEMON_CONTAINER_REF.innerHTML = noResultsMessage();
		return;
	}

	POKEMON_CONTAINER_REF.innerHTML = visiblePokemons
		.map(pokemonCardTemplate)
		.join("");
}

async function fetchJson(url) {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}

	return response.json();
}

async function fetchPokemonDetails(pokemonList) {
	const detailPromises = pokemonList.map((pokemon) => fetchJson(pokemon.url));
	return Promise.all(detailPromises);
}

async function getData() {
	const result = await fetchJson(
		`${MAIN_PKM_URL}?offset=${allPokemons.length}&limit=${LIMIT}`,
	);
	const details = await fetchPokemonDetails(result.results);
	allPokemons.push(...details);

	return result.next !== null;
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

function pokemonCardTemplate(pokemon) {
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
}

function showLoadError() {
	if (allPokemons.length === 0) {
		POKEMON_CONTAINER_REF.innerHTML = pokemonLoadErrorMessage();
		return;
	}
	ERROR_REF.textContent = "Could not load more Pokémon. Please try again.";
}
