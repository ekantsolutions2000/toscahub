import React, { Component } from "react";
import PropTypes from "prop-types";
import { pagination_icons } from "../../../../images";
import moment from "moment";
import { connect } from "react-redux";
import { transActions } from "../../../../actions";
import ToscaField from "./../../../../components/FormControls/ToscaField";
import _ from "lodash";
import ToolTip from "./../../../../components/Tooltip";
import { CSSTransition } from "react-transition-group";
import Form from "./Form";
import Loader from "react-loader-spinner";
import "./styles.css";
class ReportItem extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false,
      reportId: "",
      form: Form(this),
      isEditMode: false,
      shipToOnFocus: false,
      showLoading: true,
    };
  }

  shipToRef = React.createRef();

  onFormChange = (e) => {
    this.forceUpdate();
  };

  componentDidMount() {
    this.setState({
      reportId: this.props.report._id,
    });
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.isEnteringEditMode(prevState)) return this.resetFields();
    if (prevProps.updating && this.props.updated) return this.closeEdit();
  };

  getShipToOptionForTheReport = () => {
    if (!_.get(this.props.report, "shipToId", undefined)) return null;
    const { report } = this.props;
    return {
      value: report.shipToId,
      label: this.props.shipTos.filter((e) => e.id === report.shipToId)[0]
        ?.addressName,
    };
  };

  resetFields = () => {
    let form = Form(this);
    const { report } = this.props;
    form.shipFrom.value = {
      value: this.props.sourceAddressList.filter(
        (i) => i.addressId === this.props.report.shipFromId,
      )[0].addressId,
      label: this.props.sourceAddressList.filter(
        (i) => i.addressId === this.props.report.shipFromId,
      )[0].addressName,
    };

    let shipTo = this.getShipToOptionForTheReport();
    if (!shipTo || shipTo.value === "") shipTo = null;
    form.qty.value = report.transactionDetail.quantity || "";
    form.shipTo.shipTos = this.props.shipTos;
    form.shipTo.newShipTos = this.props.newShipTos;
    form.shipTo.value = shipTo;
    form.poNo.value = report.transactionDetail.purchaseOrder;
    form.bolNo.value = report.transactionDetail.billOfLading;
    form.date.value = moment(report.transactionDetail.date) || "";
    form.containerType.value = form.containerType
      .options(this.props.orderInventory)
      .find((i) => i.value === report.transactionDetail.itemClassId);

    let xObj = this.props.orderInventory.filter(
      (i) => i.itemId === report.transactionDetail.itemId,
    )[0];
    form.containerSize.value = { ...xObj, label: xObj.modelSize };

    this.setState({
      form: form,
      expanded: true,
    });
  };

  isEnteringEditMode = (prevState) => {
    return !prevState.isEditMode && this.state.isEditMode;
  };

  onEdit = (e) => {
    this.props.checkIsEditMode(true);
    if (!this.state.isEditMode) return this.setState({ isEditMode: true });
    const { report, dispatch, user } = this.props;
    const { form } = this.state;
    if (!form.isFormValid) {
      return alert(form.formErrorMsg);
    }

    let transObject = {
      id: report.id,
      submitted: false,
      shipFromId: form.shipFrom.value.value,
      shipFromName: form.shipFrom.value.label,
      shipToId: form.shipTo.value.value,
      shipToName: form.shipTo.value.label,
      transactionDetail: {
        itemId: form.containerSize.value.value,
        itemClassId: form.containerType.value.value,
        quantity: form.qty.value,
        billOfLading: form.bolNo.value,
        purchaseOrder: form.poNo.value,
        transactionDate: form.date.value,
      },
    };

    dispatch(
      transActions.updatePendingTrans(
        user.OrgId,
        this.props.report._id,
        transObject,
        user.accessToken,
      ),
    );
  };

  closeEdit = () => {
    this.setState({ isEditMode: false });
    this.props.checkIsEditMode(false);
  };

  delete = () => {
    this.props.deleteReportItem(this.props.report.id);
  };

  render() {
    // Styles
    const rep_item = {
        width: "100%",
        borderTop: this.state.expanded
          ? "1px #7ed4f7 solid"
          : "1px #e5e6e7 solid",
        borderBottom: this.state.expanded
          ? "1px #7ed4f7 solid"
          : "1px #e5e6e7 solid",
        backgroundColor: this.state.isEditMode
          ? "white"
          : this.state.expanded
          ? "#f6fbfe"
          : "transparent",
        padding: "15px 5px",
      },
      row_style = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
      },
      view_style = {
        border: "transparent 1px solid",
        readonly: true,
        width: "100%",
        fontWeight: "normal",
        paddingLeft: "0px",
        paddingRight: "0px",
      };

    let { report } = this.props;
    let { form } = this.state;
    const isEditMode = this.state.isEditMode;

    const contClassList = [];
    const contTypeList = [];

    this.props.orderInventory
      .filter(
        (val, i, arr) =>
          arr.findIndex((t) => t.itemClassKey === val.itemClassKey) === i,
      )
      .forEach((orderClass) => {
        contClassList.push({
          value: orderClass.itemClassKey,
          label:
            orderClass.itemClassId === "Handheld"
              ? "Case Ready Meat"
              : orderClass.itemClassId === "640"
              ? "Cheese"
              : orderClass.itemClassId,
        });
      });

    this.props.orderInventory
      .filter(
        (item) => item.itemClassId === _.get(form, "containerType.value.value"), //parseInt(form.containerType.value.value, 10)
      )
      .forEach((orderType) => {
        contTypeList.push({
          value: orderType.itemId,
          label: orderType.modelSize,
          "data-contclass": orderType.itemClassKey,
          "data-contqty": orderType.totalQuantity,
          obj: orderType,
        });
      });

    return (
      <React.Fragment>
        <div>
          <CSSTransition
            in={isEditMode}
            timeout={300}
            unmountOnExit
            classNames={{
              enter: "tw-opacity-0",
              enterActive: "tw-transition tw-duration-300 tw-opacity-100",
              // enterDone: '',
              // exit: '',
              exitActive: "tw-transition tw-duration-300 tw-opacity-0",
              // exitDone: '',
            }}
          >
            <div
              onClick={this.closeEdit}
              className={
                "tw-fixed tw-inset-0 " +
                (this.state.isEditMode ? " " : " tw-hidden-- ")
              }
              style={{ background: "rgba(0,0,0,0.5)", zIndex: "6" }}
            ></div>
          </CSSTransition>
        </div>

        {/* <div
          style={{ zIndex: isEditMode ? "7" : "initial" }}
          className={`tw-relative tw-w-full ${
            isEditMode
              ? " tw-overflow-hidden- tw-relative tw-rounded-lg tw-shadow-md tw-w-full "
              : " "
          }`}
        > */}
        {this.props.updating && isEditMode && (
          <div className="loader-container loader-container tw-absolute tw-flex tw-inset-0 tw-items-center tw-justify-center tw-z-10">
            <Loader
              type="Oval"
              color="rgba(246,130,32,1)"
              height="50"
              width="50"
            />
          </div>
        )}
        <div
          className={`${
            isEditMode
              ? "tw-fixed tw-h-[80vh] sm:tw-h-min sm:tw-max-h-max  lg:tw-relative tw-top-[50%] sm:tw-top-[50%] lg:tw-top-auto tw-left-[50%]  lg:tw-left-auto lg:tw-translate-x-0 lg:tw-translate-y-0 tw-translate-x-[-50%] tw-translate-y-[-50%] tw-z-30"
              : ""
          }`}
        >
          <div
            className={`reporting-item ${
              isEditMode
                ? "tw-overflow-y-scroll tw-max-h-[80vh] sm:tw-h-min sm:tw-overflow-y-visible sm:tw-max-h-max tw-min-w-[300px] sm:tw-min-w-[600px] lg:tw-min-w-[880px] tw-flex-col lg:tw-flex-row"
                : "tw-min-w-[960px] lg:tw-min-w-[880px] tw-flex tw-flex-row lg:tw-flex-col"
            }`}
            style={rep_item}
          >
            <div className="reporting-item-main" style={row_style}>
              <div
                className={`main-info tw-flex tw-w-full ${
                  isEditMode ? "tw-flex-col lg:tw-flex-row" : "tw-flex-row"
                }`}
              >
                <div
                  className={`tw-flex tw-justify-around ${
                    isEditMode
                      ? "tw-flex-col sm:tw-flex-row lg:tw-w-[40%]"
                      : "tw-flex-row tw-w-[30%]"
                  }`}
                >
                  <div
                    style={{ marginBottom: isEditMode ? "15px" : "0px" }}
                    className={`form-group ${
                      isEditMode ? "sm:tw-w-[30%] tw-w-[100%]" : "tw-w-[37%]"
                    }`}
                  >
                    <label htmlFor="reportType">Type</label>
                    {isEditMode ? (
                      <div className="tw-w-full tw-font-light">
                        <ToscaField
                          elementType="reactselect"
                          options={form.containerType.options(
                            this.props.orderInventory,
                          )}
                          value={form.containerType.value}
                          onChange={(option) =>
                            form.onChange("containerType", option)
                          }
                          onBlur={() => form.onBlur("containerType")}
                          hasError={!form.containerType.isValid}
                          errorMsg={form.containerType.errorMsg}
                          showLabel={false}
                          isVertical={true}
                        />
                      </div>
                    ) : (
                      <input
                        id="reportType"
                        type="text"
                        style={view_style}
                        value={report.transactionDetail.itemClassId}
                        readOnly
                      />
                    )}
                  </div>
                  <div
                    style={{ marginBottom: isEditMode ? "15px" : "0px" }}
                    className={`form-group tw-font-light ${
                      isEditMode ? "sm:tw-w-[30%] tw-w-[100%]" : "tw-w-[37%]"
                    }`}
                  >
                    <label htmlFor="reportSize">Size</label>
                    {isEditMode ? (
                      <ToscaField
                        elementType="reactselect"
                        options={form.containerSize.options(contTypeList)}
                        value={form.containerSize.value}
                        onChange={(option) =>
                          form.onChange("containerSize", option)
                        }
                        hasError={!form.containerSize.isValid}
                        errorMsg={form.containerSize.errorMsg}
                        showLabel={false}
                        isVertical={true}
                        inputWrapperClass={(provided) => [
                          ...provided,
                          "tw-w-full",
                        ]}
                      />
                    ) : (
                      <input
                        id="reportSize"
                        type="text"
                        style={view_style}
                        value={
                          this.props.orderInventory.filter(
                            (i) => i.itemId === report.transactionDetail.itemId,
                          )[0]?.modelSize
                        }
                        readOnly
                      />
                    )}
                  </div>
                  <div
                    style={{ marginBottom: isEditMode ? "15px" : "0px" }}
                    className={`form-group ${
                      isEditMode ? "sm:tw-w-[30%] tw-w-[100%]" : "tw-w-[25%]"
                    }`}
                  >
                    <label htmlFor="reportQty">Qty</label>
                    {isEditMode ? (
                      <ToscaField
                        inputType="number"
                        name="qty"
                        value={form.qty.value}
                        onBlur={(e) => form.onBlur("qty")}
                        onChange={(e) => form.onChange("qty", e.target.value)}
                        isVertical={true}
                        showLabel={false}
                        inputWrapperClass={(provided) => [
                          ...provided,
                          "tw-bg-white tw-font-light tw-w-full",
                        ]}
                        hasError={!form.qty.isValid}
                        errorMsg={form.qty.errorMsg}
                      />
                    ) : (
                      <input
                        id="reportQty"
                        type="number"
                        style={view_style}
                        value={report.transactionDetail.quantity}
                        readOnly
                      />
                    )}
                  </div>
                </div>

                <div
                  className={`tw-flex tw-w-[100%]  tw-justify-around ${
                    isEditMode
                      ? "tw-flex-col sm:tw-flex-row lg:tw-w-[60%]"
                      : "tw-flex-row tw-w-[70%]"
                  }`}
                >
                  <div
                    style={{
                      marginBottom: isEditMode ? "15px" : "0px",
                      marginRight: isEditMode ? "0px" : "10px",
                    }}
                    className={`form-group ${
                      isEditMode ? "sm:tw-w-[30%] tw-w-[100%]" : "sm:tw-w-[30%]"
                    }`}
                  >
                    <label htmlFor="reportFrom">Ship From Location</label>
                    {isEditMode ? (
                      <ToscaField
                        elementType="reactselect"
                        options={form.shipFrom.options(
                          this.props.sourceAddressList,
                        )}
                        value={form.shipFrom.value}
                        onChange={(option) => form.onChange("shipFrom", option)}
                        onBlur={() => form.onBlur("shipFrom")}
                        hasError={!form.shipFrom.isValid}
                        errorMsg={form.shipFrom.errorMsg}
                        backspaceRemovesValue={true}
                        showLabel={false}
                        isVertical={true}
                        inputWrapperClass={(provided) => [
                          ...provided,
                          "tw-bg-white tw-font-light",
                          "tw-w-full",
                        ]}
                      />
                    ) : (
                      <textarea
                        id="reportFrom"
                        style={view_style}
                        value={
                          report.shipFromId
                            ? this.props.sourceAddressList.filter(
                                (e) => e.addressId === report.shipFromId,
                              )[0]?.addressName
                            : ""
                        }
                        readOnly
                      />
                    )}
                  </div>
                  <div
                    style={{ marginBottom: isEditMode ? "15px" : "0px" }}
                    className={`form-group ${
                      isEditMode ? "sm:tw-w-[30%] tw-w-[100%]" : "sm:tw-w-[30%]"
                    }`}
                  >
                    <label htmlFor="reportTo">Ship To Location</label>
                    {isEditMode ? (
                      <div className="tw-w-full">
                        <ToolTip
                          content={form.shipTo.getAddress()}
                          show={this.state.shipToOnFocus}
                          config={{
                            theme: "light",
                            trigger: "manual",
                            hideOnClick: false,
                            placement: "top-end",
                          }}
                        >
                          <div className="tw-w-full">
                            <ToscaField
                              elementType="reactselect"
                              options={form.shipTo.options(
                                form.shipFrom.value.value,
                              )}
                              value={form.shipTo.value}
                              onChange={(option) =>
                                form.onChange("shipTo", option)
                              }
                              showLabel={false}
                              isVertical={true}
                              onFocus={() =>
                                this.setState({ shipToOnFocus: true })
                              }
                              onBlur={() =>
                                this.setState({ shipToOnFocus: false })
                              }
                              inputWrapperClass={(provided) => [
                                ...provided,
                                "tw-bg-white tw-font-light",
                              ]}
                              hasError={!form.shipTo.isValid}
                              errorMsg={form.shipTo.errorMsg}
                              backspaceRemovesValue={true}
                            />
                          </div>
                        </ToolTip>
                      </div>
                    ) : (
                      <textarea
                        id="reportTo"
                        style={view_style}
                        value={_.get(
                          this.getShipToOptionForTheReport(),
                          "label",
                          "",
                        )}
                        readOnly
                      />
                    )}
                  </div>
                  <div
                    style={{ marginBottom: isEditMode ? "15px" : "0px" }}
                    className={`form-group ${
                      isEditMode ? "sm:tw-w-[30%] tw-w-[100%]" : "sm:tw-w-[30%]"
                    }`}
                  >
                    <label htmlFor="reportDate">Transaction Date</label>
                    {isEditMode ? (
                      <ToscaField
                        elementType="date"
                        value={_.get(form, "date.value", null)}
                        showLabel={false}
                        isVertical={true}
                        hasError={!form.date.isValid}
                        errorMsg={form.date.errorMsg}
                        inputWrapperClass={(provided) => [
                          ...provided,
                          "tw-bg-white, tw-w-full",
                        ]}
                        datePickerConfig={{
                          onSelect: (date) => form.onChange("date", date),
                          maxDate: moment(),
                          onChangeRaw: (e) => e.preventDefault(),
                        }}
                        dateClass="tw-w-full"
                      />
                    ) : (
                      <input
                        id="reportDate"
                        type="text"
                        style={view_style}
                        value={moment(
                          report.transactionDetail.transactionDate,
                        ).format("ll")}
                        readOnly
                      />
                    )}
                  </div>
                  {!isEditMode && this.props.width > 1024 ? (
                    <div
                      className="main-expander"
                      onClick={() =>
                        this.setState({
                          expanded: !this.state.expanded,
                          edit: false,
                        })
                      }
                      style={{
                        width: "5%",
                        textAlign: "right",
                        marginTop: "3%",
                      }}
                    >
                      <img
                        src={
                          this.state.expanded
                            ? pagination_icons.UpArrow
                            : pagination_icons.DownArrow
                        }
                        alt="expander"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div
              className={`reporting-item-sub tw-flex ${
                isEditMode
                  ? "tw-flex-col sm:tw-flex-row"
                  : "tw-flex-row tw-flex-wrap tw-justify-between tw-items-center"
              }`}
              style={{
                display:
                  this.state.expanded || this.props.width <= 1024
                    ? "flex"
                    : "none",
              }}
            >
              <div
                className={`sub-info tw-flex ${
                  isEditMode
                    ? "tw-flex-[0.72] lg:tw-flex-[0.5] tw-flex-col sm:tw-flex-row"
                    : "tw-flex-[0.5] tw-flex-row lg:tw-flex-auto tw-items-start lg:tw-items-end tw-h-full tw-w-fit"
                }`}
              >
                <div
                  style={{
                    marginBottom: isEditMode ? "15px" : "0px",
                    marginRight: isEditMode
                      ? this.props.width > 640
                        ? "10px"
                        : "0px"
                      : "0px",
                    marginLeft: isEditMode
                      ? this.props.width > 640
                        ? "10px"
                        : "0px"
                      : "0px",
                  }}
                  className={`form-group ${
                    isEditMode
                      ? "tw-w-full sm:tw-w-[42%] lg:tw-w-[22%]"
                      : "tw-w-[40%] lg:tw-w-[10%] lg:tw-pl-2"
                  }`}
                >
                  <label htmlFor="reportPO">PO No.</label>
                  {isEditMode ? (
                    <ToscaField
                      value={form.poNo.value}
                      onChange={(e) => form.onChange("poNo", e.target.value)}
                      onBlur={() => form.onBlur("poNo")}
                      hasError={!form.poNo.isValid}
                      errorMsg={form.poNo.errorMsg}
                      isVertical={true}
                      showLabel={false}
                      inputWrapperClass={(provided) => [
                        ...provided,
                        "tw-bg-white tw-font-light tw-w-full",
                      ]}
                    />
                  ) : (
                    <input
                      id="reportPO"
                      type="text"
                      style={view_style}
                      value={report.transactionDetail.purchaseOrder}
                      readOnly
                    />
                  )}
                </div>
                <div
                  style={{
                    marginBottom: isEditMode ? "15px" : "0px",
                    marginRight: isEditMode
                      ? this.props.width > 680
                        ? "10px"
                        : "0px"
                      : "0px",
                    marginLeft: isEditMode
                      ? this.props.width > 680
                        ? "10px"
                        : "0px"
                      : "0px",
                  }}
                  className={`form-group ${
                    isEditMode
                      ? "tw-w-full sm:tw-w-[42%] lg:tw-w-[22%] tw-mx-2.5"
                      : "tw-w-[40%] lg:tw-w-[10%]"
                  }`}
                >
                  <label htmlFor="reportBOL">BOL No.</label>
                  {isEditMode ? (
                    <ToscaField
                      value={form.bolNo.value}
                      onChange={(e) => form.onChange("bolNo", e.target.value)}
                      onBlur={() => form.onBlur("bolNo")}
                      hasError={!form.bolNo.isValid}
                      errorMsg={form.bolNo.errorMsg}
                      isVertical={true}
                      showLabel={false}
                      inputWrapperClass={(provided) => [
                        ...provided,
                        "tw-bg-white tw-font-light tw-w-full",
                      ]}
                    />
                  ) : (
                    <input
                      id="reportBOL"
                      type="text"
                      style={view_style}
                      value={report.transactionDetail.billOfLading}
                      readOnly
                    />
                  )}
                </div>
              </div>
              <div
                className={`sub-buttons tw-flex ${
                  isEditMode
                    ? "tw-justify-end tw-items-center sm:tw-justify-start sm:tw-flex-[0.28] lg:tw-flex-[0.5] lg:tw-justify-end"
                    : "tw-flex-[0.5]"
                }`}
              >
                <input
                  type="button"
                  className={`tw-border tw-border-black tw-px-5 tw-py-1 tw-rounded ${
                    isEditMode
                      ? "tw-bg-tosca-orange tw-text-white sm:tw-h-[50%]"
                      : "tw-bg-white tw-text-gray-900"
                  }`}
                  value={isEditMode ? "Save" : "Edit"}
                  onClick={this.onEdit}
                />
                <input
                  type="button"
                  className={`${
                    isEditMode ? "sm:tw-h-[50%]" : ""
                  } tw-ml-2 tw-px-5 tw-py-1 tw-rounded tw-bg-transparent tw-border-none hover:tw-underline focus:tw-outline-none`}
                  value={isEditMode ? "Cancel" : "Delete"}
                  onClick={isEditMode ? this.closeEdit : this.delete}
                />
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </React.Fragment>
    );
  }
}

const { object } = PropTypes;

ReportItem.propTypes = {
  report: object.isRequired,
  contType: object,
};

const mapState = ({
  session,
  transactions,
  shipToAddresses,
  sourceAddresses,
}) => ({
  user: session.user,
  sourceAddressList: sourceAddresses.sourceAddressList,
  shipTos: shipToAddresses.addresses,
  newShipTos: shipToAddresses.newShipTos,
  updating: transactions.updating,
  updated: transactions.updated,
});

export default connect(mapState)(ReportItem);
