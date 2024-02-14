import React, { Component, cloneElement } from "react";
import ReactDOM from "react-dom/client";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/light.css";
import "./style.css";

export class ToolTip extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  state = {
    comp: null,
    instance: null,
  };

  renderContent = () => {
    let container = document.createElement("div");
    const root = ReactDOM.createRoot(container);
    root.render(this.props.content);
    return container;
  };

  componentDidMount = () => {
    let node = this.myRef.current;
    let instance = tippy(node, {
      ...this.props.config,
      content: this.renderContent(),
    });
    this.setState({ instance: instance });
  };

  componentWillUnmount = () => {
    if (this.state.instance) this.state.instance.destroy();
  };

  componentDidUpdate = () => {
    let content = {};
    if (
      this.state.instance !== null &&
      this.state.instance.props.trigger === "manual"
    ) {
      if (this.props.show) {
        this.state.instance.show();
        content = { content: this.renderContent() };
      } else {
        this.state.instance.hide();
      }
    } else {
      content = { content: this.renderContent() };
    }

    if (this.props.disabled) {
      this.state.instance.disable();
    } else {
      this.state.instance.enable();
    }

    try {
      this.props.className.split(" ").forEach((c) => {
        this.state.instance.popper.classList.add(c);
      });
    } catch (e) {}

    this.state.instance.setProps({ ...this.props.config, ...content });
  };

  show = () => {};

  render() {
    let children = this.props.children;
    return cloneElement(children, {
      ref: this.myRef,
    });
  }
}

ToolTip.defaultProps = {
  show: false,
  disabled: false,
  className: "tippy-class",
};

export default ToolTip;
