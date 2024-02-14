import React, { useEffect } from "react";
import "./../style.css";
import { determineNavStyling } from "../../../../components/Nav/determineNavStyling";
import { Location } from "./../components";
import useGetSourceAddresses from "../../../../hooks/CustomerProfile/useGetSourceAddresses";
import Loader from "react-loader-spinner";
import useSession from "../../../../hooks/Auth/useSession";
import useGetCustomer from "../../../../hooks/CustomerProfile/useGetCustomer";

export default function Locations(props) {
  const { customerId } = useSession();
  useEffect(() => {
    determineNavStyling(props.location.pathname);
  }, [props.location.pathname]);

  const addressQuery = useGetSourceAddresses({ customerType: "cop" });
  const addresses = addressQuery.data.data;

  const { data: customer } = useGetCustomer(customerId);
  const customerName = customer?.customerName;

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
          <p>
            Please contact support at{" "}
            <a
              href={`mailto:supplychain@toscaltd.com?subject=${customerName} `}
            >
              Supply Chain
            </a>
            .
          </p>
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
