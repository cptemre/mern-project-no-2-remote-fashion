import React from "react";
//* CSS
import "../../../css/header/menu/categories.css";

const Categories = () => {
  const categories = ["CLOTHES", "SHOES"];
  return (
    <section id="categories-section">
      {categories.map((category) => (
        <article className="categories-article">{category}</article>
      ))}
    </section>
  );
};

export default Categories;
