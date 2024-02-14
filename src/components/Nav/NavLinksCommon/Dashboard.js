import SidebarNavGroup from "../SidebarNavGroup";
import { navIcons } from "../../../images";
import SidebarNavGroupItem from "../SidebarNavGroupItem";

export default function Dashboard(props) {
  const { collapsed } = props;

  return (
    <SidebarNavGroup collapsed={collapsed}>
      <SidebarNavGroupItem
        url="/"
        label="Dashboard"
        tooltipText="Dashboard"
        collapsed={collapsed}
        iconComponent={<navIcons.Dashboard />}
      />
    </SidebarNavGroup>
  );
}
