import { useContext, useEffect, useState } from "react";
//* UTILITIES
// LOCAL VARIABLES
import { Context } from "../../../utilities/local-variables/Context";
//* NPMS
import $ from "jquery";
//* CSS
import "../../../css/header/menu/sub-categories.css";
import { InitialStateInterface } from "../../../utilities/interfaces/local-data/initialStateInterface";

const SubCategories = () => {
  const [subCategories, setSubCategories] = useState<
    InitialStateInterface["category"]["subCategories"]
  >({ MALE: [""], FEMALE: [""] });

  // USE REDUCER VALUES FROM CONTEXT
  const { state } = useContext(Context);
  // STATE VARIABLES
  const stateSubCategory = state.category.subCategories;
  const stateUnderline1 = state.css.underlineWidth1;
  const stateUnderline2 = state.css.underlineWidth2;
  const stateTransitionMs = state.css.transitionMs;

  useEffect(() => {
    setSubCategories(stateSubCategory);
  }, [stateSubCategory]);

  // SUB CATEGORY DIV MOUSE ENTER FUNCTION
  const mouseEnterHandle = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    // CURRENT TARGET BACKGROUND COLOR
    $(e.currentTarget).css("background-color", "var(--soft-white-color-1)");

    //* UNDERLINE WIDTH CHANGE
    // SUB-CATEGORY ALL UNDERLINE WIDTH TO INITIAL
    $(".sub-categories-article")
      .find("div .underline")
      .stop()
      .animate({ width: stateUnderline1 }, stateTransitionMs);
    // CURRENT TARGET'S UNDERLINE WIDTH
    $(e.currentTarget)
      .children(".underline")
      .stop()
      .animate({ width: stateUnderline2 }, stateTransitionMs);
  };
  // SUB CATEGORY DIV MOUSE ENTER FUNCTION
  const mouseLeaveHandle = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    //* CURRENT TARGET BACKGROUND COLOR CHANGE
    // CHECK CLASS
    const backgroundColor =
      $(e.currentTarget).attr("class") === "sub-categories-gender"
        ? "var(--orange-color-2)"
        : "white";
    // USE CSS
    $(e.currentTarget).css("background-color", backgroundColor);
  };

  return (
    <section id="sub-categories-section">
      {(Object.keys(subCategories) as Array<keyof typeof subCategories>).map(
        (gender, i) => (
          <article
            key={`sub-categories-article-${i}`}
            className="sub-categories-article"
          >
            <div
              className="sub-categories-gender"
              onMouseEnter={(e) => mouseEnterHandle(e)}
              onMouseLeave={(e) => mouseLeaveHandle(e)}
            >
              <div className="category">{gender}</div>
              <div className="underline"></div>
            </div>
            <div className="sub-categories-div">
              {subCategories[gender].map((subCategory, j) => {
                return (
                  <div
                    key={`sub-category-div-${i}-${j}`}
                    className="sub-category-div"
                    onMouseEnter={(e) => mouseEnterHandle(e)}
                    onMouseLeave={(e) => mouseLeaveHandle(e)}
                  >
                    <div className="sub-category">{subCategory}</div>
                    <div className="underline"></div>
                  </div>
                );
              })}
            </div>
          </article>
        )
      )}
    </section>
  );
};

export default SubCategories;
