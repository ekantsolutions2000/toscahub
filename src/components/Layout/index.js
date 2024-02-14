import React, { useState } from "react";
import "./style.css";
import { NewFooter } from "../index";
import useSession from "../../hooks/Auth/useSession";
import { config } from "../../utils/conf";
import AccountNav from "../Nav/AccountNav";
import SideNav from "../Nav/SideNav";
import { ReactComponent as LogoSvg } from "./../../images/Nav/logo.svg";

const Layout = function (props) {
  const { authenticated } = useSession();
  const [showSideNav, setShowSideNav] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div
        className="tw-z-10 tw-sticky tw-top-0"
        id="toaster-message-root"
      ></div>

      <div className="layout tw-flex tw-w-full tw-min-h-screen tw-overflow-x-clip">
        {/* Left */}
        {authenticated && (
          <SideNav
            show={showSideNav}
            onClose={() => setShowSideNav(false)}
            setCollapsed={setCollapsed}
            collapsed={collapsed}
          />
        )}

        {/* Right */}
        <div
          className={`tw-h-full tw-flex tw-flex-col tw-flex-1 tw-gap-y-6 tw-w-full tw-min-h-screen ${
            collapsed
              ? "lg:tw-pl-[var(--collapsed-sidebar-width)]"
              : "lg:tw-pl-[var(--sidebar-width)]"
          }`}
        >
          {authenticated && (
            <header className="tw-h-16 tw-bg-white tw-border-b  tw-z-[5] tw-sticky tw-top-0 tw-flex tw-w-full tw-shrink-0 tw-items-center">
              <div className="tw-flex tw-items-center tw-w-full tw-px-2 sm:tw-px-4 md:tw-px-6 lg:tw-px-8 tw-justify-between">
                <div className="tw-flex">
                  {/* Mobile trigger button */}
                  <button
                    onClick={() => setShowSideNav(true)}
                    className="tw-shrink-0 tw-flex tw-items-center sm:-tw-ml-2  tw-justify-center tw-w-10 tw-h-10 tw-bg-white tw-text-tosca-orange tw-rounded-full hover:tw-bg-gray-500 hover:tw-bg-opacity-5 lg:tw-mr-4 lg:tw-hidden"
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
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      ></path>
                    </svg>
                  </button>

                  {/* Large screen on collapsed */}
                  <div className="tw-flex tw-gap-4 tw-items-center">
                    <a
                      className={`navbar-brand- tw-flex ${
                        collapsed ? "lg:tw-flex" : "lg:tw-hidden"
                      }`}
                      href="https://www.toscaltd.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LogoSvg className="tw-w-[5.4rem] sm:tw-w-28 tw-h-auto"></LogoSvg>
                    </a>
                    <div className="navbar-environment tw-hidden sm:tw-block">
                      {config.environmentName}
                    </div>
                  </div>
                </div>

                {/* Avatar */}
                <div>
                  <div className="tw-cursor-pointer tw-flex tw-gap-2 tw-items-center">
                    <ul className="nav navbar-nav">
                      <AccountNav />
                    </ul>
                  </div>
                </div>
              </div>
            </header>
          )}
          <div className="main-content-area tw-flex-1 tw-px-4 sm:tw-px-4 md:tw-px-6 lg:tw-px-8 filament-main-content tw-w-full tw-mx-auto tw-max-w-7xl">
            {/* {authenticated && <Nav />} */}
            {props.children}
          </div>

          {/* Footer */}
          {/* tw-px-2 sm:tw-px-4 md:tw-px-6 lg:tw-px-8 */}
          <div className="">{authenticated && <NewFooter />}</div>
        </div>
      </div>
    </>
    // <div className="main-container-">
    //   <div
    //     className="tw-z-10 tw-sticky tw-top-0"
    //     id="toaster-message-root"></div>
    //   <aside className="tw-bg-red-500 tw-w-64">
    //     This is the left
    //   </aside>

    //   {authenticated && <Nav />}
    //   <div className="container">{props.children}</div>
    //   {authenticated && <NewFooter />}
    // </div>
  );
};

export default Layout;
