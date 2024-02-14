import { NavLink } from "react-router-dom";
import ToolTip from "../Tooltip";
import { navIcons } from "../../images";

export default function SidebarNavGroupItem(props) {
  const { collapsed, tooltipText, label, iconComponent, url } = props;

  const Icon = iconComponent || <navIcons.Dashboard />;
  return (
    <ToolTip
      className="tw-hidden lg:tw-block"
      disabled={!collapsed}
      content={tooltipText}
      config={{
        arrow: true,
        placement: "right",
      }}>
      <li>
        <NavLink
          to={url}
          className="side-nav-link"
          exact
          activeClassName="active">
          <span className="tw-flex">{Icon}</span>
          <span className={`tw-flex-1 ${collapsed ? "lg:tw-hidden" : ""}`}>
            {label}
          </span>
        </NavLink>
      </li>
    </ToolTip>
  );
}
