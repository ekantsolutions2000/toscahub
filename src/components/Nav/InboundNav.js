import React from "react";
import { Roles, authorize } from "../../utils/AuthService";
import SidebarNavGroup from "./SidebarNavGroup";
import Dashboard from "./NavLinksCommon/Dashboard";
import Resources from "./NavLinksCommon/Resources";
import Users from "./NavLinksCommon/Users";
import SidebarNavGroupItem from "./SidebarNavGroupItem";
import { navIcons } from "../../images";

export default function InboundNav(props) {
  const { collapsed, user } = props;

  return (
    <React.Fragment>
      <Dashboard collapsed={collapsed} />

      {/* Orders */}
      <SidebarNavGroup label="Orders" collapsed={collapsed}>
        <SidebarNavGroupItem
          url="/collection-orders/new"
          label="Place Collection Order"
          tooltipText="Place Collection Order"
          collapsed={collapsed}
          iconComponent={<navIcons.SingleOrder />}
        />

        <SidebarNavGroupItem
          url="/collection-orders"
          label="Collection Order History"
          tooltipText="Collection Order History"
          collapsed={collapsed}
          iconComponent={<navIcons.OrderHistory />}
        />

        {authorize(user, Roles.ADMINISTRATOR, Roles.CUSTOMER_SERVICE) && (
          <SidebarNavGroupItem
            url="/logs/collection-orders"
            label="Collection Order Logs"
            tooltipText="Collection Order Logs"
            collapsed={collapsed}
            iconComponent={<navIcons.OrderLog />}
          />
        )}
      </SidebarNavGroup>

      <Resources collapsed={collapsed} />
      <Users collapsed={collapsed} />
    </React.Fragment>
  );
}
