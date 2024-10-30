const pokemonListTwo = document.getElementById('maisInformLi');

function convertPokemonToLiTwo(pokemon) {
    return `
        <header class="pokemon ${pokemon.type} head">
            <img src="${pokemon.photo}" alt="${pokemon.name}">
            <span class="name">${pokemon.name}</span>
            <div class="info">
                <span class="number">#${pokemon.number}</span>
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                </div>
            </div>
        </header>
        <nav class="nav-menu ${pokemon.type}">
            <ul>
                <li><a href="#" id="statusBtn" onclick="toggleDiv('statusDiv')">Status</a></li>
                <li><a href="#" id="sobreBtn" onclick="toggleDiv('sobreDiv')">Sobre</a></li>
                 <li><a href="#" id="evolucoesBtn" onclick="toggleDiv('evolucoesDiv')">Evoluções</a></li>
            </ul>
        </nav>
        <div id="statusDiv" class="status content hidden">
            <!-- Informações de status serão exibidas aqui -->
        </div>
        <div id="sobreDiv" class="sobre content hidden">
            <!-- Informações sobre serão exibidas aqui -->
        </div>
        <div id="evolucoesDiv" class="evolucoes content hidden">
            <!-- Informações sobre serão exibidas aqui -->
        </div>
    `;
}

function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        pokemonNumber: params.get('pokemonNumber')
    };
}

function loadPokemonData() {
    const { pokemonNumber } = getQueryParams();

    if (pokemonNumber) {
        pokeApi.getPokemonDetails({ url: `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}` })
        .then((pokemon) => {
            const newHtml = convertPokemonToLiTwo(pokemon); 
            pokemonListTwo.innerHTML = newHtml;

            document.getElementById('statusBtn').addEventListener('click', (event) => {
                event.preventDefault(); 
                mostrarStatus(pokemon); 
            });

            document.getElementById('sobreBtn').addEventListener('click', (event) => {
                event.preventDefault(); 
                mostrarSobre(pokemon); 
            });
            document.getElementById('evolucoesBtn').addEventListener('click', (event) => {
                event.preventDefault(); 
                mostrarEvolucoes(pokemon); 
            });
        })
        .catch((error) => {
            console.error("Erro ao carregar os dados do Pokémon:", error);
            pokemonListTwo.innerHTML = 'Erro ao carregar os dados do Pokémon.';
        });
    } else {
        pokemonListTwo.innerHTML = 'Nenhum Pokémon encontrado.';
    }
}

function mostrarStatus(pokemon) {
    const statusDiv = document.getElementById('statusDiv');
    statusDiv.innerHTML = `
        <div class="stat"> 
            <h2 class="titleStatus ${pokemon.type}">Status de ${pokemon.name}</h2>
            <p class="num">Número: ${pokemon.number}</p>
            <p class="hp">HP: ${pokemon.hp}</p>
            <p class="ataque">Ataque: ${pokemon.attack}</p>
            <p class="defesa">Defesa: ${pokemon.defense}</p>
            <p class="tipo">Tipo principal: ${pokemon.type}</p>
            <p class="tipos">Tipos: ${pokemon.types.join(', ')}</p>
        </div>
    `;
    toggleDiv('statusDiv');  
}

function mostrarSobre(pokemon) {
    const sobreDiv = document.getElementById('sobreDiv');
    sobreDiv.innerHTML = `
        <div class="stat"> 
            <h2 class="titleStatus ${pokemon.type}">Sobre ${pokemon.name}</h2>
            <p class="hp">Habilidades: ${pokemon.abilities.join(', ')}</p>
            <p class="ataque">Altura: ${pokemon.height} metros</p>
            <p class="defesa">Peso: ${pokemon.weight} kg</p>
        </div>
    `;
    toggleDiv('sobreDiv'); 
}
function mostrarEvolucoes(pokemon) {
    const evolDiv = document.getElementById('evolucoesDiv');
    evolDiv.innerHTML = `
        <div class="stat"> 
            <h2 class="titleStatus ${pokemon.type}">Evolucões ${pokemon.name}</h2>
            <p class="evol"> ${pokemon.evolutionChain.join(', ')}.</p>
        </div>
    `;
    toggleDiv('evolucoesDiv'); 
}

function toggleDiv(divId) {
    const divs = document.querySelectorAll('.content');

   
    divs.forEach(div => div.classList.add('hidden'));

    
    document.getElementById(divId).classList.remove('hidden');
}


loadPokemonData();
