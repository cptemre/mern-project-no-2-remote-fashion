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
import { faSquareCaretDown } from "@fortawesome/free-solid-svg-icons";

const OptionsButton = () => {
  // STATE
  const { state, dispatch } = useContext(Context);
  // MOUSE ENTER HANDLE
  const mouseEnterHandle = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    // SET IS OPTION BUTTON BOOLEAN TO TRUE
    dispatch({
      type: "IS_OPTION_BUTTON",
      payload: true,
    });
    // CHANGE CSS
    $(e.currentTarget).css({
      backgroundColor: "var(--dark-orange-color-1)",
    });
  };

  return (
    <article
      id="option-button"
      className="option-article"
      onMouseEnter={(e) => mouseEnterHandle(e)}
    >
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
