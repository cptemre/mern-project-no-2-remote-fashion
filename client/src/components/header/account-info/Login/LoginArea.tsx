//* COMPONENTS
import LoginAreaLinks from "./LoginAreaLinks";
//* CSS
import "../../../../css/header/account-info/login/login-area.css";

const LoginArea = () => {
  return (
    <section id="login-area-section">
      <form onSubmit={(e) => e.preventDefault()} id="login-form">
        <input
          type="email"
          className="login-input"
          name="email"
          placeholder="EMAIL"
        />
        <input
          type="password"
          className="login-input"
          name="password"
          placeholder="PASSWORD"
        />
        <input type="submit" id="login-button" value="SUBMIT" />
      </form>
      <LoginAreaLinks />
    </section>
  );
};

export default LoginArea;
