import { useContext } from "react";
//* COMPONENTS
// LOGIN AREA
import LoginArea from "./LoginArea";
import { Context } from "../../../../utilities/local-variables/Context";
//* NPMS
import $ from "jquery";
//* CSS
import "../../../../css/header/account-info/login/login.css";

const Login = () => {
  // STATE
  const { state } = useContext(Context);
  // STATE VARIABLES
  const stateUnderline2 = state.css.underlineWidth2;
  const stateTransitionMs = state.css.transitionMs;
  const mouseEnterHandle = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    $(e.currentTarget).children(".underline").stop().animate(
      {
        width: stateUnderline2,
      },
      stateTransitionMs
    );
  };

  return (
    <section id="login-section">
      <article id="login-article">
        <div id="login-button-div" onMouseEnter={(e) => mouseEnterHandle(e)}>
          <div id="login-div">LOGIN</div>
          <div className="underline"></div>
        </div>
        <LoginArea />
      </article>
    </section>
  );
};

export default Login;
