import React from "react";
//* COMPONENTS
// NEW PRODUCTS
import NewButton from "./new-button/HomeButton";
// CATEGORIES MENU
import Menu from "./menu/Menu";
// SEARCH BAR
import SearchBar from "./search-bar/SearchBar";
// CONTACT
import Contact from "./contact/Contact";
// LOGIN-REGISTER
import LoginRegister from "./login-register/LoginRegister";
//* CSS
import "../../../css/header/header-down/header-down.css";

const Header = () => {
  return (
    <section id="header-down-section">
      <NewButton />
      <Menu />
      <SearchBar />
      <Contact />
      <LoginRegister />
    </section>
  );
};

export default Header;
