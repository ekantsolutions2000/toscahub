import React, { useEffect } from "react";
import "./../style.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { determineNavStyling } from "../../../../components/Nav/determineNavStyling";
import { Location } from "./../components";
import {
  EmailConfigHelper,
  emailConfigs,
} from "./../../../../components/HOC/withEmail/withEmail";
import useGetSourceAddresses from "../../../../hooks/CustomerProfile/useGetSourceAddresses";
import Loader from "react-loader-spinner";
import useGetCustomer from "../../../../hooks/CustomerProfile/useGetCustomer";
import useSession from "../../../../hooks/Auth/useSession";

function Locations(props) {
  const addressQuery = useGetSourceAddresses();
  const addresses = addressQuery.data.data;
  const { customerId } = useSession();

  const { data: customer } = useGetCustomer(customerId);
  const customerName = customer?.customerName;

  useEffect(() => {
    determineNavStyling(props.location.pathname);
  }, [props.location.pathname]);

  if (addressQuery.isFetching) {
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-h-56">
        <Loader type="Oval" color="rgba(246,130,32,1)" height="50" width="50" />
      </div>
    );
  }

  return (
    <div id="locations-page">
      <div className="locations-header">
        <div className="locations-title">
          <h3 className="location-heading">Locations</h3>
          <EmailConfigHelper configName={emailConfigs.ADD_LOCATION_REQUEST}>
            {(emailConfig) => (
              <p>
                To edit the following information, please contact{" "}
                <a
                  href={`mailto:${emailConfig.getReciepients()}?subject=${customerName}`}
                >
                  {emailConfig.lablel()}
                </a>
                .
              </p>
            )}
          </EmailConfigHelper>
        </div>
      </div>

      <div className="locations-content">
        {addresses.map((location) => (
          <Location location={location} key={location.addressId} />
        ))}
      </div>
    </div>
  );
}

const { object, string } = PropTypes;

Locations.propTypes = {
  user: object.isRequired,
  accessToken: string,
};

const mapState = ({ session }) => ({
  user: session.user,
  accessToken: session.user.accessToken,
});

export default connect(mapState)(Locations);
