import React, { useState } from "react";
//* CSS
import "../../../css/header/options/options.css";
//* FONT AWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDown } from "@fortawesome/free-solid-svg-icons";

const Options = () => {
  // WILL CHANGE BY USER TYPE
  const [options, setOptions] = useState(["PRODUCTS", "ORDERS", "ADMIN"]);

  return (
    <section id="option-section">
      {options.map((option, i) => (
        <article key={`option-article-${i}`} className="option-article">
          <div className="option-div">
            <div className="option">{option}</div>
            <div className="underline"></div>
          </div>
          <div className="option-button-arrow">
            <FontAwesomeIcon icon={faCircleDown} />
          </div>
        </article>
      ))}
    </section>
  );
};

export default Options;
