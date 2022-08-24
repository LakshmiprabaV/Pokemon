import React, { useEffect, useRef, useState } from "react";
import PokeCard from "./components/Card";
import { getPokemon, getAllPokemon } from "./actions/PokemonActions";
import "./App.css";
import Pagination from "./components/Pagination";

export default function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";

  const [pokemonData, setPokemonData] = useState([]);
  const [filteredPokemon, setfilteredPokemon] = useState([]);
  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [noOfCards, setNoOfCards] = useState(20);
  const [sortBy, setSortBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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

  function handleSearch(value) {
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
  }

  const handleSort = async (value) => {
    let sortedData = [...pokemonData];

    if (value === "name") {
      sortedData.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sortedData.sort((a, b) => a[value] - b[value]);
    }
    setSortBy(value);
    await setPokemonData(sortedData);
  };

  return (
    <>
      <nav>POKEMON APPLICATION</nav>
      <div className="container">
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
      </div>
      <div>
        {loading ? (
          <h1 style={{ textAlign: "center" }}>Loading...</h1>
        ) : (
          <>
            <Pagination
              prev={prev}
              next={next}
              noOfCards={noOfCards}
              handleNoOfCards={handleNoOfCards}
            />
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

            <Pagination
              prev={prev}
              next={next}
              noOfCards={noOfCards}
              handleNoOfCards={handleNoOfCards}
            />
          </>
        )}
      </div>
    </>
  );
}
