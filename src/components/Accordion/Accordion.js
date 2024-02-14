import React, { Component, cloneElement } from "react";

export class Accordion extends Component {
  state = {
    activeItemIndex: this.props.activeItemIndex.value,
  };

  componentWillUnmount() {
    this.props.activeItemIndex.sync(0);
  }

  componentDidMount() {
    if (this.props.activeItemIndex._internal_use_default) {
      this.props.activeItemIndex.sync(0);
      this.forceUpdate();
    }
  }

  navigateTo = (index) => {
    this.props.activeItemIndex.sync(index);
    this.forceUpdate();
  };

  static getDerivedStateFromProps(props, state) {
    return { indexChangedInternally: false };
  }

  cloneChildren = (elm, index) => {
    return cloneElement(elm, {
      index: index,
      isOpen: index === this.props.activeItemIndex.value,
      headerClass:
        this.props.activeItemIndex.value === index
          ? "tw-bg-gray-600 tw-p-2 tw-border-b-2 tw-text-gray-200 tw-font-medium tw-text-lg tw-px-4 tw-cursor-pointer active-header"
          : "tw-cursor-pointer tw-bg-gray-400 tw-p-2 tw-border-b-2 tw-font-medium tw-text-lg tw-px-4 inactive-header",
      navigateTo: this.navigateTo,
      activeIndex: this.props.activeItemIndex.value,
      ...elm.props,
    });
  };

  render() {
    return this.props.children.length
      ? this.props.children.map((item, index) => (
          <React.Fragment key={index}>
            {this.cloneChildren(item, index)}
          </React.Fragment>
        ))
      : this.cloneChildren(this.props.children, 0);
  }
}

Accordion.defaultProps = {
  activeItemIndex: {
    value: 0,
    _internal_use_default: true,
    sync: function (val) {
      this.value = val;
    },
  },
};

export default Accordion;
