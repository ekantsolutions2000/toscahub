import React, { useState, useEffect } from "react";
import CollectionLogs from "./CollectionLogs";
import moment from "moment";
import _ from "lodash";
import Paginator from "../../../utils/paginator/Paginator";
import FilterByText from "../../../utils/Filter/FilterByText";
import useGetCollectionLogs from "../../../hooks/Order/useGetCollectionLogs";
import useGetOrganizations from "../../../hooks/CustomerProfile/useGetOrganizations";

const CollectionOrderLogs = (props) => {
  const [orders, setOrders] = useState([]);

  const [optionsState, setOptionsState] = useState({
    currentPage: 1,
    perPage: 25,
    showFilter: false,
    searchKeyword: "",
    filterOptions: null,
    filteredOrders: [],
    filteredItems: [],
    sortedColumn: "",
    sortList: [{ value: "", label: "" }],
    customerOptions: [],
    selectedCustomerOption: null,
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const organizationsQuery = useGetOrganizations();
  const organizations = organizationsQuery.data || [];

  const collectionLogsQuery = useGetCollectionLogs();
  const collectionOrders = collectionLogsQuery.data || [];

  useEffect(() => {
    if (!_.isEmpty(collectionOrders)) {
      collectionOrders.forEach((order) => {
        organizations.forEach((organization) => {
          if (order.organization_id === organization.organizationId) {
            return (order.organizationName = organization.organizationName);
          }
        });
      });
      setOrders(collectionOrders);
    }
  }, [collectionOrders]); //eslint-disable-line

  useEffect(() => {
    setOptionsState({
      ...optionsState,
      filteredOrders: orders,
      filteredItems: orders,
    });
  }, [orders]); //eslint-disable-line

  useEffect(() => {
    let filteredItems;
    const searchFields = ["customer_name", "itemId", "po_no", "qty", "user"];

    filteredItems = FilterByText.filter(optionsState.filteredOrders)
      .keyword(optionsState.searchKeyword, searchFields)
      .get();

    setOptionsState({
      ...optionsState,
      filteredItems: filteredItems,
    });
  }, [optionsState.searchKeyword, optionsState.filteredOrders]); //eslint-disable-line

  useEffect(() => {
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []); //eslint-disable-line

  const resizeWindow = () => {
    setWindowWidth(window.innerWidth);
  };

  const orderSort = (desc, field) => {
    let { filteredOrders } = optionsState;
    let sortedOrders = _.orderBy(filteredOrders, field, desc ? "desc" : "asc");
    setOptionsState({
      ...optionsState,
      filteredOrders: sortedOrders,
      sortedColumn: field,
    });
  };

  const onKeywordSearch = (value) => {
    setOptionsState({
      ...optionsState,
      searchKeyword: value.toString(),
      currentPage: 1,
    });
  };

  const sendExportData = (allData) => {
    const data = allData ? orders : optionsState.filteredItems;

    let formattedOrders = data.map((order) => {
      order["export_createdAt"] = moment.utc(order["createdAt"]).format("ll");
      order["export_reqDelDate"] = moment.utc(order["reqDelDate"]).format("ll");
      order["export_isSuccess"] = order["isSuccess"] ? "Yes" : "No";
      order["export_customerPickUp"] = order["customerPickUp"] ? "Yes" : "No";

      return order;
    });

    return formattedOrders;
  };

  const showFilter = (val) => {
    setOptionsState({ ...optionsState, showFilter: val });
  };

  const setFilterOptions = (filterObject, result) => {
    setOptionsState({
      ...optionsState,
      showFilter: false,
      filterOptions: filterObject,
      filteredOrders: result,
      currentPage: 1,
      searchKeyword: "",
    });
  };

  const loading = collectionLogsQuery.isLoading;
  const paginator = Paginator.paginate(
    optionsState.filteredItems,
    optionsState.currentPage,
    optionsState.perPage,
    windowWidth > 515 ? 6 : 1,
  );
  const headers = [
    { colTitle: "ORGANIZATION", field: "customer_name" },
    { colTitle: "REQ PICK UP DATE", field: "pickup_time_from" },
    { colTitle: "SHIPPER REF#", field: "po_no" },
    { colTitle: "RPC SIZE", field: "itemId" },
    { colTitle: "QUANTITY", field: "qty" },
    { colTitle: "SUCCESSFULLY TRANSMITTED", field: "isSuccess" },
    { colTitle: "USER", field: "user" },
  ];
  const exportHeaders = [
    { label: "ORGANIZATION", key: "customer_name" },
    { label: "REQ PICK UP DATE", key: "pickup_time_from" },
    { label: "SHIPPER REF#", key: "po_no" },
    { label: "RPC SIZE", key: "itemId" },
    { label: "QUANTITY", key: "qty" },
    { label: "SUCCESSFULLY TRANSMITTED", key: "isSuccess" },
    { label: "USER", key: "user" },
  ];

  return (
    <div className="">
      <CollectionLogs
        showFilter={optionsState.showFilter}
        filterList={orders}
        setFilter={setFilterOptions}
        filterOptions={optionsState.filterOptions}
        organizations={organizations}
        setOptionsState={setOptionsState}
        optionsState={optionsState}
        onKeywordSearch={onKeywordSearch}
        orderSort={orderSort}
        sendExportData={sendExportData}
        exportHeaders={exportHeaders}
        orders={paginator.getItems()}
        setShowFilter={showFilter}
        loading={loading}
        headers={headers}
        paginator={paginator}
      />
    </div>
  );
};

export default CollectionOrderLogs;
