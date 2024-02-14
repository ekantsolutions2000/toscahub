import Pagination from "react-js-pagination";
import React from "react";
import "./paginator.css";
import { pagination_icons } from "../../images";

const pag_styles = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bolder",
    margin: 0,
    padding: 0,
  },
  pipe_styles = {
    position: "absolute",
    fontWeight: "bolder",
    fontSize: "15px",
    color: "rgb(236, 113, 10)",
    margin: 0,
    lineHeight: "100%",
    alignItems: "center",
    padding: 0,
  };

const Paginator = {
  paginate(items, currentPage = 1, perPage = 10, pageRangeDisplayed = 6) {
    this.items = items;
    this.perPage = perPage;
    this.currentPageIndex = currentPage - 1; //1
    this.pageRangeDisplayed = pageRangeDisplayed;
    return this;
  },
  getStartIndex() {
    return this.currentPageIndex > 0 ? this.currentPageIndex * this.perPage : 0;
  },
  getEndIndex() {
    let endIndex = (this.currentPageIndex + 1) * this.perPage;
    return endIndex;
  },
  getItems() {
    return this.items.slice(this.getStartIndex(), this.getEndIndex());
  },
  showNextLink() {
    return this.items.length > this.getEndIndex() + 1;
  },
  showPrevLink() {
    return this.currentPageIndex !== 0;
  },
  getPageOptions() {
    let selectList = [];

    if (this.items.length !== 0) {
      for (let i = 1; i <= Math.ceil(this.items.length / this.perPage); i++)
        selectList.push({ value: i, label: i.toString() });
    }
    return selectList;
  },
  links(onChange) {
    const { LeftArrow, RightArrow } = pagination_icons;
    return (
      <Pagination
        activePage={this.currentPageIndex + 1}
        itemsCountPerPage={this.perPage}
        totalItemsCount={this.items.length}
        pageRangeDisplayed={this.pageRangeDisplayed}
        onChange={(num) => onChange(num)}
        firstPageText={this.FirstPageText(LeftArrow)}
        prevPageText={<img src={LeftArrow} alt="left arrow" />}
        nextPageText={<img src={RightArrow} alt="right arrow" />}
        lastPageText={this.LastPageText(RightArrow)}
        innerClass="custom-pagination pagination"
      />
    );
  },
  FirstPageText(arrow) {
    return (
      <div style={pag_styles}>
        <img style={{ margin: 0, padding: 0 }} src={arrow} alt="start arrow" />
        <p style={{ ...pipe_styles, right: "13px" }}>|</p>
      </div>
    );
  },
  LastPageText(arrow) {
    return (
      <div style={pag_styles}>
        <p style={{ ...pipe_styles, left: "13px" }}>|</p>
        <img style={{ margin: 0, padding: 0 }} src={arrow} alt="end arrow" />
      </div>
    );
  },
};

export default Paginator;
