import React, { useContext, useState, useEffect } from "react";
//* HOOKS
import useFetch from "../../../hooks/useFetch";
//* UTILITIES
// CONTEXT
import { Context } from "../../../utilities/local-variables/Context";

//* CSS
import "../../../css/header/menu/categories.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const { state, dispatch } = useContext(Context);
  useEffect(() => {
    dispatch({ type: "TEST", payload: [] });
  }, [state.urls]);
  console.log(state.localVariables);

  // useFetch({ url: "/api/v1/product", type: "get",body: {} });
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
