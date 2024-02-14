import React from "react";
import { Roles, authorize } from "../../utils/AuthService";
import * as URL from "./../Nav/Routes/Url";
import SidebarNavGroup from "./SidebarNavGroup";
import Dashboard from "./NavLinksCommon/Dashboard";
import Resources from "./NavLinksCommon/Resources";
import Users from "./NavLinksCommon/Users";
import SidebarNavGroupItem from "./SidebarNavGroupItem";
import { navIcons } from "../../images";

export default function OutboundNav(props) {
  const { collapsed, user } = props;
  return (
    <React.Fragment>
      <Dashboard collapsed={collapsed} />

      {/* Orders */}
      <SidebarNavGroup label="Orders" collapsed={collapsed}>
        <SidebarNavGroupItem
          url="/ordering/new"
          label="Place Single Order"
          tooltipText="Place Single Order"
          collapsed={collapsed}
          iconComponent={<navIcons.SingleOrder />}
        />
        <SidebarNavGroupItem
          url="/ordering/new-bulk-order"
          label="Place Bulk Order"
          tooltipText="Place Bulk Order"
          collapsed={collapsed}
          iconComponent={<navIcons.BulkOrder />}
        />
        <SidebarNavGroupItem
          url="/ordering"
          label="Order History"
          tooltipText="Order History"
          collapsed={collapsed}
          iconComponent={<navIcons.OrderHistory />}
        />

        <SidebarNavGroupItem
          url="/ordering/request-quote"
          label="Request a Quote"
          tooltipText="Request a Quote"
          collapsed={collapsed}
          iconComponent={<navIcons.RequestQuote />}
        />

        {authorize(user, Roles.ADMINISTRATOR, Roles.CUSTOMER_SERVICE) && (
          <SidebarNavGroupItem
            url="/logs/order"
            label="Order Logs"
            tooltipText="Order Logs"
            collapsed={collapsed}
            iconComponent={<navIcons.OrderLog />}
          />
        )}
      </SidebarNavGroup>

      <SidebarNavGroup collapsed={collapsed}>
        <SidebarNavGroupItem
          url="/invoicing"
          label="Invoices"
          tooltipText="Invoices"
          collapsed={collapsed}
          iconComponent={<navIcons.Invoice />}
        />
      </SidebarNavGroup>

      <SidebarNavGroup label="Reporting" collapsed={collapsed} isOpen={false}>
        <SidebarNavGroupItem
          url="/reporting/transactions"
          label="Transactions"
          tooltipText="Transactions"
          collapsed={collapsed}
          iconComponent={<navIcons.Transactions />}
        />
        <SidebarNavGroupItem
          url={URL.REPORTING_TRANSACTIONS_HISTORY}
          label="Transaction History"
          tooltipText="Transaction History"
          collapsed={collapsed}
          iconComponent={<navIcons.TransactionHistory />}
        />

        <SidebarNavGroupItem
          url="/reporting/returns"
          label="Returns"
          tooltipText="Returns"
          collapsed={collapsed}
          iconComponent={<navIcons.Returns />}
        />
      </SidebarNavGroup>

      <Resources collapsed={collapsed} />

      <Users collapsed={collapsed} />
    </React.Fragment>
  );
}
// }
