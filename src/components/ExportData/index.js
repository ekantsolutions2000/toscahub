import React, { Component } from "react";
import "./style.css";
import PropTypes from "prop-types";
import { sortfilter_icons } from "../../images";
import { CSVLink } from "react-csv/lib";
import { connect } from "react-redux";
import moment from "moment";
import { customerActions } from "../../actions";

class ExportData extends Component {
  constructor() {
    super();
    this.state = {
      allData: true,
      filteredData: false,
      isDataFiltered: false,
      data: [],
    };
  }

  setExportOptionFromProp = () => {
    return this.setState({
      filteredData: this.props.isDataFiltered,
      allData: !this.props.isDataFiltered,
    });
  };

  componentDidMount() {
    if (this.props.isDataFiltered !== null) {
      this.setExportOptionFromProp();
    }
    this.props.dispatch(
      customerActions.fetchCustomerInfo(
        this.props.accessToken,
        this.props.user.CustomerInfo.CustID,
      ),
    );
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.isDataFiltered !== this.props.isDataFiltered) {
      this.setExportOptionFromProp();
    }
  };

  getFileName = () => {
    let date = moment().format("MM/DD/YYYY");
    return `${this.props.customerInfo.customerName}_${this.props.fileType} ${date}.csv`;
  };

  dataToExport = (e) => {
    this.setState({
      data: this.props.getData(this.state.allData),
    });
  };

  render() {
    let headers = this.props.headers;
    let total = this.props.getData(true).length;
    let count = this.props.getData(this.state.allData).length;

    return (
      <div id="export-data__comp">
        <div>
          <p className="ed-label">Export Data</p>
        </div>
        <div>
          <p id="filtered-data-label">All Data</p>
          <input
            type="radio"
            name="dataDownload"
            value="allData"
            checked={this.state.allData}
            onChange={() =>
              this.setState({ allData: true, filteredData: false })
            }
          />
        </div>
        {!this.props.hideFilteredOption && (
          <div>
            <p id="filtered-data-label">Filtered Data</p>
            <input
              type="radio"
              name="dataDownload"
              value="filteredData"
              checked={this.state.filteredData}
              onChange={() =>
                this.setState({ allData: false, filteredData: true })
              }
            />
          </div>
        )}
        <div className="export-cont">
          {headers ? (
            <CSVLink
              className="ex-label"
              onClick={this.dataToExport}
              filename={this.getFileName()}
              data={this.state.data}
              headers={headers}
            >
              {`Export ${count} of ${total} records to XLS`}
            </CSVLink>
          ) : (
            <CSVLink
              className="ex-label"
              onClick={this.dataToExport}
              filename={this.getFileName()}
              data={this.state.data}
            >
              {`Export ${count} of ${total} records to XLS`}
            </CSVLink>
          )}
          <img src={sortfilter_icons.Download} alt="download" />
        </div>
      </div>
    );
  }
}

const mapState = ({ session, customer }) => ({
  user: session.user,
  accessToken: session.user.accessToken,
  customerInfo: customer.customerInfo,
});

export default connect(mapState)(ExportData);

const { func, string } = PropTypes;

ExportData.propTypes = {
  getData: func.isRequired,
  filename: string,
};

ExportData.defaultProps = {
  isDataFiltered: null,
  fileType: "",
};
