import React, { Component } from "react";
import "./style.css";
import ReactDOM from "react-dom";
const modalRoot = document.getElementById("modal-root");
export class SimpleModal extends Component {
  constructor(props) {
    super(props);
    this.el = document.createElement("div");
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  componentDidUpdate = () => {
    if (this.props.onOpen && this.props.show) {
      this.props.onOpen();
    }
  };

  render() {
    return ReactDOM.createPortal(
      <React.Fragment>
        {this.props.show ? (
          <div className="tw-fixed tw-inset-0 tw-bg-transparent tw-z-50 tw-flex tw-justify-center tw-items-center">
            <div
              className="tw-absolute tw-inset-0 tw-z-10 tw-bg-black tw-opacity-50"
              onClick={this.props.outSideClick && this.props.modalClosed}></div>
            <div
              className="tw-z-20 tw-rounded-md tw-shadow-md tw-bg-white"
              style={this.props.modalStyle ? this.props.modalStyle : {}}>
              <div
                className="tw-flex tw-justify-between tw-items-center tw-bg-gray-200 tw-border-b tw-border-gray-400 tw-font-normal tw-p-5 tw-text-2xl tw-rounded-t"
                style={
                  this.props.modalHeaderStyle ? this.props.modalHeaderStyle : {}
                }>
                {this.props.headerText}
                <div
                  id="simpal-close-btn"
                  className="tw-font-light tw-text-xl tw-text-gray-400 tw-bg-gray-200 tw-rounded">
                  <span
                    className="glyphicon glyphicon-remove pull-right close-btn"
                    style={
                      this.props.modalHeaderStyle &&
                      this.props.modalHeaderStyle.backgroundColor
                        ? {
                            backgroundColor: this.props.modalHeaderStyle
                              .backgroundColor,
                          }
                        : {}
                    }
                    onClick={this.props.modalClosed}
                  />
                </div>
              </div>
              <div className="tw-p-5">{this.props.children}</div>
            </div>
          </div>
        ) : null}
      </React.Fragment>,
      this.el,
    );
  }
}

export default SimpleModal;
