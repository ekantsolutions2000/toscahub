/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from "react";
import "./style.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { MdCopyright } from "react-icons/md";
import { config } from "../../utils/conf";

class Footer extends Component {
  render() {
    return (
      <footer id="page-footer">
        <div className="link-row">
          <a
            href={config.docUrl + "/hub/docs/tosca_terms_conditions.pdf"}
            target="_blank">
            Terms of Use
          </a>
          <a href="https://www.toscaltd.com/privacy-policy" target="_blank">
            Privacy Policy
          </a>
          <a href="https://www.toscaltd.com/terms-and-conditions" target="_blank">
            Terms and Conditions
          </a>
          <a href="https://www.toscaltd.com" target="_blank">
            Toscaltd.com
          </a>
        </div>
        <div className="copyright-row">
          <MdCopyright />
          <p>Tosca Hub 3.0</p>
        </div>
      </footer>
    );
  }
}

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
