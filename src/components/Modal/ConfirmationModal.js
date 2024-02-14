import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { cva } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";

const el = document.createElement("div");
let modalRoot = null;

const sizeStyle = cva("tw-mx-auto tw-px-4 tw-pointer-events-auto", {
  variants: {
    size: {
      full: "tw-max-w-auto",
      xs: "tw-max-w-xs",
      sm: "tw-max-w-sm",
      md: "tw-max-w-md",
      lg: "tw-max-w-lg",
      xl: "tw-max-w-xl",
      "2xl": "tw-max-w-2xl",
      "3xl": "tw-max-w-3xl",
      "4xl": "tw-max-w-4xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

function ConfirmationModal(props) {
  const {
    title = "Title - provide title to override",
    closable = true,
    show = false,
    onClose,
    size,
    children,
    brand,
    headerElement,
  } = props;

  useEffect(() => {
    if (show) {
      modalRoot = document.getElementById("modal-root");
      modalRoot?.appendChild(el);
    }
  }, [show]);

  return ReactDOM.createPortal(
    <AnimatePresence>
      {show && (
        <div className="tw-fixed tw-inset-0 tw-z-40 tw-flex tw-items-center tw-min-h-screen tw-overflow-y-auto tw-overflow-x-hidden tw-transition tw-font-light tw-text-light tw-text-sm md:tw-text-base tw-text-left">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="tw-bg-black/50 tw-cursor-pointer tw-fixed tw-h-full tw-w-full tw-inset-0"
          ></motion.div>
          <div className="tw-w-full tw-z-[1] tw-pointer-events-none">
            <div className={sizeStyle({ size })}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="tw-relative tw-bg-white tw-p-2 tw-rounded tw-max-h-[90vh] tw-overflow-auto"
              >
                {closable && (
                  <button
                    onClick={onClose}
                    tabIndex="-1"
                    type="button"
                    className="tw-absolute tw-top-2 tw-right-2 tw-m-0 tw-p-0 tw-flex tw-bg-transparent"
                  >
                    <svg
                      className="tw-w-4 tw-h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}

                {headerElement ? (
                  <div className="-tw-mx-2 -tw-mt-2">{headerElement}</div>
                ) : null}

                <div className="tw-py-4 tw-px-2 sm:tw-px-4">
                  <div>
                    {/* {title && <p className="tw-m-0 tw-text-dark tw-text-lg md:tw-text-xl tw-mb-2 tw-tracking-normal">{title}</p>}    */}
                    {title && (
                      <p
                        className={cva(
                          "tw-m-0 tw-text-xl md:tw-text-2xl tw-mb-3 tw-tracking-normal tw-font-normal tw-text-center",
                          {
                            variants: {
                              brand: {
                                default: "tw-text-dark",
                                danger: "tw-text-red-600",
                                primary: "tw-text-tosca-orange",
                              },
                            },
                            defaultVariants: {
                              brand: "default",
                            },
                          },
                        )({ brand })}
                      >
                        {title}
                      </p>
                    )}

                    {/* Content */}
                    {children}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    el,
  );
}

ConfirmationModal.propTypes = {
  title: PropTypes.string,
  closable: PropTypes.bool,
  show: PropTypes.bool,
  onClose: PropTypes.func,
  size: PropTypes.string,
  brand: PropTypes.oneOf(["default", "primary", "danger"]),
  headerElement: PropTypes.any,
};

export default ConfirmationModal;
