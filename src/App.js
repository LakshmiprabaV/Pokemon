import React, { useEffect, useState } from "react";
import PokeCard from "./components/Card";
import { getPokemon, getAllPokemon } from "./actions/PokemonActions";
import "./App.css";
import Pagination from "./components/Pagination";
import PokemonSearch from "./components/PokemonSearch";
import PokemonSort from "./components/PokemonSort";

export default function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";

  const [pokemonData, setPokemonData] = useState([]);
  const [filteredPokemon, setfilteredPokemon] = useState([]);
  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [noOfCards, setNoOfCards] = useState(20);

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

  const setSearchResult = (pokeData) => {
    setfilteredPokemon(pokeData);
  };

  const setSortedResult = (pokeData) => {
    setPokemonData(pokeData);
  };

  return (
    <>
      <nav>POKEMON APPLICATION</nav>
      <div className="container">
        <PokemonSearch
          setfilteredPokemon={setSearchResult}
          pokemonData={pokemonData}
        ></PokemonSearch>
        <PokemonSort
          setPokemonData={setSortedResult}
          pokemonData={pokemonData}
        ></PokemonSort>
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