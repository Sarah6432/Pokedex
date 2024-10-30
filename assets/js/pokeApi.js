const pokeApi = {};


class Pokemon {
    constructor() {
        this.name = '';
        this.number = 0;
        this.height = 0;
        this.weight = 0;
        this.types = [];
        this.type = '';
        this.photo = '';
        this.hp = 0;
        this.attack = 0;
        this.defense = 0;
        this.abilities = [];
        this.evolutionChain = [];
    }
}


function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon();
    pokemon.name = pokeDetail.name;
    pokemon.number = pokeDetail.id;
    pokemon.height = pokeDetail.height;
    pokemon.weight = pokeDetail.weight;

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;

    pokemon.types = types;
    pokemon.type = type;

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

    const hpStat = pokeDetail.stats.find(stat => stat.stat.name === 'hp');
    pokemon.hp = hpStat ? hpStat.base_stat : 0;

    const attackStat = pokeDetail.stats.find(stat => stat.stat.name === 'attack');
    pokemon.attack = attackStat ? attackStat.base_stat : 0;

    const defenseStat = pokeDetail.stats.find(stat => stat.stat.name === 'defense');
    pokemon.defense = defenseStat ? defenseStat.base_stat : 0;

    const abilities = pokeDetail.abilities.map((ability) => ability.ability.name);
    pokemon.abilities = abilities;

    return pokemon;
}

pokeApi.getEvolutionDetails = (speciesUrl) => {
    return fetch(speciesUrl)
        .then((response) => response.json())
        .then((speciesData) => fetch(speciesData.evolution_chain.url))
        .then((response) => response.json())
        .then((evolutionData) => {
            const evolutionChain = [];
            let currentStage = evolutionData.chain;

            while (currentStage) {
                evolutionChain.push(currentStage.species.name);
                currentStage = currentStage.evolves_to[0]; // Pega a primeira evolução, caso exista
            }
            
            return evolutionChain;
        });
};

pokeApi.getPokemonDetails = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then((pokeDetail) => {
            const pokemonData = convertPokeApiDetailToPokemon(pokeDetail);

            const speciesUrl = pokeDetail.species.url;

            return pokeApi.getEvolutionDetails(speciesUrl).then((evolutionChain) => {
                pokemonData.evolutionChain = evolutionChain;
                return pokemonData;
            });
        });
};

pokeApi.getPokemons = (offset = 0, limit = 10) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    return fetch(url)
        .then((response) => response.json())
        .then((jsonbody) => jsonbody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetails))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails);
}

pokeApi.getPokemons().then(pokemons => {
    pokemons.forEach(pokemon => {
        console.log(`Nome: ${pokemon.name}, Número: ${pokemon.number}`);
        console.log(`HP: ${pokemon.hp}, Ataque: ${pokemon.attack}, Defesa: ${pokemon.defense}`);
        console.log(`Evoluções: ${pokemon.evolutionChain.join(" -> ")}`);
    });
});
