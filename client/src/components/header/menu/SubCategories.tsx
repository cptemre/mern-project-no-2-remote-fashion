import React from "react";
//* CSS
import "../../../css/header/menu/sub-categories.css";

const SubCategories = () => {
  const categories = ["MALE", "FEMALE"];
  const subCategories = ["CAT1", "CAT2"];

  return (
    <section id="sub-categories-section">
      {categories.map((category) => (
        <article className="sub-categories-article">
          <div className="sub-categories-gender">{category}</div>
          <div className="sub-categories-div">
            {subCategories.map((subCategory) => (
              <>
                <div className="subCategory">{subCategory}</div>
                <div className="login-div-underline"></div>
              </>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
};

export default SubCategories;
