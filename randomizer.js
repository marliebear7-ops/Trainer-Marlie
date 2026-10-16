const pokemonDisplay = document.getElementById("pokemon-display");

async function loadRandomPokemon() {
    try {
        // Choose a random Pokémon ID from 1 to 1025.
        const pokemonId = Math.floor(Math.random() * 1025) + 1;

        // Get the Pokémon's stats, artwork, and types.
        const pokemonResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
        );

        if (!pokemonResponse.ok) {
            throw new Error("Could not load the Pokémon.");
        }

        const pokemon = await pokemonResponse.json();

        // 1 in 20 chance of a shiny Pokémon.
        const isShiny = Math.random() < 1 / 20;

        // Get the species data, including the Pokédex entry.
        const speciesResponse = await fetch(pokemon.species.url);

        if (!speciesResponse.ok) {
            throw new Error("Could not load the Pokédex entry.");
        }

        const species = await speciesResponse.json();

        // Find an English Pokédex description.
        const entry = species.flavor_text_entries.find(
            entry => entry.language.name === "en"
        );

        // Display the Pokémon's information.
        displayPokemon(pokemon, entry, isShiny);
    } catch (error) {
        console.error(error);

        pokemonDisplay.replaceChildren();

        const message = document.createElement("p");
        message.textContent =
            "We couldn't load a Pokémon. Please refresh the page.";

        pokemonDisplay.appendChild(message);
    }
}

function displayPokemon(pokemon, entry, isShiny) {
    pokemonDisplay.replaceChildren();

    // Pokémon artwork.
    const image = document.createElement("img");

    const artwork = isShiny
        ? pokemon.sprites.other["official-artwork"].front_shiny
        : pokemon.sprites.other["official-artwork"].front_default;

    image.src = artwork ||
    (isShiny
        ? pokemon.sprites.front_shiny
        : pokemon.sprites.front_default);
    image.alt = isShiny
    ? `Shiny ${pokemon.name}`
    : pokemon.name;
    image.className = "random-pokemon-image";

    image.addEventListener("click", loadRandomPokemon);
    image.title = "Click to find another Pokémon!";
    
    // Pokémon name.
    const name = document.createElement("h2");

    name.textContent = isShiny
        ? `✧˖° Shiny ${formatPokemonName(pokemon.name)} ✧˖°`
        : formatPokemonName(pokemon.name);

    // Pokédex number.
    const number = document.createElement("p");
    number.textContent =
        `National Pokédex #${String(pokemon.id).padStart(4, "0")}`;

    // Pokémon types.
    const types = document.createElement("p");
    types.textContent = "Type: " +
        pokemon.types
            .map(type => formatPokemonName(type.type.name))
            .join(" / ");

    // Pokédex description.
    const description = document.createElement("p");
    description.className = "pokedex-entry";
    description.textContent = entry
        ? entry.flavor_text.replace(/[\n\f]/g, " ")
        : "No English Pokédex entry was found.";

    pokemonDisplay.append(
        image,
        name,
        number,
        types,
        description
    );
}

function formatPokemonName(name) {
    return name
        .split("-")
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

// Run automatically when the page loads.
loadRandomPokemon();
