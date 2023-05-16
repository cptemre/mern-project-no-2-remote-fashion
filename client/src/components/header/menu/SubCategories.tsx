import { useContext, useEffect, useState } from "react";
//* UTILITIES
// LOCAL VARIABLES
import { Context } from "../../../utilities/local-variables/Context";
//* NPMS
import $ from "jquery";
//* CSS
import "../../../css/header/menu/sub-categories.css";
import { InitialStateInterface } from "../../../utilities/interfaces/local-data/initialStateInterface";
import backgroundColorChangeByIndex from "../../../utilities/functions/backgroundColorChangeByIndex";

const SubCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [subCategories, setSubCategories] = useState<
    InitialStateInterface["subCategories"]
  >({ MALE: [""], FEMALE: [""] });

  // USE REDUCER VALUES FROM CONTEXT
  const { state } = useContext(Context);

  useEffect(() => {
    setSelectedCategory(state.selectedCategory);
  }, [state.selectedCategory]);

  useEffect(() => {
    setSubCategories(state.subCategories);
  }, [state.subCategories]);

  // SUB CATEGORY DIV MOUSE ENTER FUNCTION
  const mouseEnterHandle = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    // CURRENT TARGET ANIMATION
    $(e.currentTarget).css("background-color", "var(--soft-white-color-1)");

    // CURRENT TARGET'S UNDERLINE ANIMATION
    $(e.currentTarget)
      .children(".underline")
      .stop()
      .animate({ width: state.underlineWidth2 }, state.transitionMs);

    // CHANGE BACKGROUND COLOR
    const domTarget = `.categories-article:contains('${selectedCategory}')`;
    const oddColor = "var(--dark-orange-color-1)";
    const evenColor = "var(--soft-white-color-1)";
    backgroundColorChangeByIndex({
      domTarget: $(domTarget),
      oddColor,
      evenColor,
    });
  };
  // SUB CATEGORY DIV MOUSE ENTER FUNCTION
  const mouseLeaveHandle = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    // CURRENT TARGET BACKGROUND COLOR CHANGE
    const backgroundColor =
      $(e.currentTarget).attr("class") === "sub-categories-gender"
        ? "var(--orange-color-2)"
        : "white";
    $(e.currentTarget).css("background-color", backgroundColor);

    // CURRENT TARGET'S UNDERLINE ANIMATION
    $(e.currentTarget)
      .children(".underline")
      .stop()
      .animate({ width: state.underlineWidth1 }, state.transitionMs);
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
