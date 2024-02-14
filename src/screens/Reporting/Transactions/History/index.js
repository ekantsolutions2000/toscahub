import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import moment from "moment";
import Loader from "react-loader-spinner";
import Paginator from "../../../../utils/paginator/Paginator";
import { transactionReportActions } from "./../../../../actions";
import SortButton from "../../../../components/SortButton";
import { determineNavStyling } from "../../../../components/Nav/determineNavStyling";

class TransactionHistory extends Component {
  state = {
    transactionReportList: [],
    sortedColumn: "",
    currentPage: 1,
    perPage: 25,
    headers: [
      { colTitle: "Type", field: "transactionDetail.itemId" },
      { colTitle: "Size", field: "transactionDetail.itemId" },
      { colTitle: "Qty", field: "transactionDetail.quantity" },
      { colTitle: "Ship From", field: "shipFrom.addressName" },
      { colTitle: "Ship To", field: "shipTo.addressName" },
      { colTitle: "Date", field: "transactionDetail.transactionDate" },
      { colTitle: "PO No", field: "transactionDetail.purchaseOrder" },
      { colTitle: "BOL No", field: "transactionDetail.billOfLading" },
    ],
    width: window.innerWidth,
  };

  componentDidMount() {
    determineNavStyling(this.props.location.pathname);
    this.fetchTransactionReportList();
    window.addEventListener("resize", this.updateDimensions);
  }

  componentDidUpdate = (prevProps, prevState) => {
    const prevToken = _.get(prevProps, "user.accessToken", "");
    const accessToken = _.get(this.props, "user.accessToken", "");
    if (accessToken !== prevToken) this.fetchTransactionReportList();

    if (prevProps.fetching && this.props.fetched) {
      this.resetInternalState();
    }
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth });
  };

  resetInternalState = () => {
    this.setState({
      transactionReportList: this.props.transactionReportList,
      sortedColumn: "",
    });
  };

  fetchTransactionReportList = () => {
    const accessToken = _.get(this.props, "user.accessToken", false);
    if (!accessToken) return;

    const filter = "all";
    this.props.dispatch(
      transactionReportActions.fetchTransactionReportList(
        this.props.user.CustomerInfo.CustID,
        filter,
        this.props.user.accessToken,
      ),
    );
  };

  orderSort = (desc, field) => {
    let sorted = _.orderBy(
      this.state.transactionReportList,
      field,
      desc ? "desc" : "asc",
    );
    this.setState({
      transactionReportList: sorted,
      sortedColumn: field,
    });
  };

  render() {
    const loading = this.props.fetching;
    let transactionReportList = this.state.transactionReportList;
    const headers = this.state.headers;
    let paginator = Paginator.paginate(
      transactionReportList,
      this.state.currentPage,
      this.state.perPage,
      this.state.width > 425 ? 6 : 1,
    );
    transactionReportList = paginator.getItems();

    return (
      <div>
        <div>
          <div className="header-info">
            <div className="tw-flex tw-items-baseline">
              <h3>Transaction History</h3>
            </div>
          </div>
          <div className="tw-bg-white tw-px-2 tw-py-2">
            <div className="tw-flex tw-flex-col tw-bg-white">
              <div className="tw--my-2 tw-py-2 tw-overflow-x-auto tw-sm:-mx-6 tw-sm:px-6 tw-lg:-mx-8 tw-lg:px-8">
                <div className="tw-align-middle tw-inline-block tw-min-w-full tw-shadow tw-overflow-hidden tw-sm:rounded-lg tw-border-b tw-border-gray-200">
                  <table className="tw-min-w-full">
                    <thead>
                      <tr className="tw-bg-tosca-gray">
                        {headers.map((h, index) => (
                          <SortButton
                            key={index}
                            orderSort={this.orderSort}
                            sortField={h.field}
                            render={({ data }) => (
                              <th
                                onClick={data.clickHandler}
                                className="tw-px-3 tw-py-3 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-left tw-text-xs tw-leading-4 tw-font-medium tw-text-gray-900 tw-uppercase tw-tracking-wider tw-cursor-pointer hover:tw-bg-gray-300 tw-underline col-sort-header"
                                style={{
                                  position: "relative",
                                }}
                              >
                                <div className="tw-w-3/4 tw-inline-block">
                                  {h.colTitle}
                                </div>
                                <div
                                  className="tw-w-1/4 tw-inline-block sort-arrow tw-text-right"
                                  style={{
                                    position: "absolute",
                                    top: "50%",
                                    right: 3,
                                    transform: "translateY(-50%)",
                                  }}
                                >
                                  {this.state.sortedColumn === h.field
                                    ? data.activeIcon
                                    : null}
                                </div>
                              </th>
                            )}
                          />
                        ))}
                      </tr>
                    </thead>
                    <tbody className="tw-bg-white">
                      {transactionReportList.map((transaction, index) => (
                        <React.Fragment key={index}>
                          <tr className="hover:tw-bg-tosca-alice-blue hover:tw-text-gray-900">
                            <td className="tw-px-3 tw-py-4 tw-border-b">
                              {transaction.transactionDetail.itemClassId}
                            </td>
                            <td className="tw-px-3 tw-py-4 tw-border-b tw-whitespace-nowrap">
                              {transaction.transactionDetail.itemId}
                            </td>
                            <td className="tw-px-3 tw-py-4 tw-border-b">
                              {transaction.transactionDetail.quantity}
                            </td>
                            <td className="tw-px-3 tw-py-4 tw-border-b">
                              {transaction.shipFromName
                                ? transaction.shipFromName
                                : ""}
                            </td>
                            <td className="tw-px-3 tw-py-4 tw-border-b">
                              {transaction.shipToName}
                            </td>
                            <td className="tw-px-3 tw-py-4 tw-border-b tw-whitespace-nowrap">
                              {moment(
                                transaction.transactionDetail.transactionDate,
                              ).format("ll")}
                            </td>
                            <td className="tw-px-3 tw-py-4 tw-border-b">
                              {transaction.transactionDetail.purchaseOrder}
                            </td>
                            <td className="tw-px-3 tw-py-4 tw-border-b tw-whitespace-nowrap-">
                              {transaction.transactionDetail.billOfLading}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}

                      {loading ? (
                        <tr>
                          <td colSpan="9">
                            <div className="tw-flex tw-items-center tw-justify-center tw-py-16- tw-text-gray-500 tw-font-light tw-text-xl">
                              <div className="loader-container tw-flex tw-justify-center tw-py-10">
                                <Loader
                                  type="Oval"
                                  color="rgba(246,130,32,1)"
                                  height="50"
                                  width="50"
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        transactionReportList.length === 0 && (
                          <tr>
                            <td colSpan="9">
                              <div className="tw-flex tw-items-center tw-justify-center tw-py-16 tw-text-gray-500 tw-font-light tw-text-xl">
                                No records found.
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div
              className="pagination-comp tw-flex tw-justify-center"
              style={{
                display:
                  loading || transactionReportList.length === 0 ? "none" : "",
              }}
            >
              {paginator.links((num) => this.setState({ currentPage: num }))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapState = ({ transactionReportList, session }) => ({
  transactionReportList: transactionReportList.transactionReportList,
  user: session.user,
  fetching: transactionReportList.fetching,
  fetched: transactionReportList.fetched,
});

export default connect(mapState)(TransactionHistory);
