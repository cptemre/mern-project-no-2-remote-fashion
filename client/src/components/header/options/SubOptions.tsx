import { useContext, useEffect } from "react";
//* UTILITIES
// CONTEXT
import { Context } from "../../../utilities/local-variables/Context";
// INTERFACES
import { OptionsInterface } from "../../../utilities/interfaces/local-data/optionsInterfaces";
//* NPMS
import $ from "jquery";
//* CSS
import "../../../css/header/options/subOptions.css";
//* FONT AWESOME
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const SubOptions = ({ option }: { option: keyof OptionsInterface["user"] }) => {
  // STATE
  const { state, dispatch } = useContext(Context);
  // SUB OPTIONS
  const subOptions =
    state.options.allOptions.user[option as keyof OptionsInterface["user"]];

  useEffect(() => {
    //* SET ALL SUB OPTIONS TO INITIAL STATE
    // SET BACK BACKGROUND
    $(".sub-option-article").css({
      backgroundColor: "var(--orange-color-2)",
    });
    // UNDERLINE
    $(".sub-option-div")
      .children(".underline")
      .stop()
      .animate({ width: state.css.underlineWidth1 }, state.css.transitionMs);
    // SET BACK ICONS
    $(".circle-icon").css({
      color: "white",
    });
    //* SET SELECTED SUB OPTION CSS
    // FILTER SELECTED SUB OPTION
    const selectedSubOption = $(".sub-option-div")
      .find(".option")
      .filter(function () {
        return $(this).html().trim() === state.options.selectedSubOption;
      });
    // SET SELECTED TARGET TO DIFFERENT BACKGROUND COLOR THAN OTHERS
    selectedSubOption.parent().parent().css({
      backgroundColor: "var(--soft-white-color-2)",
    });
    // LONGER WIDTH
    selectedSubOption
      .siblings(".underline")
      .stop()
      .animate({ width: state.css.underlineWidth2 }, state.css.transitionMs);
    // SELECTED ICON COLOR CHANGE
    selectedSubOption
      .parent()
      .siblings(".option-icon-div")
      .children(".circle-icon")
      .css({
        color: "var(--orange-color-1)",
      });
  }, [state.options.selectedSubOption]);
  const mouseEnterHandle = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    // SET CURRENT TARGET TO DIFFERENT BACKGROUND COLOR
    $(e.currentTarget).css({
      backgroundColor: "var(--soft-white-color-2)",
    });
    // SET CURRENT UNDERLINE WIDTH LONGER
    $(e.currentTarget)
      .find(".sub-option-div .underline")
      .stop()
      .animate({ width: state.css.underlineWidth2 }, state.css.transitionMs);
  };

  const mouseLeaveHandle = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    // HTML OF CURRENT SUB OPTION
    const subOptionHTML = $(e.currentTarget)
      .find(".sub-option-div .option")
      .html();
    // COMPARE IF IT IS SELECTED ALREADY
    const isSelected = subOptionHTML === state.options.selectedSubOption;
    // IF IT IS NOT SELECTED
    if (!isSelected) {
      // SET CURRENT TARGET TO  INITIAL BACKGROUND COLOR
      $(e.currentTarget).css({
        backgroundColor: "var(--orange-color-2)",
      });
      // SET CURRENT UNDERLINE WIDTH SHORTER
      $(e.currentTarget)
        .find(".sub-option-div .underline")
        .stop()
        .animate({ width: state.css.underlineWidth1 }, state.css.transitionMs);
    }
  };
  const mouseUpHandle = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    // SELECTED SUB OPTION HTML
    const subOptionHTML = $(e.currentTarget)
      .find(".sub-option-div .option")
      .html();
    // SET SELECTED SUB OPTION IN THE STATE
    dispatch({ type: "SELECTED_SUB_OPTION", payload: subOptionHTML });
    // SET SELECTED OPTION IN THE STATE
    dispatch({ type: "SELECTED_OPTION", payload: option });
  };
  return (
    <section className="sub-options-section">
      {subOptions.map((subOption, i) => (
        <article
          key={`sub-option-article-${i}`}
          className="sub-option-article"
          onMouseEnter={(e) => mouseEnterHandle(e)}
          onMouseLeave={(e) => mouseLeaveHandle(e)}
          onMouseUp={(e) => mouseUpHandle(e)}
        >
          <div className="sub-option-div">
            <div className="option">{subOption}</div>
            <div className="underline"></div>
          </div>
          <div className="option-icon-div">
            <FontAwesomeIcon icon={faCircle} className="icon circle-icon" />
          </div>
        </article>
      ))}
    </section>
  );
};

export default SubOptions;
