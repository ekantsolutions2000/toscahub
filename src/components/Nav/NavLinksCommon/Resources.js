import SidebarNavGroup from "../SidebarNavGroup";
import SidebarNavGroupItem from "../SidebarNavGroupItem";
import { navIcons } from "../../../images";

export default function Resources(props) {
  const { collapsed } = props;

  return (
    <SidebarNavGroup label="Resources" collapsed={collapsed} isOpen={false}>
      <SidebarNavGroupItem
        url="/resources/faq"
        label="FAQ"
        tooltipText="FAQ"
        collapsed={collapsed}
        iconComponent={<navIcons.Faq />}
      />

      <SidebarNavGroupItem
        url="/resources/feedback"
        label="Feedback"
        tooltipText="Feedback"
        collapsed={collapsed}
        iconComponent={<navIcons.Feedback />}
      />

      <SidebarNavGroupItem
        url="/resources/customer-service"
        label="Contact Customer Service"
        tooltipText="Contact Customer Service"
        collapsed={collapsed}
        iconComponent={<navIcons.Contact />}
      />
    </SidebarNavGroup>
  );
}
