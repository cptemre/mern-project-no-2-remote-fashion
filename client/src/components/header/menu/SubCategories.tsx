import { useContext, useEffect, useState } from "react";
//* UTILITIES
// LOCAL VARIABLES
import { Context } from "../../../utilities/local-variables";
//* NPMS
import $ from "jquery";
//* CSS
import "../../../css/header/menu/sub-categories.css";
import { InitialStateInterface } from "../../../utilities/interfaces/local-data";

const SubCategories = () => {
  const [subCategories, setSubCategories] = useState<
    InitialStateInterface["subCategories"]
  >({});

  // USE REDUCER VALUES FROM CONTEXT
  const { state } = useContext(Context);

  // GET SUBCATEGORIES FROM THE STATE
  const stateSubCategories = state.subCategories;
  useEffect(() => {
    setSubCategories(stateSubCategories);
  }, [stateSubCategories]);

  // SUB CATEGORY DIV MOUSE ENTER FUNCTION
  const subCategoryDivMouseEnter = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    // CURRENT TARGET ANIMATION
    $(e.currentTarget).css("background-color", "var(--white-color-2)");

    // CURRENT TARGET'S UNDERLINE ANIMATION
    $(e.currentTarget)
      .children(".underline")
      .animate({ width: "5rem" }, 300)
      .css("border-color", "red");
  };
  // SUB CATEGORY DIV MOUSE ENTER FUNCTION
  const subCategoryDivMouseLeave = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    // CURRENT TARGET ANIMATION
    $(e.currentTarget).css("background-color", "var(--white-color-1)");

    // CURRENT TARGET'S UNDERLINE ANIMATION
    $(e.currentTarget)
      .children(".underline")
      .animate({ width: 0 }, 300, function () {
        $(this).css("border-color", "transparent");
      });
  };
  return (
    <section id="sub-categories-section">
      {Object.keys(subCategories).map((gender, i) => (
        <article
          key={`sub-categories-article-${i}`}
          className="sub-categories-article"
        >
          <div className="sub-categories-gender">
            <div className="category">{gender}</div>
            <div className="underline"></div>
          </div>
          <div className="sub-categories-div">
            {subCategories[gender].map((subCategory, j) => {
              return (
                <div
                  key={`sub-category-div-${i}-${j}`}
                  className="sub-category-div"
                  onMouseEnter={(e) => subCategoryDivMouseEnter(e)}
                  onMouseLeave={(e) => subCategoryDivMouseLeave(e)}
                >
                  <div className="sub-category">{subCategory}</div>
                  <div className="underline"></div>
                </div>
              );
            })}
          </div>
        </article>
      ))}
    </section>
  );
};

export default SubCategories;
