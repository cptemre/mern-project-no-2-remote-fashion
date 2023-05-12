import React, { useState } from "react";
//* CSS
import "../../../css/header/options/option.css";

const Options = () => {
  // WILL CHANGE BY USER TYPE
  const [options, setOptions] = useState(["PRODUCTS", "ORDERS"]);
  return (
    <section id="options-section">
      {options.map((option) => (
        <article className="option-article">
          <div className="option-div">{option}</div>
        </article>
      ))}
    </section>
  );
};

export default Options;
