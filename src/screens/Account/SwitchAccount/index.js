import { useEffect } from "react";
import { createBrowserHistory } from "history";
import { useDispatch } from "react-redux";
import { sessionActions } from "./../../../actions";
import useSession from "../../../hooks/Auth/useSession";
import _ from "lodash";

export default function SwitchAccount() {
  const { accessToken, user } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    const history = createBrowserHistory();
    const customerId = _.get(history, "location.state.customerId", undefined);
    if (customerId) {
      dispatch(
        sessionActions.changeOrg(customerId, accessToken, user.initialUser),
      );
    }
    history.goBack();
  }, [accessToken, dispatch, user.initialUser]);

  return null;
}
