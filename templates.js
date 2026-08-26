function pokemonCardTemplate(pokemon, index) {
	return /*html*/ `
		<li>
			<button
				data-id="card"
				data-index="${index}"
				class="pokemon-card type-${pokemon.types[0].type.name}"
				aria-label="Show details for ${capitalize(pokemon.name)}"
			>
				<span class="pokemon-id">#${formatId(pokemon.id)}</span>
				<img data-id="card-image" src="${getArtwork(pokemon)}" alt="${pokemon.name}" />
				<span class="pokemon-name">${capitalize(pokemon.name)}</span>
				<span class="pokemon-types">${renderTypes(pokemon.types)}</span>
			</button>
		</li>
		`;
}

function dialogTemplate(pokemon) {
	return /*html*/ `
		<article data-id="overlay-pokemon-name" class="dialog-card type-${pokemon.types[0].type.name}">
			<header class="dialog-header">
				<span>#${formatId(pokemon.id)}</span>
				<h2>${capitalize(pokemon.name)}</h2>
				<button data-id="close-dialog-button" aria-label="Close details">&times;</button>
			</header>

			<img data-id="dialog-image" src="${pokemon.sprites.other["official-artwork"].front_default}"
				alt="${capitalize(pokemon.name)}" />

			<div class="dialog-types">${renderTypes(pokemon.types)}</div>
			<ul class="pokemon-stats">${renderStats(pokemon.stats)}</ul>

			${dialogNavTemplate()}
		</article>
	`;
}

function dialogNavTemplate() {
	return /*html*/ `
		<nav class="dialog-nav">
			<button data-id="prev-button" aria-label="Previous Pokémon">&lsaquo;</button>
			<button data-id="next-button" aria-label="Next Pokémon">&rsaquo;</button>
		</nav>
	`;
}
