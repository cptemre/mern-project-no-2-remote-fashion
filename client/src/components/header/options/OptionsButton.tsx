import { useContext } from "react";
//* UTILITIES
// CONTEXT
import { Context } from "../../../utilities/local-variables/Context";
//* CSS
import "../../../css/header/options/optionsButton.css";
//* FONT AWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCaretDown } from "@fortawesome/free-solid-svg-icons";

const OptionsButton = () => {
  // STATE
  const { state } = useContext(Context);

  return (
    <article id="option-button" className="option-article">
      {state.booleans.isOptionButton ? (
        <div id="option-button-text" className="option">
          OPTIONS
        </div>
      ) : (
        <>
          <div id="option-button-text" className="option">
            {state.options.selectedOption}
          </div>
          <div className="option-icon-div">
            <FontAwesomeIcon
              icon={faSquareCaretDown}
              className="icon arrow-icon"
            />
          </div>
        </>
      )}
    </article>
  );
};

export default OptionsButton;
