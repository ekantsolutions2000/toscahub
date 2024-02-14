import { ReactComponent as LogoSvg } from "./../../images/Nav/logo.svg";
import useSession from "../../hooks/Auth/useSession";
import * as UserTypes from "../../utils/UserTypes";
import InboundNav from "./InboundNav";
import OutboundNav from "./OutboundNav";
import usePrevious from "../../hooks/usePrevious";
import { useEffect } from "react";
import { withRouter } from "react-router-dom";
import _ from "lodash";
import { motion, AnimatePresence } from "framer-motion/dist/framer-motion";

function SideNav(props) {
  const { userType, user } = useSession();
  const { show, onClose, collapsed, setCollapsed } = props;

  const navMap = {
    [UserTypes.OUTBOUND]: OutboundNav,
    [UserTypes.INBOUND]: InboundNav,
  };

  const NavLink = navMap[userType];
  const pathName = _.get(props, "location.pathname", "");
  const prevPathName = usePrevious(pathName);

  useEffect(() => {
    if (pathName !== prevPathName) {
      onClose();
    }
  }, [pathName, prevPathName, onClose]);

  return (
    <>
      <AnimatePresence initial={false}>
        {show ? (
          <motion.div
            onClick={onClose}
            className={`tw-transition-all--- tw-fixed tw-inset-0 tw-z-20 tw-w-full tw-hh-full tw-bg-gray-900 tw-bg-opacity-50 lg:tw-hidden ${
              show ? "tw-opacity-100---" : "tw-opacity-0--- tw-invisible---"
            }`}
            initial={"hidden"}
            animate={show ? "show" : "hidden"}
            transition={{
              duration: 0.2,
            }}
            exit={{ opacity: 0 }}
            variants={{
              show: {
                opacity: 1,
              },
              hidden: {
                opacity: 0,
              },
            }}
          ></motion.div>
        ) : null}
      </AnimatePresence>

      <motion.aside
        className={`tw-font-inter tw-min-w-[var(--sidebar-width)] lg:tw-min-w-[unset] tw-flex lg:tw-flex tw-overflow-hidden tw-flex-col tw-w-64--- tw-translate-x-0-- tw-transform-- tw-fixed tw-h-screen tw-bg-white lg:tw-border-r lg:tw-shadow-xl tw-z-20 lg:tw-z-0 lg:!tw-translate-x-0 tw-transition-width-- tw-duration-300-- ${
          show ? "tw-translate-x-0----" : "tw--translate-x-full----"
        } ${
          collapsed
            ? "lg:tw-w-[var(--collapsed-sidebar-width)]---"
            : "lg:tw-w-[var(--sidebar-width)]---"
        }`}
        initial={false}
        animate={show ? "show" : "hidden"}
        transition={{
          duration: 0.3,
          type: "ease",
        }}
        variants={{
          show: {
            translateX: 0,
            transitionTimingFunction: "unset",
            width: collapsed
              ? "var(--collapsed-sidebar-width)"
              : "var(--sidebar-width)",
          },
          hidden: {
            translateX: "-100%",
            transitionTimingFunction: "unset",
            width: collapsed
              ? "var(--collapsed-sidebar-width)"
              : "var(--sidebar-width)",
          },
        }}
      >
        {/* <motion.div 
          className="!tw-min-w-[var(--sidebar-width)] lg:!tw-min-w-[unset]"
          initial={false} 
          animate={collapsed? 'collapsed': 'notCollapsed'}
          transition={{
            type: "ease"
          }}
          variants={{
            collapsed: {
              width: 'var(--collapsed-sidebar-width)'
            }, 
            notCollapsed: {
              width: 'var(--sidebar-width)'
            }

          }}
        > */}
        <header className="tw-h-16 tw-border-b tw-border-tosca-orange">
          <div className="tw-flex tw-h-full tw-items-center tw-jusify-center tw-px-2 tw-w-full lg:tw-px-4">
            {/* Close button only on mobile */}
            <button
              onClick={onClose}
              className="tw-ml-2 tw-shrink-0 tw-flex tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-bg-white tw-text-tosca-orange tw-rounded-full hover:tw-bg-gray-500 hover:tw-bg-opacity-5 lg:tw-mr-4 lg:tw-hidden"
            >
              <svg
                className="tw-w-6 tw-h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  d="M20.25 7.5L16 12L20.25 16.5M3.75 12H12M3.75 17.25H16M3.75 6.75H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>

            {/* Collapsible only on large */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="tw-shrink-0 tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-bg-white tw-text-tosca-orange tw-rounded-full hover:tw-bg-gray-500 hover:tw-bg-opacity-5 tw-hidden lg:tw-flex"
            >
              <svg
                className="tw-w-6 tw-h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  d={`${
                    collapsed
                      ? "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      : "M20.25 7.5L16 12L20.25 16.5M3.75 12H12M3.75 17.25H16M3.75 6.75H16"
                  }`}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>

            <div className="tw-flex tw-gap-4 tw-items-center">
              <a
                className="tw-flex"
                href="https://www.toscaltd.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LogoSvg
                  className={`tw-w-[5.4rem] sm:tw-w-28 tw-h-auto ${
                    collapsed ? "lg:tw-hidden" : ""
                  }`}
                ></LogoSvg>
              </a>
            </div>
          </div>
        </header>
        <nav className="tw-flex-1 tw-py-6 side-nav tw-overflow-x-hidden tw-overflow-y-auto tw-h-full">
          {NavLink && (
            <ul className="nav- !tw-px-6 navbar-nav- tw-space-y-6">
              <NavLink user={user} collapsed={collapsed} />
              {/* TOTO: ADD USERS to inbound */}
            </ul>
          )}
        </nav>
        {/* </motion.div> */}
      </motion.aside>
    </>
  );
}

export default withRouter(SideNav);
