import React, { Component } from "react";
import "./style.css";
import PropTypes from "prop-types";

export default class FormInputs extends Component {
  constructor(props) {
    super(props);
    this.state = props.inputs.reduce((input, item) => {
      input[item.id] = item.value || "";
      return input;
    }, {});
  }

  onInputChange = (e) => {
    e.preventDefault();
    e.target.labels[0].className = "";
    this.setState({
      ...this.state,
      [e.target.id]: e.target.value,
    });
  };

  inputClass = (id) => {
    let confirmPassClass =
      id === "confirmPass"
        ? this.state["confirmPass"] !== this.state["password"]
          ? "pass-mismatch"
          : "pass-match"
        : null;

    if (confirmPassClass) return `form-control ${confirmPassClass}`;
    else return "form-control";
  };

  render() {
    const { inputs } = this.props;
    return (
      <div>
        {inputs.map((input, key) => (
          <div className="form-group" key={key}>
            {input.required ? (
              <label htmlFor={input.id}>
                {input.title}
                <span className="glyphicon glyphicon-star-empty" />
              </label>
            ) : (
              <label htmlFor={input.id}>{input.title}</label>
            )}
            <input
              type={input.type}
              className={this.inputClass(input.id)}
              id={input.id}
              required={input.required}
              onChange={this.onInputChange}
              value={this.state[input.id]}
            />
          </div>
        ))}
      </div>
    );
  }
}

const { array } = PropTypes;

FormInputs.propTypes = {
  inputs: array.isRequired,
};
