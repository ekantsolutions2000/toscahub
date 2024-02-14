import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import "./style.css";
import { sortfilter_icons } from "../../../images";
import faqData from "./data.json";
import { config } from "../../../utils/conf";
import { determineNavStyling } from "../../../components/Nav/determineNavStyling";
import _ from "lodash";

class FAQ extends Component {
  state = {
    selectedTopic: "All",
    searchText: "",
    openRow: -1,
    data: [],
    width: window.innerWidth,
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth });
  };

  componentDidMount() {
    this.loadData();
    determineNavStyling(this.props.location.pathname);
    window.addEventListener("resize", this.updateDimensions);
  }

  loadData() {
    this.setState({
      data: faqData,
    });
  }

  getHtmlAnswer(q) {
    var answer = q.Answer;
    const organizationName = _.get(
      this.props.user,
      "CustomerInfo.CustName",
      "",
    );

    answer = answer.replace(
      /{defaultCSRMail}/gi,
      config.defaultCSREmailAddress,
    );
    answer = answer.replace(/{docUrl}/gi, config.docUrl);
    answer = answer.replace(/{organization}/gi, organizationName);

    return <span dangerouslySetInnerHTML={{ __html: answer }} />;
  }

  render() {
    const { Search } = sortfilter_icons;
    const topics = [...new Set(this.state.data.map((q) => q.Topic))];

    const numOfTopicsPerRow = this.state.width <= 375 ? 2 : 3;
    const numOfTopic = topics.length;

    const numOfFullRows = Math.floor(numOfTopic / numOfTopicsPerRow);
    const numOfFullRowTopics = numOfFullRows * numOfTopicsPerRow;
    const numOfLastRowTopic = numOfTopic - numOfFullRowTopics;
    const lastRowTopicClass =
      numOfLastRowTopic === 1 ? "tw-w-full" : "tw-w-1/" + numOfLastRowTopic;

    return (
      <div id="faq-page">
        <h3 className="tw-text-center tw-pb-10 tw-mt-0">
          Hello! How can we help you?
        </h3>

        <div className="search tw-mb-6">
          <div style={{ width: "100%" }}>
            <div className="search-box">
              <input
                style={{ paddingRight: "32px" }}
                type="text"
                value={this.state.searchText}
                onChange={(e) => {
                  this.setState({
                    searchText: e.target.value,
                    openRow: -1,
                  });
                }}
                placeholder="Type Keywords to Find Answers"
              />
              <img src={Search} alt="search" />
            </div>
          </div>
        </div>
        <div
          className={
            this.state.searchText.trim().length ? "tiles disable" : "tiles"
          }
        >
          {topics.map((topic, i) => (
            <div
              style={{
                "--right-margin":
                  (i + 1) %
                    (i < numOfFullRowTopics
                      ? numOfTopicsPerRow
                      : numOfLastRowTopic) ===
                  0
                    ? "0px"
                    : "10px",
                "--width-css":
                  i < numOfFullRowTopics
                    ? "calc((100% -  " +
                      (numOfTopicsPerRow - 1) * 10 +
                      "px) / " +
                      numOfTopicsPerRow +
                      ")"
                    : "calc((100% - " +
                      (numOfLastRowTopic - 1) * 10 +
                      "px) / " +
                      numOfLastRowTopic +
                      ")",
              }}
              key={i}
              className={
                i < numOfFullRowTopics
                  ? topic === this.state.selectedTopic
                    ? numOfTopicsPerRow === 2
                      ? "tw-w-1/2 tile selected"
                      : "tw-w-1/3 tile selected"
                    : numOfTopicsPerRow === 2
                    ? "tw-w-1/2 tile"
                    : "tw-w-1/3 tile"
                  : topic === this.state.selectedTopic
                  ? lastRowTopicClass + " tile selected"
                  : lastRowTopicClass + " tile"
              }
            >
              <button
                id={i}
                className=""
                onClick={(e) => {
                  this.setState({
                    selectedTopic:
                      this.state.selectedTopic === topic ? "All" : topic,
                    openRow: -1,
                  });
                }}
              >
                {topic}
              </button>
            </div>
          ))}
        </div>
        <div className="qa-section">
          <div className="title tw-text-tosca-orange tw-mt-4">
            {this.state.searchText.trim().length
              ? "Search"
              : this.state.selectedTopic}{" "}
            - Frequently Asked Questions
          </div>
          {this.state.data
            .filter((q) => {
              return q.Active;
            })
            .filter((q) => {
              if (this.state.searchText.trim().length) {
                return (
                  q.Question.toLowerCase().includes(
                    this.state.searchText.toLowerCase(),
                  ) ||
                  q.Answer.toLowerCase().includes(
                    this.state.searchText.toLowerCase(),
                  )
                );
              } else if (this.state.selectedTopic === "All") {
                return true;
              } else {
                return q.Topic === this.state.selectedTopic;
              }
            })
            .map((q, i) => {
              let answer = q.Answer;
              answer = this.getHtmlAnswer(q);

              return (
                <div
                  key={i}
                  className={
                    this.state.openRow === i ? "qa-row open" : "qa-row"
                  }
                >
                  <div
                    className="question"
                    onClick={() => {
                      this.setState({
                        openRow: this.state.openRow === i ? -1 : i,
                      });
                    }}
                  >
                    {q.Question}
                  </div>
                  <div key={i} className="answer">
                    <div className="tw-p-5 xs:tw-py-5">{answer}</div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="show-all tw-mt-5 tw-mb-5">
          <button
            className="show-all-button tw-bg-gray-200 hover:tw-bg-gray-400 tw-p-3  tw-rounded-lg"
            onClick={() =>
              this.setState({
                selectedTopic: "All",
                openRow: -1,
                searchText: "",
              })
            }
          >
            See All Questions
          </button>
        </div>
      </div>
    );
  }
}

const { object, bool, string } = PropTypes;

FAQ.propTypes = {
  user: object.isRequired,
  authenticated: bool.isRequired,
  checked: bool.isRequired,
  accessToken: string,
};

const mapState = ({ session }) => ({
  user: session.user,
  authenticated: session.authenticated,
  checked: session.checked,
  accessToken: session.user.accessToken,
});

export default connect(mapState)(FAQ);
