import React, { useEffect } from "react";
import "./style.css";
import { Location } from "./components";
import { determineNavStyling } from "../../../components/Nav/determineNavStyling";
import useGetSourceAddresses from "../../../hooks/CustomerProfile/useGetSourceAddresses";
import Loader from "react-loader-spinner";
import useSession from "../../../hooks/Auth/useSession";
import useGetCustomer from "../../../hooks/CustomerProfile/useGetCustomer";
import * as UserTypes from "../../../utils/UserTypes";

export default function Account(props) {
  const session = useSession();
  const user = session.user;
  const userType = session.userType;

  const isInboundCustomer = userType === UserTypes.INBOUND;
  let sourceAddressQueryParameters = { organizationId: user.OrgId };
  if (isInboundCustomer) {
    sourceAddressQueryParameters = {
      userId: user.UserId,
      customerType: "cop",
    };
  }
  const sourceAddressQuery = useGetSourceAddresses(
    sourceAddressQueryParameters,
  );

  const { data: customer, isLoading } = useGetCustomer(session.customerId);

  useEffect(() => {
    determineNavStyling(props.location.pathname);
  }, [props.location.pathname]);

  if (
    sourceAddressQuery.isFetching ||
    isLoading ||
    sourceAddressQuery.isError
  ) {
    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-h-56">
        <Loader type="Oval" color="rgba(246,130,32,1)" height="50" width="50" />
      </div>
    );
  }
  const sourceAddressList = sourceAddressQuery.data.data;

  return (
    <div id="account-page">
      <div className="content-body">
        <div className="header">
          <div className="title">
            <h3>Account</h3>
          </div>
          <div className="details">
            <div className="details-row">
              <label className="item-label" htmlFor="user_name">
                User ID
              </label>
              <input
                type="text"
                className="form-control input-transparent-right"
                id="user_name"
                value={user.UserName}
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="content">
          <div className="left">
            {sourceAddressList.map((location) => (
              <Location
                location={location}
                key={location.addressId}
                user={props.user}
              />
            ))}
          </div>

          <div className="right">
            {customer ? (
              <div id="info">
                <div className="info-title">Information</div>
                <div className="info-message">
                  To edit the following information, please contact your
                  customer service representative.
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div
                      style={{
                        fontSize: "13px",
                        lineHeight: "1.15",
                        color: "#6e6f71",
                      }}
                    >
                      COMPANY INFORMATION
                    </div>
                    <div
                      style={{
                        fontWeight: "normal",
                        fontSize: 16,
                        lineHeight: "1.5",
                        color: "#414042",
                        marginTop: "4px",
                      }}
                    >
                      {customer.customerName}
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        lineHeight: "1.5",
                        color: "#414042",
                      }}
                    >
                      <div>{customer.addressLine1}</div>
                      {customer.addressLine2 ? (
                        <div>{customer.addressLine2}</div>
                      ) : null}
                      <div>
                        {customer.city}, {customer.state} {customer.postalCode}
                      </div>
                      <div>{customer.country}</div>
                      <div>{customer.contactPhone}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div
                      className="userInformation"
                      style={{
                        fontSize: "13px",
                        lineHeight: "1.15",
                        color: "#6e6f71",
                      }}
                    >
                      USER INFORMATION
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        lineHeight: "2",
                        color: "#414042",
                      }}
                    >
                      <div>
                        {user.FirstName} {user.LastName}
                      </div>
                      <div>{user.Email}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
