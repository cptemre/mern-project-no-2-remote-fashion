import { useContext } from "react";
//* COMPONENTS
import SubOptions from "./SubOptions";
//* UTILITIES
// CONTEXT
import { Context } from "../../../utilities/local-variables/Context";
// INTERFACES
import { OptionsInterface } from "../../../utilities/interfaces/local-data/optionsInterfaces";
//* CSS
import "../../../css/header/options/options.css";
//* FONT AWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCaretDown } from "@fortawesome/free-solid-svg-icons";

const Options = () => {
  // STATE
  const { state } = useContext(Context);
  return (
    <section id="option-section">
      {Object.keys(state.options.allOptions.user).map((option, i) => {
        return (
          <article key={`option-article-${i}`} className="option-article">
            <div className="main-option-div">
              <div className="option">{option}</div>
              <div className="option-icon-div">
                <FontAwesomeIcon
                  icon={faSquareCaretDown}
                  className="icon arrow-icon"
                />
              </div>
            </div>
            <SubOptions option={option as keyof OptionsInterface["user"]} />
          </article>
        );
      })}
    </section>
  );
};

export default Options;
