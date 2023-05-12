import React from "react";
//* COMPONENTS
// NEW PRODUCTS
import NewButton from "./home-button/HomeButton";
// CATEGORIES MENU
import Menu from "./menu/Menu";
// SEARCH BAR
import SearchBar from "./search-bar/SearchBar";
// OPTIONS
import Options from "./options/Options";
// CONTACT
import Contact from "./contact/Contact";
// LOGIN-REGISTER
import LoginRegister from "./login-register/LoginRegister";
//* CSS
import "../../css/header/header.css";

const Header = () => {
  return (
    <header id="header-section">
      <NewButton />
      <Menu />
      <SearchBar />
      <Options />
      <Contact />
      <LoginRegister />
    </header>
  );
};

export default Header;
