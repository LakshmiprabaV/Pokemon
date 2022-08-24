import React, { useState, useRef } from "react";
import PropTypes from "prop-types";

function PokemonSearch({ pokemonData, setfilteredPokemon }) {
  const [searchQuery, setSearchQuery] = useState("");
  const searchType = useRef();

  const handleSearch = (value) => {
    setSearchQuery(value);
    const type = searchType.current.value;
    let filteredPokemons = [];
    if (type.toLowerCase() === "name") {
      filteredPokemons = pokemonData.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(value.toLowerCase())
      );
    }
    if (type.toLowerCase() === "ability") {
      filteredPokemons = pokemonData.filter((pokemon) =>
        pokemon.abilities.some(({ ability }) =>
          ability.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
    setfilteredPokemon(filteredPokemons);
  };

  return (
    <>
      <div className="container_input">
        <div>Type</div>
        <select ref={searchType}>
          <option>Name</option>
          <option>Ability</option>
        </select>
      </div>
      <div className="container_input">
        <label>Search</label>
        <input
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Pokemon search"
        />
      </div>
    </>
  );
}

export default PokemonSearch;

PokemonSearch.prototype = {
  setfilteredPokemon: PropTypes.func,
  pokemonData: PropTypes.object
};
