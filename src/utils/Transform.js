import _ from "lodash";

const transform = {
  transform(items) {
    this.items = _.cloneDeep(items);
    this.result = _.cloneDeep(items);
    this._exludeFields = [];
    this._renames = [];
    this._processUserFunc = (itm) => itm;
    return this;
  },
  get() {
    this._process();
    return this.result;
  },
  process(fn) {
    if (typeof fn === "function") this._processUserFunc = fn;
    return this;
  },
  _process() {
    this.result = this.items.map((item) => {
      let processedItem = item;
      processedItem = this._processExclude(item);
      processedItem = this._processRename(item);
      processedItem = this._processUserFunc(item);
      return processedItem;
    });
  },
  exclude(fields) {
    this._exludeFields = [...this._exludeFields, ...fields];
    return this;
  },
  rename(from, to) {
    this._renames.push({ from, to });
    return this;
  },
  _processExclude(item) {
    this._exludeFields.forEach((field) => {
      delete item[field];
    });
    return item;
  },
  _processRename(item) {
    this._renames.forEach((rn) => {
      if (item.hasOwnProperty(rn.from)) {
        const val = _.cloneDeep(item[rn.from]);
        delete item[rn.from];
        item[rn.to] = val;
      }
    });
    return item;
  },
};

export default transform;
