import React, { useEffect, useState } from "react";
import { ToolTip } from "../../components";
import { icons } from "../../images";
import "./styles.css";
import _ from "lodash";

const UserRolesOrganizations = (props) => {
  const [detailsIcon, setDetailsIcon] = useState(icons.detailsIcon);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []); //eslint-disable-line

  const resizeWindow = () => {
    setWindowWidth(window.innerWidth);
  };

  const onMouseEnter = () => {
    setDetailsIcon(icons.detailsIconHover);
  };

  const onMouseLeave = () => {
    setDetailsIcon(icons.detailsIcon);
  };

  const content = props.user.organizations ? (
    <div className="user-org-role">
      <table>
        <thead>
          <tr>
            <th className="th-org">Organization</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {props.user.roles &&
            props.user.roles.map((role, index) => {
              return (
                <tr key={index}>
                  <td className="th-org">{props.user.customerName}</td>
                  <td>{role}</td>
                </tr>
              );
            })}
          {props.user.organizations &&
            props.user.organizations.map((organization) => {
              return organization.roles.map((role, index) => {
                return (
                  <tr key={index}>
                    <td className="th-org">
                      {organization.customer.customerName}
                    </td>
                    <td>{role}</td>
                  </tr>
                );
              });
            })}
        </tbody>
      </table>
    </div>
  ) : (
    <div>
      <table className="user-org-role">
        <thead>
          <tr>
            <th className="th-org">Organization</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {props.user.roles &&
            props.user.roles.map((role, index) => {
              return (
                <tr key={index}>
                  <td className="th-org">{props.user.customerName}</td>
                  <td>{role}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      {props.user.roles && !_.isEmpty(props.user.roles) ? (
        <ToolTip
          disabled={windowWidth <= 768}
          content={
            <div className="tw-m-2 tw-py-2 tw-text-gray-600 tw-font-light">
              {content}
            </div>
          }
          config={{ arrow: false, theme: "light", placement: "left" }}
        >
          <img
            className="user-details"
            src={detailsIcon}
            alt="Organizations"
            onMouseEnter={() => onMouseEnter()}
            onMouseLeave={() => onMouseLeave()}
          />
        </ToolTip>
      ) : (
        <img
          className="user-details"
          src={icons.detailsIconDisabled}
          alt="Organizations"
        />
      )}
    </div>
  );
};

export default UserRolesOrganizations;
