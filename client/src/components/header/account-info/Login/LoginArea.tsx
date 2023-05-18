import { useState, useContext, useEffect } from "react";
//* COMPONENTS
import LoginAreaLinks from "./LoginAreaLinks";
//* UTILITIES
// CONTEXT
import { Context } from "../../../../utilities/local-variables/Context";
// INTERFACES
import { LoginInterface } from "../../../../utilities/interfaces/requests/loginInterface";
//* NPMS
import $ from "jquery";
//* CSS
import "../../../../css/header/account-info/login/login-area.css";

const LoginArea = () => {
  // INPUT VALUES
  const [inputValues, setInputValues] = useState<LoginInterface>({
    email: "",
    password: "",
  });
  // STATE
  const { state } = useContext(Context);
  // WHICH INPUT IS SELECTED TO FOCUS
  const [selectedInput, setSelectedInput] = useState<string>();
  // MOUSE ENTER AND FOCUS COMMON FUNCTION FOR STYLING
  const inputMouseEnterAndFocusFunction = (
    e:
      | React.MouseEvent<HTMLInputElement, MouseEvent>
      | React.FocusEvent<HTMLInputElement, Element>
  ) => {
    // DIFFERENT STYLING FOR INPUTS AND SUBMIT
    const inputType = $(e.currentTarget).attr("id") === "login-button";
    if (inputType) {
      $(e.currentTarget).css({
        backgroundColor: "var(--orange-color-1)",
        boxShadow: "0 0 0 0.1rem white",
        borderColor: "transparent",
      });
    } else {
      $(e.currentTarget).css({
        backgroundColor: "var(--soft-white-color-1)",
        boxShadow: "0 0 0 0.1rem black",
      });
    }
  };
  const inputMouseLeaveAndFocusOutFunction = (
    e:
      | React.MouseEvent<HTMLInputElement, MouseEvent>
      | React.FocusEvent<HTMLInputElement, Element>
  ) => {
    const inputType = $(e.currentTarget).attr("id") === "login-button";
    if (inputType) {
      $(e.currentTarget).css({
        backgroundColor: "var(--orange-color-3)",
        boxShadow: "none",
        borderColor: "black",
      });
    } else {
      const isNameSame = $(e.currentTarget).attr("name") === selectedInput;
      if (!isNameSame) {
        $(e.currentTarget).css({
          boxShadow: "none",
          backgroundColor: "var(--orange-color-3)",
        });
      }
    }
  };
  // SET ALL INPUTS EXCEPT SUBMIT TO INITIAL
  const inputInitialStyles = (
    e: React.FocusEvent<HTMLInputElement, Element>
  ) => {
    $(".login-input").css({
      boxShadow: "none",
      backgroundColor: "var(--orange-color-3)",
    });
  };
  // INPUT MOUSE ENTER HANDLE
  const mouseEnterHandle = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    inputMouseEnterAndFocusFunction(e);
  };
  const mouseLeaveHandle = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    inputMouseLeaveAndFocusOutFunction(e);
  };
  const focusHandle = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    inputInitialStyles(e);
    inputMouseEnterAndFocusFunction(e);
    setSelectedInput($(e.currentTarget).attr("name"));
  };
  const blurHandle = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    inputInitialStyles(e);
    inputMouseLeaveAndFocusOutFunction(e);
    setSelectedInput("");
  };

  return (
    <section id="login-area-section">
      <h1 id="login-area-header">
        {!state.booleans.isForgotPassword ? "LOGIN" : "RESET PASSWORD"}
      </h1>
      <h1 id="login-area-error">
        {!state.booleans.isError && "ERROR MESSAGE FOR LOGIN"}
      </h1>
      <form onSubmit={(e) => e.preventDefault()} id="login-form">
        <input
          type="email"
          className="login-input"
          name="email"
          placeholder="EMAIL"
          value={inputValues["email"]}
          onChange={(e) =>
            setInputValues({ ...inputValues, email: e.currentTarget.value })
          }
          onMouseEnter={(e) => mouseEnterHandle(e)}
          onMouseLeave={(e) => mouseLeaveHandle(e)}
          onFocus={(e) => focusHandle(e)}
          onBlur={(e) => blurHandle(e)}
        />
        {!state.booleans.isForgotPassword && (
          <input
            type="password"
            className="login-input"
            name="password"
            placeholder="PASSWORD"
            value={inputValues["password"]}
            onChange={(e) =>
              setInputValues({
                ...inputValues,
                password: e.currentTarget.value,
              })
            }
            onMouseEnter={(e) => mouseEnterHandle(e)}
            onMouseLeave={(e) => mouseLeaveHandle(e)}
            onFocus={(e) => focusHandle(e)}
            onBlur={(e) => blurHandle(e)}
          />
        )}
        <input
          type="submit"
          id="login-button"
          value="SUBMIT"
          onMouseEnter={(e) => mouseEnterHandle(e)}
          onMouseLeave={(e) => mouseLeaveHandle(e)}
          onFocus={(e) => focusHandle(e)}
          onBlur={(e) => blurHandle(e)}
        />
      </form>
      <LoginAreaLinks />
    </section>
  );
};

export default LoginArea;
