import React, { Component } from "react";
import { connect } from "react-redux";
import { withCookies } from "react-cookie";
import Announcements from "./announcements.json";
import _ from "lodash";
import moment from "moment";
import { config } from "../../utils/conf";
import "./style.css";
import ConfirmationModal from "../Modal/ConfirmationModal";
class Announcement extends Component {
  state = {
    showNotification: false,
    announcement: {},
  };

  componentDidMount = () => {
    let an = this.getActiveAnnouncement();
    this.setState({ announcement: an }, () => {
      this.announce();
    });
  };

  announce = () => {
    const { cookies } = this.props;
    const announcement = this.state.announcement;
    if (_.isEmpty(announcement)) {
      return;
    }

    const key = this.generateKey();
    let previousId = cookies.get(key);

    if (parseInt(previousId, 10) !== parseInt(announcement.id, 10)) {
      this.setState({ showNotification: true });
    }
  };

  generateKey = () => {
    const userName = _.kebabCase(this.props.session.user.UserName);
    return `TOSCA-ANNOUNCEMENT-${userName}`;
  };

  getActiveAnnouncement = () => {
    let items = Announcements;
    let result = _.filter(items, (item) => {
      return (
        moment(moment.now()).isBetween(item.start, item.end, "day", "[]") &&
        item.active &&
        (item.users || []).includes(this.props.session.user.UserType)
      );
    });
    return _.orderBy(result, "id", "desc")[0] || {};
  };

  componentDidUpdate = (prevProps, prevState) => {
    // if (!prevProps.session.authenticated && this.props.session.authenticated) {
    //   this.announce();
    // }
  };

  dontShowAgain = (e) => {
    e.preventDefault();
    const { cookies } = this.props;
    cookies.set(this.generateKey(), this.state.announcement.id);
    this.hide();
  };

  hide = () => {
    this.setState({ showNotification: false });
  };
  show = () => {
    this.setState({ showNotification: true });
  };
  render() {
    let { showNotification } = this.state;
    const announcement = this.state.announcement;
    let links = announcement && announcement.links ? announcement.links : [];
    return showNotification ? (
      <ConfirmationModal
        size="2xl"
        title="Hello and Welcome to Tosca HUB!"
        brand="primary"
        show={true}
        onClose={this.hide}
      >
        <p>
          <span className="tw-text-lg md:tw-text-xl tw-font-normal tw-text-dark">
            {announcement.subtitle}
          </span>
        </p>
        <p
          className="text-align-left tw-text-justify tw-leading-relaxed tw-tracking-wide announcement"
          dangerouslySetInnerHTML={{ __html: announcement.body }}
        ></p>
        <div className="modal-btns">
          {links.map((link, index) => {
            const linkUrl = link.url.replace("{docUrl}", config.docUrl);
            return (
              <form
                key={index}
                action={linkUrl}
                method="GET"
                target="_blank"
                className="tw-block"
              >
                <button type="submit" className="tw-w-full">
                  {link.title}
                </button>
              </form>
            );
          })}

          <div className="tw-flex tw-justify-center">
            <a
              href="/"
              role="button"
              onClick={this.dontShowAgain}
              className="tw-italic tw-text-sm tw-underline tw-text-center tw-text-gray-600"
            >
              Don't show this again
            </a>
          </div>
        </div>
      </ConfirmationModal>
    ) : null;
  }
}

const mapState = ({ login, session }) => ({
  login: login,
  session: session,
});

export default withCookies(connect(mapState)(Announcement));
