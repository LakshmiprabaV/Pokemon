import React from "react";
import PropTypes from "prop-types";
import "./style.css";

function Pagination({ prev, next, handleNoOfCards, noOfCards }) {
  return (
    <>
      <div className="container">
        <div className="btn">
          <button onClick={prev}>Prev</button>
          <button onClick={next}>Next</button>
        </div>
        <div className="options">
          <div>No.Of Cards/Page</div>
          <select onChange={(e) => handleNoOfCards(e)} value={noOfCards}>
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>
      </div>
    </>
  );
}

export default Pagination;

Pagination.prototype = {
  prev: PropTypes.func,
  next: PropTypes.func,
  handleNoOfCards: PropTypes.func,
  noOfCards: PropTypes.number
};
