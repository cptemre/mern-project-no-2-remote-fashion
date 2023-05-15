//* NPMS
import $ from "jquery";
//* CSS
import "../../../css/header//menu/menu-button.css";
const MenuButton = () => {
  const rows = [...Array(3)];

  const mouseEnterHandle = () => {
    $(".menu-button-dot").css("border-color", "white");
  };
  const mouseLeaveHandle = () => {
    $(".menu-button-dot").css("border-color", "var(--orange-color-1)");
  };
  return (
    <section
      id="menu-button-section"
      className="border-radius transition-02"
      onMouseEnter={() => mouseEnterHandle()}
      onMouseLeave={() => mouseLeaveHandle()}
    >
      {rows.map((row, i) => (
        <article key={`menu-button-row-${i}`} className="menu-button-row">
          {rows.map((dot, j) => (
            <div
              key={`menu-button-dot-${i}-${j}`}
              className="menu-button-dot"
            ></div>
          ))}
        </article>
      ))}
    </section>
  );
};

export default MenuButton;
