import React from "react";
import { AdvancedFilter, SortFilterBar } from "./../../../../components";
import Loader from "react-loader-spinner";
import SortButton from "./../../../../components/SortButton";
import moment from "moment";
import _ from "lodash";
import "./style.css";

const CollectionLogs = (props) => {
  const {
    orders,
    showFilter,
    filterList,
    setFilter,
    filterOptions,
    organizations,
    setOptionsState,
    optionsState,
    onKeywordSearch,
    orderSort,
    sendExportData,
    exportHeaders,
    setShowFilter,
    loading,
    headers,
    paginator,
  } = props;

  return (
    <div>
      {showFilter ? (
        <AdvancedFilter
          backButtonLabel="Collection Order Logs"
          filterList={filterList}
          setFilter={setFilter}
          type="collections"
          filterOptions={filterOptions}
          organizations={organizations}
          onBackButtonClick={() =>
            setOptionsState({ ...optionsState, showFilter: false })
          }
        />
      ) : (
        <div style={{ display: "none" }} />
      )}
      <div style={{ display: optionsState.showFilter ? "none" : "block" }}>
        <div className="header-info">
          <div className="tw-flex tw-items-baseline">
            <h3 id="collection-order-logs-header">Collection Order Logs</h3>
          </div>
        </div>
        <div className="tw-bg-white tw-px-2 tw-py-2">
          <SortFilterBar
            searchKeyword={optionsState.searchKeyword}
            onKeywordChange={onKeywordSearch}
            showSort={false}
            orderSort={orderSort}
            list={optionsState.sortList}
            getExportData={sendExportData}
            headers={exportHeaders}
            disabled={orders.length <= 0}
            showFilter={() => {
              setShowFilter(true);
            }}
            SearchFieldLabel="Enter Search Criteria"
            searchPlaceholderText="User, Ref#, QTY, Size"
            HideFilterOption={false}
            filter_options={optionsState.filterOptions}
            fileType="Collection Order Logs"
          />
          <div className="tw-flex tw-flex-col tw-bg-white">
            <div className="tw--my-2 tw-py-2 tw-overflow-x-auto tw-sm:-mx-6 tw-sm:px-6 tw-lg:-mx-8 tw-lg:px-8">
              <div className="tw-align-middle tw-inline-block tw-min-w-full tw-shadow tw-overflow-hidden tw-sm:rounded-lg tw-border-b tw-border-gray-200">
                {loading ? (
                  <div className="loader-container tw-flex tw-justify-center tw-py-10">
                    <Loader
                      type="Oval"
                      color="rgba(246,130,32,1)"
                      height="50"
                      width="50"
                    />
                  </div>
                ) : (
                  <table className="tw-min-w-full">
                    <thead>
                      <tr className="tw-bg-tosca-gray">
                        {headers.map((h, index) => (
                          <SortButton
                            key={index}
                            orderSort={orderSort}
                            sortField={h.field}
                            render={({ data }) => (
                              <th
                                onClick={data.clickHandler}
                                className="tw-px-3 tw-py-3 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-text-left tw-text-xs tw-leading-4 tw-font-medium tw-text-gray-900 tw-uppercase tw-tracking-wider tw-cursor-pointer hover:tw-bg-gray-300 tw-underline col-sort-header"
                                style={{
                                  position: "relative",
                                }}
                              >
                                <div className="tw-w-full tw-inline-block ">
                                  {h.colTitle}
                                </div>
                                <div
                                  className="tw-w-1/4 tw-inline-block sort-arrow tw-text-right"
                                  style={{
                                    position: "absolute",
                                    top: "33%",
                                    right: 10,
                                  }}
                                >
                                  {optionsState.sortedColumn === h.field
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
                      {orders.map((order, index) => {
                        return (
                          <React.Fragment key={index}>
                            <tr
                              className={
                                order.isSuccess
                                  ? "hover:tw-bg-tosca-alice-blue hover:tw-text-gray-900"
                                  : "hover:tw-bg-red-300 hover:tw-text-gray-900 tw-bg-red-200"
                              }
                            >
                              <td className="tw-px-3 tw-py-4 tw-border-b">
                                {order.customer_name}
                              </td>
                              <td className="tw-px-3 tw-py-4 tw-border-b tw-whitespace-nowrap">
                                {moment
                                  .utc(order.header.pickupTimeFrom)
                                  .format("ll")}
                              </td>
                              <td className="tw-px-3 tw-py-4 tw-border-b">
                                {order.po_no}
                              </td>
                              <td className="tw-px-3 tw-py-4 tw-border-b">
                                {_.get(order, "itemId", "-")}
                                {/* Todo - need to check, is this colunm correct ?  */}
                              </td>
                              <td className="tw-px-3 tw-py-4 tw-border-b">
                                {order.qty}
                              </td>
                              <td className="tw-px-3 tw-py-4 tw-border-b">
                                {order.isSuccess ? "YES" : "NO"}
                              </td>
                              <td className="tw-px-3 tw-py-4 tw-border-b">
                                {order.user}
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
          <div
            className="pagination-comp tw-flex tw-justify-center"
            style={{ display: loading ? "none" : "" }}
          >
            {paginator.links((num) =>
              setOptionsState({ ...optionsState, currentPage: num }),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionLogs;
