import $ from "jquery";

export const determineNavStyling = (pathname) => {
  $(
    "#nav-dashboard, #nav-ordering, #nav-invoicing, #nav-reporting, #nav-resources, #nav-users",
  ).css({
    /* color: "#414042", */
    "border-bottom": "",
  });
  $("#nav-account").css({
    color: "black",
    "border-bottom": "",
  });
  let path = "";
  if (pathname === "/") {
    path = "nav-dashboard";
  } else if (pathname.includes("order")) {
    path = "nav-ordering";
  } else if (pathname.includes("invoicing")) {
    path = "nav-invoicing";
  } else if (pathname.includes("reporting")) {
    path = "nav-reporting";
  } else if (pathname.includes("resources")) {
    path = "nav-resources";
  } else if (pathname.includes("all-users")) {
    path = "nav-users";
  } else if (pathname.includes("account")) {
    path = "nav-account";
  } else {
    path = "";
  }
  if (path.length > 0 && path !== "nav-account") {
    $(`#${path}`).css({
      /*  color: "#ec710a", */
      /*"background-color": "white", */
      /*"border-bottom": "solid #7ed4f7", */
    });
  } else if (path.length > 0 && path === "nav-account") {
    $(`#${path}`).css({
      color: "white",
      "background-color": "transparent",
      "border-bottom": "5px solid #7ed4f7",
    });
  }
};
