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
// CURRENCY
import Currency from "./currency/Currency";
// LOGIN-REGISTER
import AccountInfo from "./account-info/AccountInfo";

const Header = () => {
  return (
    <header id="header-section">
      <NewButton />
      <Menu />
      <SearchBar />
      <Options />
      <Contact />
      <Currency />
      <AccountInfo />
    </header>
  );
};

export default Header;
