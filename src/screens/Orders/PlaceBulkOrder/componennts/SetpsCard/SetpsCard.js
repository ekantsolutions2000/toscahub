import React from "react";
import "./style.css";

const StepsCard = (props) => {
  const { steps, currentStep, stepChange } = props;

  const onSelectStep = (stepId) => {
    stepChange(stepId);
  };

  return (
    <>
      <div className="step-card">
        <div className="step-bar">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`step-item 
                ${currentStep === step.id ? "active" : ""}
              `}
              onClick={() => onSelectStep(step.id)}>
              <div className="counter">
                <span>{step.id}</span>
              </div>
              <p className="title">{step.title}</p>
            </div>
          ))}
        </div>
        <div className="card-body">{props.children}</div>
      </div>
    </>
  );
};
export default StepsCard;
