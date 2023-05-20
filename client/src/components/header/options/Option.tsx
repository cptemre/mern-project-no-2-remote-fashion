import { useContext, useEffect } from "react";
//* COMPONENTS
import SubOptions from "./SubOptions";
//* UTILITIES
// CONTEXT
import { Context } from "../../../utilities/local-variables/Context";
// INTERFACES
import { OptionsInterface } from "../../../utilities/interfaces/local-data/optionsInterfaces";
//* NPMS
import $ from "jquery";
//* CSS
import "../../../css/header/options/options.css";
//* FONT AWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCaretDown } from "@fortawesome/free-solid-svg-icons";

const Options = () => {
  // STATE
  const { state } = useContext(Context);
  //
  useEffect(() => {
    // SET CURRENT TARGET CSS
    $(".option")
      .filter(function () {
        return $(this).html().trim() === state.options.selectedOption;
      })
      .parent(".main-option-div")
      .css({
        backgroundColor: "var(--orange-color-4)",
      });
  }, [state.options.selectedOption]);
  // OPTION MOUSE ENTER HANDLE
  const mouseEnterHandle = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    // SET CURRENT TARGET CSS
    $(e.currentTarget).css({
      backgroundColor: "var(--orange-color-4)",
    });
  };
  const mouseLeaveHandle = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    // SET CURRENT TARGET CSS
    $(e.currentTarget)
      .find(".main-option-div .option")
      .filter(function () {
        return $(this).html().trim() !== state.options.selectedOption;
      })
      .parent(".main-option-div")
      .css({
        backgroundColor: "var(--orange-color-1)",
      });
  };
  return (
    <section id="option-section">
      {Object.keys(state.options.allOptions.user).map((option, i) => {
        return (
          <article
            key={`option-article-${i}`}
            className="option-article"
            onMouseLeave={(e) => mouseLeaveHandle(e)}
          >
            <div
              className="main-option-div"
              onMouseEnter={(e) => mouseEnterHandle(e)}
            >
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
