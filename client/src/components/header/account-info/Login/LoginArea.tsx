import { useState } from "react";
//* COMPONENTS
import LoginAreaLinks from "./LoginAreaLinks";
//* NPMS
import $ from "jquery";
//* CSS
import "../../../../css/header/account-info/login/login-area.css";

const LoginArea = () => {
  const [selectedInput, setSelectedInput] = useState<string>();
  // INPUT MOUSE ENTER HANDLE
  const mouseEnterHandle = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
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
  const mouseLeaveHandle = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
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
  const focusHandle = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    $(e.currentTarget).css({
      boxShadow: "0 0 0 0.1rem black",
      backgroundColor: "var(--soft-white-color-1)",
    });
    const name = $(e.currentTarget).attr("name");
    setSelectedInput(name);
  };
  const blurHandle = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    $(e.currentTarget).css({
      boxShadow: "none",
      backgroundColor: "var(--orange-color-3)",
    });
    setSelectedInput("");
  };
  return (
    <section id="login-area-section">
      <form onSubmit={(e) => e.preventDefault()} id="login-form">
        <input
          type="email"
          className="login-input"
          name="email"
          placeholder="EMAIL"
          onMouseEnter={(e) => mouseEnterHandle(e)}
          onMouseLeave={(e) => mouseLeaveHandle(e)}
          onFocus={(e) => focusHandle(e)}
          onBlur={(e) => blurHandle(e)}
        />
        <input
          type="password"
          className="login-input"
          name="password"
          placeholder="PASSWORD"
          onMouseEnter={(e) => mouseEnterHandle(e)}
          onMouseLeave={(e) => mouseLeaveHandle(e)}
          onFocus={(e) => focusHandle(e)}
          onBlur={(e) => blurHandle(e)}
        />
        <input
          type="submit"
          id="login-button"
          value="SUBMIT"
          onMouseEnter={(e) => mouseEnterHandle(e)}
          onMouseLeave={(e) => mouseLeaveHandle(e)}
        />
      </form>
      <LoginAreaLinks />
    </section>
  );
};

export default LoginArea;
