import React, { useEffect, useRef, useState } from "react";
import PokeCard from "./components/Card";
import { getPokemon, getAllPokemon } from "./actions/PokemonActions";
import "./App.css";

export default function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";

  const [pokemonData, setPokemonData] = useState([]);
  const [filteredPokemon, setfilteredPokemon] = useState([]);
  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [noOfCards, setNoOfCards] = useState(20);
  const [sortBy, setSortBy] = useState("");

  const searchRef = useRef();
  const searchType = useRef();

  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map(async (pokemon) => {
        let pokemonRecord = await getPokemon(pokemon);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };

  useEffect(() => {
    async function fetchData() {
      let response = await getAllPokemon(initialURL);
      setNextUrl(response.next);
      setPrevUrl(response.previous);
      await loadPokemon(response.results);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleNoOfCards = async (e) => {
    setLoading(true);
    setNoOfCards(e.target.value);
    const url = `${initialURL}?offset=0&limit=${e.target.value}`;
    let data = await getAllPokemon(url);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  };

  const next = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextUrl);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  };

  const prev = async () => {
    if (!prevUrl) return;
    setLoading(true);
    let data = await getAllPokemon(prevUrl);
    await loadPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  };

  function handleSearch(event) {
    const value = searchRef.current.value;
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
  }

  const handleSort = (value) => {
    if (value === "name") {
      pokemonData.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      pokemonData.sort((a, b) => a[value] - b[value]);
    }
    setSortBy(value);
    setPokemonData(pokemonData);
  };

  return (
    <>
      <nav>POKE MON</nav>
      <div className="searchType">
        <select ref={searchType}>
          <option>Name</option>
          <option>Ability</option>
        </select>
      </div>
      <input ref={searchRef} placeholder="Pokemon search" />
      <button onClick={handleSearch}>Search</button>

      <div className="sortBy">
        <select value={sortBy} onChange={(e) => handleSort(e.target.value)}>
          <option disabled value="">
            Sort By
          </option>
          <option value="name">Name</option>
          <option value="height">Height</option>
          <option value="weight">Weight</option>
        </select>
      </div>

      <div>
        {loading ? (
          <h1 style={{ textAlign: "center" }}>Loading...</h1>
        ) : (
          <>
            <div className="options">
              No of Cards Per Page:
              <select onChange={(e) => handleNoOfCards(e)} value={noOfCards}>
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
            </div>
            <div className="btn">
              <button onClick={prev}>Prev</button>
              <button onClick={next}>Next</button>
            </div>
            {!filteredPokemon.length ? (
              <div className="grid-container">
                {pokemonData.map((pokemon, i) => {
                  return <PokeCard key={i} pokemon={pokemon} />;
                })}
              </div>
            ) : (
              <div className="grid-container">
                {filteredPokemon.map((pokemon, i) => {
                  return <PokeCard key={i} pokemon={pokemon} />;
                })}
              </div>
            )}

            <div className="btn">
              <button onClick={prev}>Prev</button>
              <button onClick={next}>Next</button>
            </div>
            <div className="options">
              No of Cards Per Page:
              <select onChange={(e) => handleNoOfCards(e)} value={noOfCards}>
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
            </div>
          </>
        )}
      </div>
    </>
  );
}
