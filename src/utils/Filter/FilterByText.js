import _ from "lodash";
import React from "react";
import Highlighter from "react-highlight-words";
import moment from "moment";

const FilterByText = {
  filter(items, fields = []) {
    this._fields = fields;
    this.items = _.cloneDeep(items);
    this.filteredItems = _.cloneDeep(items);
    this.shouldHighlight = true;
    this._keyword = "";
    // this._where = undefined
    this._whereList = [];
    return this;
  },
  highlight(shouldHighlight = true) {
    this.shouldHighlight = shouldHighlight;
    return this;
  },
  keyword(key, fields = []) {
    this._keyword = key;
    if (fields.length) {
      this._fields = fields;
    }
    return this;
  },
  where(fn) {
    // this._where = fn;
    this._whereList.push(fn);
    return this;
  },
  whereBetweenDate(field, range) {
    if (!range || _.isEmpty(range) || !field) return this;

    const minDate = moment.utc(
      _.get(range, "min", "01 Jan 1200") || "01 Jan 1200",
    );
    const maxDate = moment.utc(
      _.get(range, "max", "01 Jan 5000") || "01 Jan 5000",
    );

    const fn = (item) => {
      let dateFieldValue = item[field];
      if (!dateFieldValue) {
        return false;
      }
      return moment
        .utc(dateFieldValue)
        .isBetween(minDate, maxDate, "day", "[]");
    };

    this._whereList.push(fn);
    return this;
  },
  whereBetween(field, range) {
    if (!range || _.isEmpty(range) || !field) return this;

    const min = _.get(range, "min", -Infinity) || -Infinity;
    const max = _.get(range, "max", +Infinity) || +Infinity;

    const fn = (item) => {
      const fieldValue = item[field];
      if (fieldValue === null || fieldValue === undefined) {
        return false;
      }
      return fieldValue >= min && fieldValue <= max;
    };

    this._whereList.push(fn);
    return this;
  },
  whereIn(field, values) {
    if (!values || _.isEmpty(values) || !field) return this;

    const fn = (item) => {
      const fieldValue = item[field];
      if (values === null || fieldValue === undefined) {
        return false;
      }
      return values.includes(fieldValue)
    };

    this._whereList.push(fn);
    return this;
  },
  _filterByWhere() {
    if (this._whereList.length === 0) {
      return;
    }

    this.filteredItems = this.filteredItems.filter((order) => {
      let result = true;

      for (let i = 0; i < this._whereList.length; i++) {
        if (typeof this._whereList[i] === "function") {
          result = this._whereList[i](order) && result;
          if (!result) break;
        } else {
          throw new Error("Please provide a function for where clause");
        }
      }
      return result;
    });
  },
  _highlightText(content, keywords) {
    return (
      <Highlighter
        highlightClassName="tw-bg-yellow-200 tw-p-0"
        searchWords={keywords}
        autoEscape={true}
        textToHighlight={content.toString()}
        orgcontent={content}
      />
    );
  },
  matchWords(subject, wordsToSearch) {
    let words = _.cloneDeep(wordsToSearch);
    var regexMetachars = /[(){[*+?.\\^$|]/g;

    for (var i = 0; i < words.length; i++) {
      words[i] = words[i].replace(regexMetachars, "\\$&");
    }

    // var regex = new RegExp("\\b(?:" + words.join("|") + ")\\b", "gi");
    var regex = new RegExp("(?:" + words.join("|") + ")", "gi");

    let result = subject.match(regex) || [];
    return result.length ? true : false;
  },
  _filterByKeyWordAndHighlight() {
    let searchFields = this._fields;
    let searchStringArray = this._keyword.toLowerCase().trim().split(" ");

    if (this._keyword === "" || !searchFields.length) {
      return;
    }

    this.filteredItems = this.filteredItems.filter((itemRow) => {
      let includeThisRow = false;

      searchFields.forEach((field) => {
        if (_.get(itemRow[field], "props.orgcontent", null) !== null) {
          itemRow[field] = itemRow[field].props.orgcontent;
        }
        let fieldContent = itemRow[field] || "";

        let matchFound =
          itemRow[field] &&
          this.matchWords(fieldContent.toString(), searchStringArray);
        if (matchFound && this.shouldHighlight) {
          itemRow[field] = this._highlightText(fieldContent, searchStringArray);
        }
        includeThisRow = includeThisRow || matchFound;
      });
      return includeThisRow;
    });
  },
  get() {
    this._filterByWhere();
    this._filterByKeyWordAndHighlight();
    return this.filteredItems;
  },
};

export default FilterByText;
