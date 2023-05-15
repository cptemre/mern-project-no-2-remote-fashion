import React, { useContext, useState, useEffect } from "react";
//* HOOKS
import useFetch from "../../../hooks/useFetch";
//* UTILITIES
// CONTEXT
import { Context } from "../../../utilities/local-variables";

//* CSS
import "../../../css/header/menu/categories.css";

const Categories = () => {
  // CATEGORIES ARRAY
  const [categories, setCategories] = useState<string[]>([]);
  // USE REDUCER VALUES FROM CONTEXT
  const { state } = useContext(Context);
  // STATE > CATEGORIES ARRAY
  const stateCategories = state.categories;

  // GET CATEGORIES AND ASSIGN IT TO CATEGORIES ARRAY
  useEffect(() => {
    setCategories(stateCategories);
  }, [stateCategories]);

  return (
    <section id="categories-section">
      {categories.map((category, i) => (
        <article key={`categories-article-${i}`} className="categories-article">
          {category}
        </article>
      ))}
    </section>
  );
};

export default Categories;
