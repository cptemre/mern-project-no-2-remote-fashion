import React from "react";
// CSS
import "../../../../css/header/header-down/new-button/home-button.css";

const HomeButton = () => {
  return (
    <section id="home-section">
      <article
        id="home-article"
        className="pointer border-radius transition-02"
      >
        <div id="title1" className="title">
          ONLINE
        </div>
        <div id="title2" className="title">
          SHOPPING
        </div>
      </article>
    </section>
  );
};

export default HomeButton;
