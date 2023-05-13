import React from "react";
//* CSS
import "../../../css/header//menu/menu-button.css";
const MenuButton = () => {
  const rows = [...Array(3)];
  return (
    <section id="menu-button-section" className="border-radius transition-02">
      {rows.map((row) => (
        <article className="menu-button-row">
          {rows.map((dot) => (
            <div className="menu-button-dot"></div>
          ))}
        </article>
      ))}
    </section>
  );
};

export default MenuButton;
