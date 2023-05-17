import React, { useState } from "react";
//* CSS
import "../../../css/header/options/options.css";
import "../../../css/header/options/option.css";

const Options = () => {
  // WILL CHANGE BY USER TYPE
  const [options, setOptions] = useState(["PRODUCTS", "ORDERS"]);
  return (
    <section id="options-section">
      {options.map((option, i) => (
        <article key={`option-article-${i}`} className="option-article">
          <div className="option-div border-radius pointer">{option}</div>
        </article>
      ))}
    </section>
  );
};

export default Options;
