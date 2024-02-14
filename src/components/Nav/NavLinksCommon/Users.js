import SidebarNavGroup from "../SidebarNavGroup";
import SidebarNavGroupItem from "../SidebarNavGroupItem";
import { navIcons } from "../../../images";

export default function Users(props) {
  const { collapsed } = props;

  return (
    <SidebarNavGroup collapsed={collapsed}>
      <SidebarNavGroupItem
        url="/all-users"
        label="Users"
        tooltipText="Users"
        collapsed={collapsed}
        iconComponent={<navIcons.Users />}
      />
    </SidebarNavGroup>
  );
}
