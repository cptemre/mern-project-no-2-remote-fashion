import $ from "jquery";

const backgroundColorChangeByIndex = ({
  domTarget,
  oddColor,
  evenColor,
}: {
  domTarget: (EventTarget & HTMLElement) | JQuery<HTMLElement>;
  oddColor: string;
  evenColor: string;
}) => {
  // INDEX OF THE ELEMENT
  const index = $(domTarget).index();
  // CHECK IF ODD OR EVEN
  const oddOrEven = index % 2;
  // CSS VARS ACCORDING TO ODD OR EVEN
  const backgroundColor = oddOrEven === 1 ? oddColor : evenColor;
  // CHANGE CURRENT CATEGORIES ARTICLE CSS
  $(domTarget).css({
    backgroundColor,
  });
  $(domTarget).children(".underline").stop().animate({ width: "10rem" }, 300);
};

export default backgroundColorChangeByIndex;
