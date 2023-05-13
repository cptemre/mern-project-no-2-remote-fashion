import React from "react";
//* COMPONENTS
// MENU BUTTON
import MenuButton from "./MenuButton";
// CATEGORIES
import Categories from "./Categories";
// SUB-CATEGORIES
import SubCategories from "./SubCategories";
//* CSS
import "../../../css/header//menu/menu.css";
const Menu = () => {
  return (
    <section id="menu-section">
      <MenuButton />
      <Categories />
      <SubCategories />
    </section>
  );
};

export default Menu;
