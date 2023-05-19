import { useContext } from "react";
//* UTILITIES
// CONTEXT
import { Context } from "../../../utilities/local-variables/Context";
//* NPMS
import $ from "jquery";
//* CSS
import "../../../css/header/options/optionsButton.css";
//* FONT AWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDown } from "@fortawesome/free-solid-svg-icons";

const OptionsButton = () => {
  // STATE
  const { state } = useContext(Context);
  // CHANGE OPTION BUTTON

  // MOUSE ENTER HANDLE
  const mouseEnterHandle = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    $(e.currentTarget).html("OPTIONS");
  };
  return (
    <article
      id="option-button"
      className="option-article"
      onMouseEnter={(e) => mouseEnterHandle(e)}
    >
      <div className="option-div">
        <div id="option-button-text" className="option">
          PRODUCTS
        </div>
        <div className="underline"></div>
      </div>

      <div className="option-button-arrow">
        <FontAwesomeIcon icon={faCircleDown} />
      </div>
    </article>
  );
};

export default OptionsButton;
