import { useContext } from "react";
//* COMPONENTS
import Option from "./Option";
import OptionsButton from "./OptionsButton";
//* UTILITIES
// CONTEXT
import { Context } from "../../../utilities/local-variables/Context";
//* NPMS
import $ from "jquery";
//* CSS
import "../../../css/header/options/option.css"; // DONT DELETE THIS

const Options = () => {
  // STATE
  const { dispatch } = useContext(Context);

  // MOUSE LEAVE HANDLE TO CHANGE OPTION BUTTON CSS
  const mouseLeaveHandle = () => {
    // SET IS OPTION BUTTON BOOLEAN TO FALSE
    dispatch({
      type: "IS_OPTION_BUTTON",
      payload: false,
    });
    // SET OPTION BUTTON BACKGROUND COLOR TO INITIAL
    $("#option-button").css({
      backgroundColor: "var(--orange-color-1)",
    });
  }; // MOUSE ENTER HANDLE TO CHANGE OPTION BUTTON CSS
  const mouseEnterHandle = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    // SET IS OPTION BUTTON BOOLEAN TO TRUE
    dispatch({
      type: "IS_OPTION_BUTTON",
      payload: true,
    });
    // CHANGE CSS
    $(e.currentTarget).children("#option-button").css({
      backgroundColor: "var(--dark-orange-color-1)",
    });
  };
  return (
    <section
      id="options-section"
      onMouseEnter={(e) => mouseEnterHandle(e)}
      onMouseLeave={() => mouseLeaveHandle()}
    >
      <OptionsButton />
      <Option />
    </section>
  );
};

export default Options;
