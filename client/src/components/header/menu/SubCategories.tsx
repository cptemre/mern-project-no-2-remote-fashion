import React from "react";
//* CSS
import "../../../css/header/menu/sub-categories.css";

const SubCategories = () => {
  const categories = ["MALE", "FEMALE"];
  const subCategories = ["CAT1", "CAT2"];

  return (
    <section id="sub-categories-section">
      {categories.map((category, i) => (
        <article
          key={`sub-categories-article-${i}`}
          className="sub-categories-article"
        >
          <div className="sub-categories-gender">
            <div className="category">{category}</div>
            <div className="underline"></div>
          </div>
          <div className="sub-categories-div">
            {subCategories.map((subCategory, j) => (
              <div
                key={`sub-category-div-${i}-${j}`}
                className="sub-category-div"
              >
                <div className="sub-category">{subCategory}</div>
                <div className="underline"></div>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
};

export default SubCategories;
