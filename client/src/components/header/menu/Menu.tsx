//* COMPONENTS
// MENU BUTTON
import MenuButton from "./MenuButton";
// CATEGORIES
import Categories from "./Categories";
// SUB-CATEGORIES
import SubCategories from "./SubCategories";
//* NPMS
import $ from "jquery";
//* CSS
import "../../../css/header//menu/menu.css";
const Menu = () => {
  const mouseEnterHandle = () => {
    $("#categories-section").css("transform", "scale(1)");
  };
  const mouseLeaveHandle = () => {
    $("#categories-section").css("transform", "scale(0)");
  };
  return (
    <section
      id="menu-section"
      onMouseEnter={() => mouseEnterHandle()}
      onMouseLeave={() => mouseLeaveHandle()}
    >
      <MenuButton />
      <Categories />
      <SubCategories />
    </section>
  );
};

export default Menu;
