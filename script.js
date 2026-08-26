const allPokemons = [];
const MAIN_PKM_URL = "https://pokeapi.co/api/v2/pokemon/";
const POKEMON_CONTAINER_REF = document.getElementById("pokemon-container");
const SEARCH_INPUT_REF = document.getElementById("search-input");
const SEARCH_HINT_REF = document.getElementById("search-hint");
const SEARCH_BUTTON_REF = document.getElementById("search-btn");
const LOAD_MORE_BTN_REF = document.getElementById("load-more-btn");
const LOADING_REF = document.getElementById("loading");
const ERROR_REF = document.getElementById("error-message");
const POKEMON_DIALOG_REF = document.getElementById("pokemon-dialog");
const MIN_SEARCH_LENGTH = 3;
const LIMIT = 20;
let searchTerm = "";
let isLoading = false;
let hasMore = true;

let currentIndex = 0;

async function init() {
	SEARCH_BUTTON_REF.addEventListener("click", handleSearch);
	SEARCH_INPUT_REF.addEventListener("keydown", handleSearchKey);
	SEARCH_INPUT_REF.addEventListener("input", handleSearchInput);
	LOAD_MORE_BTN_REF.addEventListener("click", loadPokemons);
	POKEMON_CONTAINER_REF.addEventListener("click", handleCardClick);
	POKEMON_DIALOG_REF.addEventListener("click", handleDialogClick);
	POKEMON_DIALOG_REF.addEventListener("close", unlockScroll);

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

function handleSearch() {
	searchTerm = SEARCH_INPUT_REF.value.trim().toLowerCase();
	render();
}

function handleSearchKey(event) {
	if (event.key === "Enter") handleSearch();
}

function handleSearchInput() {
	renderSearchHint();
	updateSearchButton();

	if (SEARCH_INPUT_REF.value.trim() === "" && searchTerm !== "") {
		searchTerm = "";
		render();
	}
}

function updateSearchButton() {
	const value = SEARCH_INPUT_REF.value.trim();
	SEARCH_BUTTON_REF.disabled =
		value.length > 0 && value.length < MIN_SEARCH_LENGTH;
}

function renderSearchHint() {
	const length = SEARCH_INPUT_REF.value.trim().length;
	const isTooShort = length > 0 && length < MIN_SEARCH_LENGTH;
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
					${capitalize(typeInfo.type.name)}
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
					<span class="stat-name">${capitalize(statInfo.stat.name)}:</span>
					<span class="stat-value">${statInfo.base_stat}</span>
				</li>
			`;
		})
		.join("");
}

function handleCardClick(event) {
	const card = event.target.closest("[data-id='card']");
	if (!card) return;

	currentIndex = Number(card.dataset.index);
	renderDialog();
	POKEMON_DIALOG_REF.showModal();
	document.body.classList.add("no-scroll");
}

function handleDialogClick(event) {
	if (event.target === POKEMON_DIALOG_REF) return POKEMON_DIALOG_REF.close();
	if (event.target.closest("[data-id='close-dialog-button']"))
		return POKEMON_DIALOG_REF.close();
	if (event.target.closest("[data-id='prev-button']")) return moveDialog(-1);
	if (event.target.closest("[data-id='next-button']")) return moveDialog(1);
}

function moveDialog(step) {
	const list = getVisiblePokemons();
	currentIndex = (currentIndex + step + list.length) % list.length;

	renderDialog();
}

function renderDialog() {
	POKEMON_DIALOG_REF.innerHTML = dialogTemplate(
		getVisiblePokemons()[currentIndex],
	);
}

function unlockScroll() {
	document.body.classList.remove("no-scroll");
}
