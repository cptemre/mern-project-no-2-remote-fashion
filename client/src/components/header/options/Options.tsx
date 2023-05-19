//* COMPONENTS
import Option from "./Option";
import OptionsButton from "./OptionsButton";
//* CSS
import "../../../css/header/options/option.css";

const Options = () => {
  return (
    <section id="options-section">
      <OptionsButton />
      <Option />
    </section>
  );
};

export default Options;
