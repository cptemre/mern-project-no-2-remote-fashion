//* COMPONENTS
// FILTER
import Filter from "./filter/Filter";
// INPUT
import SearchInput from "./SearchInput";
//* CSS
import "../../../css/header/search-bar/search-bar.css";
const SearchBar = () => {
  return (
    <section id="search-bar-section">
      <Filter />
      <SearchInput />
    </section>
  );
};

export default SearchBar;
