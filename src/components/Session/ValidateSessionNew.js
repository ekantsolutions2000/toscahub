import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as dateFns from "date-fns";
import { sessionActions } from "../../actions";
import ConfirmationModal from "../Modal/ConfirmationModal";
import { Link } from "react-router-dom";
import Button from "../Button/Button";

function ValidateSessionNew() {
  const session = useSelector((state) => state.session);
  const status = useSelector((state) => state.statusReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    let timer = null;
    if (session.user.accessToken) {
      dispatch(
        sessionActions.validate({ accessToken: session.user.accessToken }),
      );
      const expireTime = new Date(session.user.exp * 1000);
      const currentTime = new Date();
      // const currentTime = dateFns.addSeconds(expireTime, -10)
      const expiresInMs = dateFns.differenceInMilliseconds(
        expireTime,
        currentTime,
      );

      if (expiresInMs > 0) {
        timer = setTimeout(() => {
          dispatch(
            sessionActions.validate({ accessToken: session.user.accessToken }),
          );
        }, expiresInMs);
      }
    } else {
      const dontCheck = ["/login", "/logout"];
      if (!dontCheck.includes(window.location.pathname)) {
        dispatch(
          sessionActions.validate({ accessToken: session.user.accessToken }),
        );
      }
    }
    return () => {
      if (timer && typeof timer === "function") timer();
    };
    // eslint-disable-next-line
  }, [session.user.accessToken]);

  return (
    <div>
      <ConfirmationModal
        title="Caution!"
        brand="danger"
        show={!!status.tokenError}
        onClose={() => {}}
        closable={false}
      >
        <p> {status.tokenError} </p>
        <p>
          Click <b className="tw-text-gray-700">OK</b> to return to the login
          page.
        </p>
        <div className="tw-flex tw-gap-2 tw-mt-6">
          <Link to="/logout" className="tw-w-full">
            <Button brand="danger" type="button" fullwidth="true">
              OK
            </Button>
          </Link>
        </div>
      </ConfirmationModal>
    </div>
  );
}

export default ValidateSessionNew;
