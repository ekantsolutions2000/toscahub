import React, { Component } from "react";
import "./style.css";
import { connect } from "react-redux";
import { NewsList, DashboardRecentOrders } from "../../components";
import { containers, icons } from "../../images";
import { determineNavStyling } from "../../components/Nav/determineNavStyling";
import news from "./news/news.json";
import Tooltip from "../../components/Tooltip";

import { statisticsActions, customerActions } from "../../actions";
import isEmpty from "lodash/isEmpty";
import LoadingData from "../../components/LoadingData";
import Numeral from "numeral";
import "react-toastify/dist/ReactToastify.css";
import {
  emailConfigs,
  EmailConfigHelper,
} from "./../../components/HOC/withEmail/withEmail";

class Home extends Component {
  componentDidMount() {
    determineNavStyling(this.props.location.pathname);
    const { accessToken, transactionSummary } = this.props;
    if (accessToken) {
      if (isEmpty(transactionSummary)) {
        this.fetchTransactionSummary();
      }
    }

    this.props.dispatch(
      customerActions.fetchCustomerInfo(
        this.props.accessToken,
        this.props.user.CustomerInfo.CustID,
      ),
    );
  }

  fetchTransactionSummary = () => {
    const { accessToken, dispatch } = this.props;
    dispatch(statisticsActions.fetchTransactionSummary(accessToken));
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.accessToken !== this.props.accessToken)
      this.fetchTransactionSummary();
  }

  navigateToInvoices = () => {
    this.props.history.push("/invoicing");
  };

  render() {
    const {
      tosca_ltd,
      tosca_new,
      gp,
      hays,
      orbis,
      polymerLogistics_6317,
      polymerLogistics_6332,
      polymerLogistics_6408,
      polymerLogistics_6411,
      polymerLogistics_6425,
    } = containers;
    const totalRPCs = Numeral(this.props.transactionSummary.totalRPCs).format(
      "0,0",
    );
    const outstandingInvoices = Numeral(
      this.props.transactionSummary.outstandingInvoices,
    ).format("$0,0");

    return (
      <div id="home-page">
        <div className="tw-flex tw-flex-row">
          <div className="tw-flex tw-flex-col tw-w-full">
            <h4 className="tw-py-5 xs:tw-py-0 xs:tw-text-base xs:tw-font-normal">
              Welcome to your Tosca Dashboard. Thank you for being a valued
              partner!
            </h4>
            <div className="tw--mx-2">
              <div className="dashboard-nav-tiles">
                <div className="tw-flex tw-justify-around tw-w-full">
                  <Tooltip
                    content={
                      <p className="tw-text-center tw-m-0 tw-py-2 tw-text-gray-600 tw-font-light tw-text-sm">
                        Total RPCs issued from Tosca less returned clean RPCs.
                      </p>
                    }
                    config={{ arrow: false, theme: "light" }}
                  >
                    <div className="dashboard-nav-tile tw-max-w-sm wid xs:tw-w-32 xs:tw-h-24 ">
                      <img alt="Total RPCs" src={icons.container}></img>
                      <div className="tw-text-center">
                        <p className="tw-w-full  xs:tw-text-xs xs:tw-font-bold">
                          YTD Net Issues
                        </p>
                        <p className="text-4xl xs:tw-text-sm ">
                          <LoadingData
                            data={totalRPCs}
                            loading={this.props.fetching}
                          />
                        </p>
                      </div>
                    </div>
                  </Tooltip>

                  <Tooltip
                    content={
                      <p className="tw-text-center tw-m-0 tw-py-2 tw-text-gray-600 tw-font-light tw-text-sm">
                        Total amount outstanding.
                      </p>
                    }
                    config={{ arrow: false, theme: "light" }}
                  >
                    <div
                      className="dashboard-nav-tile tw-max-w-sm xs:tw-w-32 xs:tw-h-24"
                      onClick={this.navigateToInvoices}
                    >
                      <img alt="" src={icons.invoices}></img>
                      <div className="tw-text-center">
                        <p className="tw-w-full  xs:tw-text-xs xs:tw-font-bold ">
                          Outstanding Invoices
                        </p>
                        <p className="text-4xl  xs:tw-text-sm">
                          <LoadingData
                            data={outstandingInvoices}
                            loading={this.props.fetching}
                          />
                        </p>
                      </div>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>

            <DashboardRecentOrders />

            <EmailConfigHelper configName={emailConfigs.CONTACT_MAIL}>
              {(emailConfig) => (
                <h4 className="tw-py-5 xs:tw-text-sm">
                  If you have additional questions, please contact{" "}
                  <a
                    href={`mailto:${emailConfig.getReciepients()}?subject=${
                      this.props.customerInfo.customerName
                    }:`}
                  >
                    {emailConfig.lablel()}
                  </a>
                </h4>
              )}
            </EmailConfigHelper>
            <div className="tosca-news">
              <h3 className="xs:tw-text-sm">Tosca News</h3>
              <NewsList newsItems={news} />
            </div>
          </div>
        </div>

        <div className="tw-flex tw-flex-col tw-w-1/5-">
          <div className="tosca-containers">
            <h4 className="tw-text-tosca-orange xs:tw-text-base">
              Identify Our RPCs
            </h4>
            <div className="container-images- tw-flex tw-justify-between tw-flex-wrap">
              <div className="tw-flex-1 tw-mx-2">
                <div
                  className="tw-h-32"
                  style={{
                    backgroundImage: `url(${tosca_ltd})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <p className="tw-mt-2">ToscaLTD</p>
              </div>
              <div className="tw-flex-1 tw-mx-2">
                <div
                  className="tw-h-32"
                  style={{
                    backgroundImage: `url(${tosca_new})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <p className="tw-mt-2">Tosca (new logo)</p>
              </div>
              <div className="tw-flex-1 tw-mx-2">
                <div
                  className="tw-h-32"
                  style={{
                    backgroundImage: `url(${gp})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <p className="tw-mt-2">Georgia Pacific (GP)</p>
              </div>
              <div className="tw-flex-1 tw-mx-2">
                <div
                  className="tw-h-32"
                  style={{
                    backgroundImage: `url(${hays})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <p className="tw-mt-2">Hays</p>
              </div>

              <div className="tw-flex-1 tw-mx-2">
                <div
                  className="tw-h-32"
                  style={{
                    backgroundImage: `url(${orbis})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <p className="tw-mt-2">Orbis</p>
              </div>
            </div>

            <div className="container-images- tw-flex tw-justify-between tw-flex-wrap">
              <div className="tw-flex-1 tw-mx-2">
                <div
                  className="tw-h-32"
                  style={{
                    backgroundImage: `url(${polymerLogistics_6317})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <p className="tw-mt-2">Polymer Logistics</p>
              </div>
              <div className="tw-flex-1 tw-mx-2">
                <div
                  className="tw-h-32"
                  style={{
                    backgroundImage: `url(${polymerLogistics_6332})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <p className="tw-mt-2">Polymer Logistics</p>
              </div>
              <div className="tw-flex-1 tw-mx-2">
                <div
                  className="tw-h-32"
                  style={{
                    backgroundImage: `url(${polymerLogistics_6408})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <p className="tw-mt-2">Polymer Logistics</p>
              </div>
              <div className="tw-flex-1 tw-mx-2">
                <div
                  className="tw-h-32"
                  style={{
                    backgroundImage: `url(${polymerLogistics_6411})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <p className="tw-mt-2">Polymer Logistics</p>
              </div>
              <div className="tw-flex-1 tw-mx-2">
                <div
                  className="tw-h-32"
                  style={{
                    backgroundImage: `url(${polymerLogistics_6425})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <p className="tw-mt-2">Polymer Logistics</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-info-row"></div>
      </div>
    );
  }
}

const mapState = ({ session, statistics, customer }) => ({
  user: session.user,
  accessToken: session.user.accessToken,
  transactionSummary: statistics.transactionSummary,
  fetching: statistics.fetching,
  fetchError: statistics.error,
  customerInfo: customer.customerInfo,
});

export default connect(mapState)(Home);
