import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import useGetCSRs from "../../../../hooks/CustomerProfile/useGetCustomerSolutionsRepresentatives";
import useGetSalespersons from "../../../../hooks/CustomerProfile/useGetSalespersons";

export default function Location(props) {
  const { location } = props;
  const csrsQuery = useGetCSRs();
  const salesPersonsQuery = useGetSalespersons();

  if (
    csrsQuery.isLoading ||
    salesPersonsQuery.isLoading ||
    csrsQuery.isError ||
    salesPersonsQuery.isError
  )
    return <div>Loading......</div>;

  const contact = csrsQuery.data.forAddress(location.addressId);
  const salesperson = salesPersonsQuery.data.forAddress(location.addressId);

  return (
    <div id="location">
      <div className="loc-detail">
        {location.addressName ? (
          <div>
            <div className="loc-header">{location.addressName}</div>
            {contact.fullName ? (
              <div className="loc-info">
                <div
                  style={{
                    marginTop: "8px",
                  }}>
                  Tosca Customer Experience Rep - {contact.fullName}
                </div>
                <div className="row" style={{ marginTop: "4px" }}>
                  <div className="col-sm-6">
                    <span
                      style={{ color: "#ec710a" }}
                      className="glyphicon glyphicon-envelope"
                    />
                    <a
                      style={{ marginLeft: "8px" }}
                      href={`mailto:${contact.email}?subject=${_.get(
                        props.user,
                        "CustomerInfo.CustName",
                        "",
                      )}:`}>
                      Email
                    </a>
                  </div>
                  <div className="col-md-6">
                    <span
                      style={{ color: "#ec710a" }}
                      className="glyphicon glyphicon-earphone"
                    />{" "}
                    {contact.phone}
                  </div>
                </div>
              </div>
            ) : (
              <div />
            )}
            {salesperson.fullName ? (
              <div className="loc-info">
                <div
                  style={{
                    marginTop: "8px",
                  }}>
                  Tosca Sales Mgr - {salesperson.fullName}
                </div>
                <div className="row" style={{ marginTop: "4px" }}>
                  <div className="col-sm-6">
                    <span
                      style={{ color: "#ec710a" }}
                      className="glyphicon glyphicon-envelope"
                    />{" "}
                    <a
                      style={{ marginLeft: "8px" }}
                      href={`mailto:${salesperson.email}?subject=${_.get(
                        props.user,
                        "CustomerInfo.CustName",
                        "",
                      )}:`}>
                      Email
                    </a>
                  </div>
                  <div className="col-md-6">
                    {salesperson.phone ? (
                      <div>
                        <span
                          style={{ color: "#ec710a" }}
                          className="glyphicon glyphicon-earphone"
                        />{" "}
                        {salesperson.phone}
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div />
            )}
          </div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

Location.propTypes = {
  location: PropTypes.object.isRequired,
};
