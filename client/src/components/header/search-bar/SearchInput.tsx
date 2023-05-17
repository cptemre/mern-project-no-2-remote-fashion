import React from "react";
//* FONT AWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
//* CSS
import "../../../css/header/search-bar/search-input.css";
const SearchInput = () => {
  return (
    <article id="search-input-article">
      <div id="search-input-icon-div" className="search-input-divs">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          id="search-icon"
          className="icon"
        />
      </div>
      <div id="search-input-div" className="search-input-divs">
        <input type="text" id="search-input" />
      </div>
    </article>
  );
};

export default SearchInput;
