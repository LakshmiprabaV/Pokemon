import React from "react";
import "./style.css";

function Card({ pokemon }) {
  const { name, weight, height, sprites, abilities } = pokemon;

  return (
    <>
      <div className="options">
        <select>
          <option>10</option>
          <option>20</option>
          <option>50</option>
        </select>
      </div>
      <div className="btn">
        <button onClick={prev}>Prev</button>
        <button onClick={next}>Next</button>
      </div>
    </>
  );
}
