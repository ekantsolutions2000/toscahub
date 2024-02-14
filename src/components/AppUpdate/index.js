import { Component } from "react";
import { withCookies } from "react-cookie";
import io from "socket.io-client";
import swal from "sweetalert";
import { now } from "moment";

export class AppUpdate extends Component {
  isInitialRequest = (localTime, serverTime) => {
    return parseInt(localTime, 10) === parseInt(serverTime, 10);
  };

  componentDidMount = () => {
    const { cookies } = this.props;
    const requestTime = now();

    const socket = io({
      query: {
        requestTime: requestTime,
      },
    });

    socket.on("reconnect_attempt", () => {
      socket.io.opts.query = {
        requestTime: now(),
      };
    });

    socket.on(
      "app update",
      function (msg) {
        if (!this.isInitialRequest(requestTime, msg.requestTime)) {
          swal("Your pick up request has been received.", {
            text: `The application has been updated since you open, do you want to reload the page?`,
            className: "tw-text-center",
            icon: "info",

            buttons: {
              cancel: {
                text: "I will reload manually",
                value: false,
                visible: true,
                closeModal: true,
              },
              confirm: {
                text: "Yes",
                value: true,
                closeModal: true,
              },
            },
          }).then((val) => {
            if (val) {
              cookies.set("APP_VERSION", msg.Version);
              window.location.reload();
            }
          });
        } else {
          cookies.set("APP_VERSION", msg.Version);
        }
      }.bind(this),
    );
  };

  render() {
    return null;
  }
}

export default withCookies(AppUpdate);
