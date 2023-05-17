import { useContext } from "react";
//* COMPONENTS
import { Context } from "../../../utilities/local-variables/Context";
//* NPMS
import $ from "jquery";
//* CSS
import "../../../css/header/account-info/login.css";

const Login = () => {
  // STATE
  const { state } = useContext(Context);
  const mouseEnterHandle = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    $(e.currentTarget).children(".underline").stop().animate(
      {
        width: state.css.underlineWidth2,
      },
      state.css.transitionMs
    );
  };

  return (
    <section id="login-section">
      <article id="login-article">
        <div id="login-button-div" onMouseEnter={(e) => mouseEnterHandle(e)}>
          <div id="login-div">LOGIN</div>
          <div className="underline"></div>
        </div>
      </article>
    </section>
  );
};

export default Login;
