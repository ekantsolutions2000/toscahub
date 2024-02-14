import React, { Component } from "react";
import "./style.css";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";
import ReactTable from "react-table";
import moment from "moment";
// import { DateFilter } from "../../components";
import Modal from "react-modal";
import { logo } from "../../images";
import { CSVLink } from "react-csv/lib";

Modal.setAppElement("#root");
// TODO: This component is not used anywhere; Remove this.
const DateFilter = <div>Configure Datefilter to support react V18</div>;
export default class OrderList extends Component {
  constructor() {
    super();
    this.state = {
      showOrderDetails: false,
      clickedOrder: null,
      csvData: [],
    };
  }

  getCSVData = () => {
    this.setState({
      csvData: this.reactTable.getResolvedState().data,
    });
  };

  closeModal = () => {
    this.setState({
      showOrderDetails: false,
      clickedOrder: null,
    });
  };

  dateFormat = (date) => {
    return moment(date).isValid()
      ? moment(date).add(5, "hours").format("L")
      : "";
  };

  orderFormat = (date) => {
    return moment(date).isValid() ? moment(date).valueOf() : "";
  };

  filterCaseInsensitive = (filter, row) => {
    const id = filter.pivotId || filter.id;
    return row[id] !== undefined
      ? String(row[id].toString().toLowerCase()).includes(
          filter.value.toLowerCase(),
        )
      : true;
  };

  render() {
    const { orders, loading } = this.props;
    const columns = [
      {
        Header: "Order Date",
        id: "order-date",
        accessor: (d) => d.orderDate || "",
        Cell: (props) => (
          <span className="date-col">
            {moment(props.value).isValid()
              ? moment(props.value).format("L")
              : ""}
          </span>
        ),
        filterMethod: (filter, row) => {
          if (
            filter.value === "all" ||
            filter.value === null ||
            filter.value === undefined ||
            filter.value === ""
          )
            return true;
          else
            return (
              moment(row[filter.id]).format("L") === filter.value.format("L")
            );
        },
        Filter: ({ filter, onChange }) => (
          <DateFilter onChange={(date) => onChange(date)} />
        ),
        maxWidth: 100,
      },
      {
        Header: "Order No.",
        accessor: "orderNumber",
        maxWidth: 60,
      },
      {
        Header: "Status",
        accessor: "statusDesc",
        maxWidth: 80,
      },
      {
        Header: "Ship To Location",
        accessor: "shipToLocation",
      },
      {
        Header: "Container Type",
        accessor: "containerType",
        maxWidth: 100,
      },
      {
        Header: "Quantity",
        accessor: "quantity",
        maxWidth: 80,
      },
      {
        Header: "PO No.",
        accessor: "purchaseOrderNumber",
        maxWidth: 80,
      },
      {
        Header: "Requested Delivery Date",
        id: "rd-date",
        accessor: (d) => d.requestedDeliveryDate || "",
        Cell: (props) => (
          <span className="date-col">
            {moment(props.value).isValid ? moment(props.value).format("L") : ""}
          </span>
        ),
        filterMethod: (filter, row) => {
          if (
            filter.value === "all" ||
            filter.value === null ||
            filter.value === undefined ||
            filter.value === ""
          )
            return true;
          else
            return (
              moment(row[filter.id]).format("L") === filter.value.format("L")
            );
        },
        Filter: ({ filter, onChange }) => (
          <DateFilter onChange={(date) => onChange(date)} />
        ),
        maxWidth: 100,
      },
      {
        Header: "Estimated Delivery Date",
        id: "ed-date",
        accessor: (d) => d.estimatedDeliveryDate || "",
        Cell: (props) => (
          <span className="date-col">
            {moment(props.value).isValid()
              ? moment(props.value).format("L")
              : ""}
          </span>
        ),
        filterMethod: (filter, row) => {
          if (
            filter.value === "all" ||
            filter.value === null ||
            filter.value === undefined ||
            filter.value === ""
          )
            return true;
          else
            return (
              moment(row[filter.id]).format("L") === filter.value.format("L")
            );
        },
        Filter: ({ filter, onChange }) => (
          <DateFilter onChange={(date) => onChange(date)} />
        ),
        maxWidth: 100,
      },
    ];
    return (
      <div>
        <ReactTable
          className={"-striped -highlight order-list"}
          ref={(r) => (this.reactTable = r)}
          data={orders}
          columns={columns}
          filterable={true}
          sortable={true}
          loading={loading}
          defaultPageSize={5}
          defaultFilterMethod={this.filterCaseInsensitive}
          defaultSorted={[
            {
              id: "order-date",
              desc: true,
            },
          ]}
          getTheadTrProps={() => ({
            style: {
              backgroundColor: "rgb(246, 130,32)",
              color: "white",
              fontWeight: "bolder",
              zIndex: 0,
            },
          })}
          getTheadThProps={() => ({
            style: {
              whiteSpace: "unset",
              margin: 0,
              padding: "10px",
              lineHeight: "100%",
              border: "ridge 0.0119pt rgb(126,212,247)",
            },
          })}
          getTheadFilterTrProps={() => ({
            style: { backgroundColor: "rgb(214,229,243)" },
          })}
          getTheadFilterThProps={() => ({
            style: { position: "inherit", overflow: "inherit" },
          })}
          getTdProps={() => ({ style: { whiteSpace: "unset" } })}
          getTrProps={(state, rowInfo, column, instance) => {
            return {
              onClick: (e, handleOriginal) => {
                this.setState({
                  showOrderDetails: true,
                  clickedOrder: rowInfo,
                });
                if (handleOriginal) {
                  handleOriginal();
                }
              },
              style: { cursor: "pointer" },
            };
          }}
        />
        <CSVLink
          className="pull-right"
          filename="tosca_order.csv"
          onClick={this.getCSVData}
          data={this.state.csvData}
        >
          Download Data
        </CSVLink>
        <Modal
          isOpen={this.state.showOrderDetails}
          style={customStyles}
          onRequestClose={this.closeModal}
        >
          {this.state.clickedOrder ? (
            <div className="order-details-modal">
              <div className="order-details-close" onClick={this.closeModal}>
                <span className="glyphicon glyphicon-remove-sign" />
              </div>
              <div className="order-details-header">
                <img src={logo} alt="Tosca" />
                <h1>Order {this.state.clickedOrder.original.orderNo}</h1>
              </div>
              <div className="order-details-data">
                <p>
                  <label>Order Date</label>
                  {this.dateFormat(this.state.clickedOrder.original.orderDate)}
                </p>
                <p>
                  <label>Status</label>
                  {this.state.clickedOrder.original.statusDesc}
                </p>
                <p>
                  <label>Ship to Location</label>
                  {this.state.clickedOrder.original.shipToLocation}
                </p>
                <p>
                  <label>Container Type</label>
                  {this.state.clickedOrder.original.containerType}
                </p>
                <p>
                  <label>Quantity</label>
                  {this.state.clickedOrder.original.quantity}
                </p>
                <p>
                  <label>Purchase Order Number</label>
                  {this.state.clickedOrder.original.purchaseOrderNumber}
                </p>
                <p>
                  <label>Bill of Lading</label>
                  {this.state.clickedOrder.original.billOfLading}
                </p>
                <p>
                  <label>Requested Delivery Date</label>
                  {this.dateFormat(
                    this.state.clickedOrder.original.requestedDeliveryDate,
                  )}
                </p>
                <p>
                  <label>Scheduled Ship Date</label>
                  {this.dateFormat(
                    this.state.clickedOrder.original.scheduledShipDate,
                  )}
                </p>
                <p>
                  <label>Estimated Delivery Date</label>
                  {this.dateFormat(
                    this.state.clickedOrder.original.estimatedDeliveryDate,
                  )}
                </p>
                <p>
                  <label>Used as Lid?</label>
                  {this.state.clickedOrder.original.lid}
                </p>
                <p>
                  <label>Order Placed By</label>
                  {this.state.clickedOrder.original.addedBy}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: "none" }} />
          )}
        </Modal>
      </div>
    );
  }
}

const { array, bool } = PropTypes;

const customStyles = {
  content: {
    top: "40%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,.7)",
  },
};

OrderList.propTypes = {
  orders: array.isRequired,
  loading: bool,
};
