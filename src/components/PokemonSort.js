import React, { useState } from "react";
import PropTypes from "prop-types";
import "./style.css";

function PokemonSort({ pokemonData, setPokemonData }) {
  const [sortBy, setSortBy] = useState("");

  const handleSort = (value) => {
    let sortedData = [...pokemonData];
    setSortBy(value);
    if (value === "name") {
      sortedData.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sortedData.sort((a, b) => a[value] - b[value]);
    }

    setPokemonData(sortedData);
  };

  return (
    <>
      <div className="container_input">
        <div>Sort By</div>
        <select value={sortBy} onChange={(e) => handleSort(e.target.value)}>
          <option diabled value="">
            {""}
          </option>
          <option value="name">Name</option>
          <option value="height">Height</option>
          <option value="weight">Weight</option>
        </select>
      </div>
    </>
  );
}

export default PokemonSort;

PokemonSort.prototype = {
  pokemonData: PropTypes.array,
  setPokemonData: PropTypes.func
};
