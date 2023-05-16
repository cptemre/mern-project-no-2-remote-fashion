import React, { useContext, useState, useEffect } from "react";
//* HOOKS
import useFetch from "../../../hooks/useFetch";
//* UTILITIES
// CONTEXT
import { Context } from "../../../utilities/local-variables/Context";
// INTERFACES
import { InitialStateInterface } from "../../../utilities/interfaces/local-data";
//
//* NPMS
import $ from "jquery";
//* CSS
import "../../../css/header/menu/categories.css";
import backgroundColorChangeByIndex from "../../../utilities/functions/backgroundColorChangeByIndex";

const Categories = () => {
  // CATEGORIES ARRAY
  const [categories, setCategories] = useState<string[]>([]);

  // USE REDUCER VALUES FROM CONTEXT
  const { state, dispatch } = useContext(Context);

  // GET CATEGORIES AND ASSIGN IT TO CATEGORIES ARRAY
  useEffect(() => {
    // SET CATEGORIES IN THE COMPONENT
    setCategories(state.categories);
  }, [state.categories]);

  const mouseEnterHandle = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    // CURRENT TARGET HTML
    const payload = $(
      e.currentTarget
    ).html() as InitialStateInterface["selectedCategory"];
    // SET CURRENT TARGET HTML AS SELECTED CATEGORY
    dispatch({ type: "SELECTED_CATEGORY", payload });
    $(".categories-article:nth-child(2n-1)").css({
      backgroundColor: "white",
    });
    $(".categories-article:nth-child(2n)").css({
      backgroundColor: "var(--orange-color-1)",
    });
    // SET ALL UNDERLINE WIDTH SAME
    $(".categories-article .underline")
      .stop()
      .animate({ width: state.underlineWidth1 }, state.transitionMs);
    // CATEGORIES BACKGROUND COLOR CHANGE
    const oddColor = "var(--dark-orange-color-1)";
    const evenColor = "var(--soft-white-color-1)";
    backgroundColorChangeByIndex({
      domTarget: e.currentTarget,
      oddColor,
      evenColor,
    });
    // UNDERLINE WIDTH CHANGE
    $(e.currentTarget)
      .children(".underline")
      .stop()
      .animate({ width: state.underlineWidth2 }, state.transitionMs);
    // OPEN THE SUB CATEGORIES
    $("#sub-categories-section").css("transform", "scale(1)");
  };

  return (
    <section id="categories-section">
      {categories.map((category, i) => (
        // LOOP ALL CATEGORIES TO SHOW ON SCREEN
        <article
          key={`categories-article-${i}`}
          className="categories-article"
          onMouseEnter={(e) => mouseEnterHandle(e)}
        >
          <div className="categories-div">{category}</div>
          <div className="underline"></div>
        </article>
      ))}
    </section>
  );
};

export default Categories;
