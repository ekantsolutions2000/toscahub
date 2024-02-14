import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import ReactDOM from "react-dom";

const modalRoot = document.getElementById("modal-root");
const el = document.createElement("div");

const RightPanel = (props) => {
  const modal = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [closeInprogress, setCloseInprogress] = useState(false);

  useEffect(() => {
    modalRoot.appendChild(el);
    return () => {
      modalRoot.removeChild(el);
    };
  }, []);

  useEffect(() => {
    if (closeInprogress) return props.close();

    if (props.display) {
      displayPanel();
    } else {
      hidePanel();
    }
    // eslint-disable-next-line
  }, [props.display]);

  const displayPanel = () => {
    setIsVisible(true);

    setTimeout(() => {
      if (modal.current) {
        modal.current.style.transform = "translateX(0)";
      }
    }, 10);
  };

  const hidePanel = () => {
    if (modal.current) modal.current.style.transform = "translateX(100%)";

    setCloseInprogress(true);
    setTimeout(() => {
      setIsVisible(false);
      setCloseInprogress(false);
    }, 500);
  };

  const useOutsideClick = (modal) => {
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (modal.current && !modal.current.contains(e.target)) {
          props.close();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [modal]);
  };
  useOutsideClick(modal);

  return ReactDOM.createPortal(
    isVisible ? (
      <div id="rightPanel-" className="rightPanel tw-pt-16" ref={modal}>
        {props.children}
      </div>
    ) : null,
    el,
  );
};

export default RightPanel;
