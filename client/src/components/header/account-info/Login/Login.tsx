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
  const stateUnderline1 = state.css.underlineWidth1;
  const stateUnderline2 = state.css.underlineWidth2;
  const stateTransitionMs = state.css.transitionMs;
  // LOGIN ENTER ANIMATION
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

  const mouseLeaveHandle = () => {
    $("#login-button-div")
      .children(".underline")
      .stop()
      .animate({ width: stateUnderline1 }, stateTransitionMs);
  };
  return (
    <section id="login-section" onMouseLeave={() => mouseLeaveHandle()}>
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
