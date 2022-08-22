import React from "react";
import "./style.css";

function PokeCard({ pokemon }) {
  const { name, weight, height, sprites, abilities } = pokemon;

  return (
    <div className="card">
      <div className="card_img">
        <img src={sprites?.front_default} alt="" />
      </div>
      <div className="card_name">{name}</div>

      <div className="card_info">
        <div className="card_data">
          <p className="title">Weight</p>
          <p>{weight}</p>
        </div>
        <div className="card_data">
          <p className="title">Height</p>
          <p>{height}</p>
        </div>
        <div className="card_data card_data_ability">
          <p className="title">Ability</p>
          {abilities?.map(({ ability }, idx) => {
            return <p key={`ab${idx}`}>{ability?.name}</p>;
          })}
        </div>
      </div>
    </div>
  );
}

export default PokeCard;
