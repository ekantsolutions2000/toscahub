/* eslint-disable react/jsx-no-target-blank */
import React from "react";
import "./style.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { config } from "../../utils/conf";
import useSession from "../../hooks/Auth/useSession";

const Footer = () => {
  const { authenticated } = useSession();
  return (
    <footer
      id="new-page-footerx"
      className="tw-flex-wrap tw-bottom-0 tw-flex tw-justify-center tw-gap-3 tw-px-2 sm:tw-px-4 md:tw-px-6 lg:tw-px-8 tw-py-3 tw-bg-tosca-gray-cool tw-text-muted tw-uppercase">
      <a
        className="tw-text-muted tw-whitespace-nowrap"
        href={config.docUrl + "/hub/docs/tosca_terms_conditions.pdf"}
        target="_blank">
        RPC TERMS AND CONDITIONS OF USE
      </a>

      <a
        className="tw-text-muted tw-whitespace-nowrap"
        href="https://www.toscaltd.com/privacy-policy"
        target="_blank">
        Privacy Policy
      </a>

      <a
        className="tw-text-muted tw-whitespace-nowrap"
        href="https://www.toscaltd.com/terms-and-conditions"
        target="_blank">
        TOSCA HUB TERMS AND CONDITIONS
      </a>

      <a
        className="tw-text-muted tw-whitespace-nowrap"
        href="https://www.toscaltd.com"
        target="_blank">
        Toscaltd.com
      </a>

      {authenticated && (
        <div
          id="tosca-trademark-"
          className="tw-text-muted tw-basis-full lg:tw-basis-auto tw-text-center xl:tw-text-right tw-whitespace-nowrap- tw-w-32- xl:tw-ml-auto">
          &copy;TOSCA HUB 5.0
        </div>
      )}

      {/* <div
        id="new-link-row-container"
        style={
          authenticated
            ? { padding: "0 175px 0 175px" }
            : { padding: "0 100px 0 100px" }
        }>
        <div className="link-row">
          <a
            href={config.docUrl + "/hub/docs/tosca_terms_conditions.pdf"}
            target="_blank">
            RPC TERMS AND CONDITIONS OF USE
          </a>
          <a href="https://www.toscaltd.com/privacy-policy" target="_blank">
            Privacy Policy
          </a>
          <a
            href="https://www.toscaltd.com/terms-and-conditions"
            target="_blank">
            TOSCA HUB TERMS AND CONDITIONS
          </a>
          <a href="https://www.toscaltd.com" target="_blank">
            Toscaltd.com
          </a>
        </div>
        {authenticated ? (
          <div id="tosca-trademark">
            <span>&copy;TOSCA HUB 5.0</span>
          </div>
        ) : (
          ""
        )}
      </div> */}
    </footer>
  );
};

const { bool } = PropTypes;

Footer.propTypes = {
  authenticated: bool.isRequired,
  checked: bool.isRequired,
};

const mapState = ({ session }) => ({
  checked: session.checked,
  authenticated: session.authenticated,
});

export default connect(mapState)(Footer);
