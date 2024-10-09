
const offset = 0;
const limit = 10;
const url = `https://pokeapi.co/api/v2/pokemon?=${offset}&limit=${limit}`


fetch(url)
    .then((response) => response.json())//transformando o response em uma promessa do body convertido em json
    .then((jsonbody) => console.log(jsonbody))//recebe o body convertido e printa
    .catch((error) => console.error(error))
    
