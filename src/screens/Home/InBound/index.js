import React, { Component } from "react";
import { connect } from "react-redux";
import { containers } from "../../../images";
import { Link } from "react-router-dom";
import { login } from "../../../images";

export class Dashboard extends Component {
  render() {
    const { tosca_ltd, tosca_new, gp, hays, orbis } = containers;
    let imageUrl = login.background;

    return (
      <div className="md:tw-flex md:tw--mx-2">
        <div
          className="xs:tw-h-64 xs:tw-w-92 tw-rounded md:tw-w-3/4 tw-bg-cover md:tw-mx-2 tw-mb-4 tw-p-4 tw-flex tw-items-center tw-justify-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="tw-text-center">
            <Link to="/collection-orders/new" className="tw-no-underline">
              <div className="tw-py-6 tw-bg-tosca-orange tw-rounded tw-shadow-md tw-px-6 tw-text-white tw-mb-6 xs:tw-w-48 xs:tw-h-9 xs:tw-px-0 xs:tw-text-xs xs:tw-py-2">
                Create New Collection Order
              </div>
            </Link>
            <Link to="/collection-orders" className="tw-no-underline">
              <div className="tw-py-6 tw-bg-tosca-orange tw-rounded tw-shadow-md tw-px-6 tw-text-white xs:tw-w-48 xs:tw-h-9 xs:tw-text-xs xs:tw-py-2">
                Review History
              </div>
            </Link>
          </div>
        </div>
        <div className="md:tw-mx-2 tw-flex-1">
          <div className="xs:tw-h-36 xs:tw-w-92 tw-h-24 tw-mb-4 tw-rounded tw-overflow-hidden tw-shadow-lg tw-relative">
            <img
              src={tosca_ltd}
              alt="img"
              className="tw-object-cover tw-w-full tw-h-full tw-pb-8"
            ></img>
            <div className="tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-px-2 tw-h-8 tw-flex tw-items-center">
              ToscaLTD
            </div>
          </div>

          <div className="xs:tw-h-36 xs:tw-w-92 tw-h-24 tw-mb-4 tw-rounded tw-overflow-hidden tw-shadow-lg tw-relative">
            <img
              src={tosca_new}
              alt="img"
              className="tw-object-cover tw-w-full tw-h-full tw-pb-8"
            ></img>
            <div className="tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-px-2 tw-h-8 tw-flex tw-items-center">
              Tosca (New logo)
            </div>
          </div>

          <div className="xs:tw-h-36 xs:tw-w-92 tw-h-24 tw-mb-4 tw-rounded tw-overflow-hidden tw-shadow-lg tw-relative">
            <img
              src={gp}
              alt="img"
              className="tw-object-cover tw-w-full tw-h-full tw-pb-8"
            ></img>
            <div className="tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-px-2 tw-h-8 tw-flex tw-items-center">
              Georgia Pacific (GP)
            </div>
          </div>

          <div className="xs:tw-h-36 xs:tw-w-92 tw-h-24 tw-mb-4 tw-rounded tw-overflow-hidden tw-shadow-lg tw-relative">
            <img
              src={hays}
              alt="img"
              className="tw-object-cover tw-w-full tw-h-full tw-pb-8"
            ></img>
            <div className="tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-px-2 tw-h-8 tw-flex tw-items-center">
              Hays
            </div>
          </div>

          <div className="xs:tw-h-36 xs:tw-w-92 tw-h-24 tw-mb-4 tw-rounded tw-overflow-hidden tw-shadow-lg tw-relative">
            <img
              src={orbis}
              alt="img"
              className="tw-object-cover tw-w-full tw-h-full tw-pb-8"
            ></img>
            <div className="tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-px-2 tw-h-8 tw-flex tw-items-center">
              Orbis
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = ({ session }) => ({
  accessToken: session.user.accessToken,
});

export default connect(mapState)(Dashboard);
