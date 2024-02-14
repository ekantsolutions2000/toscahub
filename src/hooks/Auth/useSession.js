import { useSelector } from "react-redux";
import _ from "lodash";

export default function useSession() {
  const session = useSelector((state) => state.session);

  return {
    authenticated: session.authenticated,
    accessToken: session.user.accessToken,
    user: session.user,
    userType: _.get(session, "user.UserType", "na"),
    customerId: _.get(session, "user.CustomerInfo.CustID", "na"),
    isSwitched:
      _.get(session, "user.OrgId", "na") !==
      _.get(session, "user.initialUser.OrgId", "na"),
  };
}
