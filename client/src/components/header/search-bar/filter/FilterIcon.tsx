//* COMPONENTS
// FILTERSEPERATOR
import FilterSeperator from "./FilterSeperator";
// FILTER AREA
import FilterArea from "./FilterArea";
//* FONT AWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
//* CSS
import "../../../../css/header/search-bar/filter/filter-icon.css";
const FilterIcon = () => {
  return (
    <section id="filter-icon-section">
      <article id="filter-icon-article">
        <div id="filter-icon-div">
          <FontAwesomeIcon icon={faFilter} />
        </div>
        <FilterSeperator />
        <FilterArea />
      </article>
    </section>
  );
};

export default FilterIcon;
