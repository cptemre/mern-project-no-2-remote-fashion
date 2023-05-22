import { useContext, useState, useEffect } from "react";
//* UTILITIES
import { Context } from "../../../../utilities/local-variables/Context";
//* NPMS
import $ from "jquery";
//* CSS
import "../../../../css/header/account-info/login/login-area-links.css";

const LoginAreaLinks = () => {
  // LOCAL VARIABLES
  const register = "REGISTER";
  const forgotPassword = "FORGOT MY PASSWORD";
  const login = "LOGIN";
  // STATE
  const { state, dispatch } = useContext(Context);

  const mouseEnterHandle = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    $(e.currentTarget).css({
      color: "black",
    });
  };
  const mouseLeaveHandle = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    $(e.currentTarget).css({
      color: "var(--soft-black-1)",
    });
  };
  const mouseDownHandle = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const innerHTML = $(e.currentTarget).html();
    if (innerHTML !== register) {
      console.log("a");

      dispatch({
        type: "IS_FORGOT_PASSWORD",
        payload: !state.booleans.isForgotPassword,
      });
    }
  };
  return (
    <section id="login-area-links-section">
      <article
        id="register-link-article"
        onMouseEnter={(e) => mouseEnterHandle(e)}
        onMouseLeave={(e) => mouseLeaveHandle(e)}
        onMouseDown={(e) => mouseDownHandle(e)}
      >
        {register}
      </article>
      {!state.booleans.isForgotPassword && (
        <article
          id="forgot-password-link-article"
          onMouseEnter={(e) => mouseEnterHandle(e)}
          onMouseLeave={(e) => mouseLeaveHandle(e)}
          onMouseDown={(e) => mouseDownHandle(e)}
        >
          {forgotPassword}
        </article>
      )}
      {state.booleans.isForgotPassword && (
        <article
          id="login-link-article"
          onMouseEnter={(e) => mouseEnterHandle(e)}
          onMouseLeave={(e) => mouseLeaveHandle(e)}
          onMouseDown={(e) => mouseDownHandle(e)}
        >
          {login}
        </article>
      )}
    </section>
  );
};

export default LoginAreaLinks;
