//* CSS
import "../../../css/header//menu/menu-button.css";
const MenuButton = () => {
  const rows = [...Array(3)];

  return (
    <section id="menu-button-section">
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
