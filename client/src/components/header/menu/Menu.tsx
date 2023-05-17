import { useContext } from "react";
//* COMPONENTS
// MENU BUTTON
import MenuButton from "./MenuButton";
// CATEGORIES
import Categories from "./Categories";
// SUB-CATEGORIES
import SubCategories from "./SubCategories";
// CONTEXT
import { Context } from "../../../utilities/local-variables/Context";
//* NPMS
import $ from "jquery";
//* CSS
import "../../../css/header//menu/menu.css";
const Menu = () => {
  // STATE VARIABLES
  const { state } = useContext(Context);
  const stateUnderline1 = state.css.underlineWidth1;
  const stateTransitionMs = state.css.transitionMs;
  const mouseEnterHandle = () => {
    // TURN ON CATEGORIES
    $("#categories-section").css("transform", "scale(1)");
    // DOTS COLOR CHANGE FOR MENU BUTTON
    $(".menu-button-dot").css("border-color", "white");
    // MENU BUTTON CSS
    $("#menu-button-section").css({
      backgroundColor: "var(--orange-color-1)",
      boxShadow: "var(--box-shadow-015)",
    });
  };
  const mouseLeaveHandle = () => {
    // TURN OFF CATEGORIES SECTION
    $("#categories-section").css("transform", "scale(0)");
    // TURN OFF SUB CATEGORIES SECTION
    $("#sub-categories-section").css("transform", "scale(0)");
    // MENU BUTTON DOTS COLOR CHANGE
    $(".menu-button-dot").css("border-color", "var(--orange-color-1)");
    // CHANGE MENU BUTTON CSS COLORS
    $("#menu-button-section").css({
      backgroundColor: "transparent",
      boxShadow: "none",
    });
  };

  const mouseLeaveHandleCategories = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    // SET CATEGORY ARTICLE BACKGROUND AND COLOR BACK TO NORMAL
    $(e.currentTarget)
      .find("#categories-section .categories-article:nth-child(2n)")
      .css({
        backgroundColor: "var(--orange-color-1)",
        color: "white",
      })
      .end() // Go back to the previous context
      .find("#categories-section .categories-article:nth-child(2n-1)")
      .css({
        backgroundColor: "white",
        color: "var(--orange-color-1)",
      });
    //
    $(e.currentTarget)
      .find("#categories-section .categories-article .underline")
      .stop()
      .animate({ width: stateUnderline1 }, stateTransitionMs);
  };
  return (
    <section
      id="menu-section"
      onMouseEnter={() => mouseEnterHandle()}
      onMouseLeave={() => mouseLeaveHandle()}
    >
      <MenuButton />
      <section
        id="categories-subcategories-section"
        onMouseEnter={() => mouseEnterHandle()}
        onMouseLeave={(e) => mouseLeaveHandleCategories(e)}
      >
        <Categories />
        <SubCategories />
      </section>
    </section>
  );
};

export default Menu;
