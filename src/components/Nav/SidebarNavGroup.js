import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion/dist/framer-motion";

export default function SidebarNavGroup(props) {
  const [isOpen, setIsOpen] = useState(
    props.isOpen === undefined ? true : props.isOpen,
  );
  const { collapsed } = props;

  return (
    <>
      <li className="">
        {props.label && !collapsed && (
          <button
            className={`tw-bg-white tw-text-xs tw-uppercase tw-tracking-wider tw-text-gray-500- tw-font-inter !tw-font-bold tw-p-0 tw-m-0 tw-flex tw-justify-between tw-w-full tw-transition-all ${
              isOpen && "tw-mb-2"
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{props.label}</span>
            <span
              className={`tw-flex tw-transition-all tw-transform ${
                isOpen ? "tw-rotate-180" : "tw-rotate-0"
              }`}
            >
              <svg
                className={`tw-w-3 tw-h-3`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </span>
          </button>
        )}
        {/* ${isOpen? 'tw-max-h-[100vh] tw-translate-y-0': 'tw-max-h-0 -tw-translate-y-full'} */}
        <AnimatePresence initial={false}>
          {(isOpen || collapsed) && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`nav-item-panel tw-space-y-2 tw-text-sm tw-font-normal !-tw-mx-3 tw-overflow-hidden `}
            >
              {props.children}
            </motion.ul>
          )}
        </AnimatePresence>
      </li>
      <li>
        <div className="tw-border-t -tw-mr-6"></div>
      </li>
    </>
  );
}
