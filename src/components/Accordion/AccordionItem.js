import React, { Component } from "react";
import PropTypes from "prop-types";
export class AccordionItem extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  state = {
    visible: this.props.visibleOnLoad,
  };

  static getDerivedStateFromProps(props, state) {
    return { isOpened: props.isOpen && state.visible };
  }

  onHeaderClick = () => {
    //Clicking on the same item/ toggle it
    if (this.props.activeIndex === this.props.index) {
      this.setState({ visible: !this.state.visible });
      return;
    }

    if (this.props.shouldNavigate(this.props.activeIndex, this.props.index)) {
      this.props.navigateTo(this.props.index);
    }
  };

  accordionClasses = () => {
    if (typeof this.props.itemHeaderClass === "function") {
      return this.props.itemHeaderClass(this);
    }

    return this.props.headerClass;
  };

  getHeader = () => {
    if (typeof this.props.header === "function") {
      return this.props.header(this);
    }
    return this.props.header;
  };

  render() {
    let data = { ...this.state, navigateTo: this.props.navigateTo };
    return (
      <div>
        <div className={this.accordionClasses()} onClick={this.onHeaderClick}>
          {this.getHeader()}
        </div>
        {this.state.isOpened ? (
          <div
            className={`tw-bg-white tw-mx-auto tw-rounded ${
              this.props.spacingClass ? this.props.spacingClass : "tw-p-8"
            } ${this.props.withShadow && "tw-shadow-2xl"}`}
          >
            {this.props.children(data)}
          </div>
        ) : null}
      </div>
    );
  }
}
AccordionItem.propTypes = {
  children: PropTypes.func.isRequired,
};

AccordionItem.defaultProps = {
  shouldNavigate: (from, to) => true,
  visibleOnLoad: true,
  withShadow: true,
  itemHeaderClass: undefined,
};
export default AccordionItem;
