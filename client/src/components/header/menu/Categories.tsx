import React, { useContext } from "react";
//* UTILITIES
// CONTEXT
import { Context } from "../../../utilities/local-variables/Context";
//
//* NPMS
import $ from "jquery";
//* CSS
import "../../../css/header/menu/categories.css";

const Categories = () => {
  // USE REDUCER VALUES FROM CONTEXT
  const { state, dispatch } = useContext(Context);
  const stateUnderline2 = state.css.underlineWidth2;
  const stateTransitionMs = state.css.transitionMs;

  const mouseEnterHandle = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    //* SET THE SELECTED CATEGORY TO STATE
    // CURRENT TARGET HTML
    const payload = $(e.currentTarget).children(".categories-div").html();
    // SET CURRENT TARGET HTML AS SELECTED CATEGORY IN THE STATE
    dispatch({ type: "SELECTED_CATEGORY", payload });
    //* CHANGE THE BACKGROUND COLOR OF ALL CATEGORIES TO ITS INITIAL COLORS
    $(".categories-article:nth-child(2n-1)").css({
      backgroundColor: "white",
    });
    $(".categories-article:nth-child(2n)").css({
      backgroundColor: "var(--orange-color-1)",
    });
    //* CHANGE THE BACKGROUND COLOR OF SELECTED CATEGORY
    // INDEX OF THE ELEMENT
    const index = $(e.currentTarget).index();
    // CHECK IF ODD OR EVEN
    const oddOrEven = index % 2;
    // CSS VARS ACCORDING TO ODD OR EVEN
    const oddColor = "var(--dark-orange-color-1)";
    const evenColor = "var(--soft-white-color-1)";
    // SELECTED CATEGORY BACKGROUND COLOR CHANGE
    const backgroundColor = oddOrEven === 1 ? oddColor : evenColor;
    $(".categories-article")
      .find(`.categories-div:contains(${payload})`)
      .parent(".categories-article")
      .css({ backgroundColor });
    //* UNDERLINE WIDTH CHANGES
    // SET ALL UNDERLINES OF CATEGORY TO ITS INITIAL
    $(".categories-article")
      .children(".underline")
      .stop()
      .animate({ width: state.css.underlineWidth1 }, stateTransitionMs);
    // SET CURRENT UNDERLINE WIDTH LONGER
    $(e.currentTarget)
      .children(".underline")
      .stop()
      .animate({ width: stateUnderline2 }, stateTransitionMs);
    //* OPEN THE SUB CATEGORIES
    $("#sub-categories-section").css("transform", "scale(1)");
    // SUB-CATEGORY ALL UNDERLINE WIDTH TO INITIAL
    $(".sub-categories-article")
      .find("div .underline")
      .stop()
      .animate({ width: state.css.underlineWidth1 }, stateTransitionMs);
  };

  return (
    <section id="categories-section">
      {state.category.categories.map((category, i) => (
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
