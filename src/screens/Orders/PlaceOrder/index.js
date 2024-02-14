import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import "react-datepicker/dist/react-datepicker.css";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import _ from "lodash";
import {
  addressActions,
  inventoryActions,
  orderActions,
  customerActions,
} from "../../../actions";
import { determineNavStyling } from "../../../components/Nav/determineNavStyling";
import { components } from "react-select";
import { pagination_icons } from "../../../images";
import { toast } from "react-toastify";
import { PageDisable } from "../../../components";
import { Prompt } from "react-router";
import { Accordion, AccordionItem } from "../../../components/Accordion";
import swal from "sweetalert";
import ShippingInstruction from "./components/ShippingInstruction";
import OrderDetailsPage from "./components/OrderDetailsPage";
import { createBrowserHistory } from "history";
import {
  emailConfigs,
  EmailConfigHelper,
} from "./../../../components/HOC/withEmail/withEmail";
import ConfirmationModal from "../../../components/Modal/ConfirmationModal";
import Button from "../../../components/Button/Button";

const daysFromOrderDateForRequestedDeliverydate = 8;
const daysFromOrderDateForExpedited = 7;

const initState = {
  activeComponentIndex: 0,
  tmpOrders: [1, 2, 3, 4, 5],
  copyOrder: null,
  newOrder: {
    order_date: moment().format("MM/DD/YYYY"),
    order_no: "New",
    cust_name: "",
    container_class: "",
    container_type: "",
    quantity: 0,
    ship_to: "",
    po_no: "",
    req_del_date: moment().add(
      daysFromOrderDateForRequestedDeliverydate,
      "days",
    ),
    transport_instructions: "",
    loading_instructions: "",
    additional_instructions: "",
    orderList: [],
    customerPickUp: false,
  },
  address: "",
  showDelWarning: false,
  resetOrderList: false,
  toastId: null,
  shipTo: "",
  contClass: "",
  contProduct: "",
  contColor: "",
  contItemDescription: "",
  contType: "",
  contQuantity: "",
  po_no: "",
  req_del_date: moment().add(daysFromOrderDateForRequestedDeliverydate, "days"),
  req_del_dateBlank: false,
  additional_instructions: "",
  orderListItemEditIdx: undefined,
  showQuantityWarning: false,
  poBlank: false,
  quantityOriginal: undefined,
  quantityError: "",
  showSuccessModal: false,
  submitEmpty: false,
  navPrompt: false,
  reqShipTo: false,
  showErrorNotification: false,
  shipToAddressName: "",
};

class PlaceOrder extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };
  constructor(props, context) {
    super(props, context);
    const { UserName } = props.user;
    this.poNo = React.createRef();

    this.state = {
      ...initState,
      newOrder: {
        ..._.cloneDeep(initState.newOrder),
        cust_name: UserName,
      },
    };
    this.removeOrderListItem = this.removeOrderListItem.bind(this);
  }

  confirmPageReload = (event) => {
    if (this.state.navPrompt) {
      event.preventDefault();
      event.returnValue = "";
    }
  };

  componentWillUnmount() {
    this.props.dispatch(orderActions.resetState());
  }

  componentDidMount() {
    this.props.dispatch(
      addressActions.fetchSourceAddressList(this.props.accessToken),
    );
    this.props.dispatch(
      inventoryActions.fetchOrderInventory(this.props.accessToken, {
        customerId: this.props.user.CustomerInfo.CustID,
        outbound: true,
      }),
    );

    this.props.dispatch(
      customerActions.fetchCustomerInfo(
        this.props.accessToken,
        this.props.user.CustomerInfo.CustID,
      ),
    );
    determineNavStyling(this.props.location.pathname);
  }

  processOrderCopy = (order) => {
    const containerInfo = this.props.orderInventory.find(
        (container) => container.itemId === order.containerType,
      ),
      orderAddress = this.props.sourceAddressList.find(
        (address) => address.addressName === order.shipToLocation,
      );

    if (!containerInfo)
      return console.error(
        `Could not find the container for container type: ${order.containerType}`,
      );

    const contClassOption = {
      value: containerInfo.itemClassKey,
      label: containerInfo.itemClassId,
    };
    const contProduct = {
      value: containerInfo.itemBrand,
      label: containerInfo.itemBrand,
    };
    const contColor = {
      value: containerInfo.itemColor,
      label: containerInfo.itemColor,
    };
    const contTypeOption = {
      value: containerInfo.itemId,
      label: String(containerInfo.modelSize),
      rawData: containerInfo,
    };
    this.setState(
      {
        newOrder: {
          ...this.state.newOrder,
          ship_to: orderAddress?.addressId,
          customerPickUp: order.customerPickUp,
        },
        contClass: contClassOption,
        contProduct: contProduct,
        contColor: contColor,
        contType: contTypeOption,
        contQuantity: order.quantity,
        copyOrder: null,
      },
      () => {
        let shipToOption = {
          value: orderAddress?.addressId,
          label: orderAddress?.addressName,
        };

        this.onShipToChange(shipToOption, this.props.user);
      },
    );
  };

  notify = () => {
    this.setState({
      toastId: toast("Submitting order...", {
        autoClose: false,
      }),
    });
  };

  update = () =>
    this.props.error
      ? toast.update(this.state.toastId, {
          render: (
            <span>
              Unable to submit order. If you conintiue to receive this error,
              please contact your customer service representative.
              <br />
              <br />
              <small className="pull-right">
                <b>Error:</b> {this.props.error.message}
              </small>
            </span>
          ),
          type: toast.TYPE.ERROR,
          autoClose: 5000,
        })
      : toast.update(this.state.toastId, {
          render: "Order submitted successfully!",
          type: toast.TYPE.SUCCESS,
          autoClose: 3000,
        });

  success = () => {
    this.setState({
      ...this.state,
      showSuccessModal: true,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.submitting &&
      this.props.error &&
      !this.state.showErrorNotification
    ) {
      this.setState({ showErrorNotification: true });
      return;
    }

    if (
      prevProps.isFetchingSourceAddresses &&
      !this.props.isFetchingSourceAddresses
    ) {
      //Remove the copy state after first mount, so when refresh, the form clears
      const history = createBrowserHistory();
      if (history.location.state && history.location.state.copy) {
        let state = { ...history.location.state };
        delete state.copy;
        history.replace({ ...history.location, state });
      }

      if (this.props.location.state)
        this.setState({
          copyOrder: this.props.location.state.copy,
          activeComponentIndex: 0,
        });
    }

    if (this.state.copyOrder && this.props.orderInventory)
      this.processOrderCopy(this.state.copyOrder);

    if (prevProps.submitting && this.props.submitted) {
      this.update();
      this.setState({
        ...this.state,
        newOrder: {
          ...this.state.newOrder,
          ship_to: "",
          po_no: "",
          req_del_date: moment().add(
            daysFromOrderDateForRequestedDeliverydate,
            "days",
          ),
          order_list: [],
        },
        address: "",
        resetOrderList: !this.state.resetOrderList,
        noOrders: "none",
        navPrompt: false,
        showSuccessModal: true,
      });
    }

    if (prevProps.submitting && this.props.error) this.update();

    if (prevProps.location.key !== this.props.location.key) {
      this.setState({
        ...this.state,
        ...initState,
      });
    }
  }

  onInputChange = (e) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      newOrder: {
        ...this.state.newOrder,
        [e.target.id]: e.target.value,
      },
    });
  };

  onPOChange = (e) => {
    e.preventDefault();
    if (this.state.shipTo === "") {
      window.scrollTo(0, 0);
      return this.setState({ reqShipTo: true });
    }
    const disallowed = [
      "@",
      "#",
      "$",
      "%",
      "/",
      "\\",
      "!",
      "&",
      "*",
      "^",
      "(",
      ")",
      "|",
      "'",
      '"',
      "<",
      ">",
      "+",
      "_",
    ];
    if (disallowed.some((sub) => e.target.value.includes(sub))) {
      return window.alert(
        `The character '${
          e.target.value[e.target.value.length - 1]
        }' is not allowed. Please use only letters, numbers, hyphens or periods.`,
      );
    }
    let hasError = false;
    if (e.target.value === "") {
      hasError = true;
    }
    this.setState({
      ...this.state,
      po_no: e.target.value,
      poBlank: hasError,
    });
  };

  onAddInstChange = (e) => {
    e.preventDefault();
    if (this.state.shipTo === "") {
      window.scrollTo(0, 0);
      return this.setState({ reqShipTo: true });
    }
    this.setState({
      ...this.state,
      additional_instructions: e.target.value,
    });
  };

  onShipToChange = (option, user) => {
    const selectedAddress =
      this.props.sourceAddressList.filter(
        (address) => address.addressId === option.value,
      )[0] || user.CustomerInfo;
    this.setState({
      newOrder: {
        ...this.state.newOrder,
        ship_to: option.value,
        transport_instructions: selectedAddress.TransComment,
        loading_instructions: selectedAddress.LoadingComment,
      },
      shipTo: option,
      address: `${selectedAddress.addressLine1}, ${
        selectedAddress.addressLine2 ? selectedAddress.addressLine2 + ", " : ""
      }\n${selectedAddress.city}, ${
        selectedAddress.state
      }, ${selectedAddress.postalCode?.substr(0, 5)}, ${
        selectedAddress.country
      }`,
      reqShipTo: false,
      navPrompt: true,
      shipToAddressName: option.label,
    });
  };

  onContClassChange = (option) => {
    if (this.state.shipTo === "") {
      window.scrollTo(0, 0);
      return this.setState({ reqShipTo: true });
    }
    this.setState({
      contClass: option,
      contType: "",
    });
  };

  onContProductChange = (option) => {
    this.setState({
      contColor: "",
      contProduct: option,
      contClass: "",
      contType: "",
      contQuantity: "",
    });
  };

  onContColorChange = (option) => {
    this.setState({
      contColor: option,
      contClass: "",
      contType: "",
      contQuantity: "",
    });
  };

  onContTypeChange = (option, contClass) => {
    if (this.state.shipTo === "") {
      window.scrollTo(0, 0);
      return this.setState({ reqShipTo: true });
    }
    this.setState({
      contType: option,
      contQuantity: option["data-contqty"],
      quantityOriginal: option["data-contqty"],
      showQuantityWarning: false,
      contItemDescription: option.rawData.productDescription
        ? option.rawData.productDescription
        : "",
    });
  };

  onContQuantityChange = (e) => {
    if (this.state.shipTo === "") {
      window.scrollTo(0, 0);
      return this.setState({ reqShipTo: true });
    }
    const { contQuantity, quantityOriginal } = this.state;
    if (contQuantity !== e.target.value) {
      let warning = false;
      let errorMessage = "";
      if (e.target.value > 0) {
        if (
          !this.state.newOrder.customerPickUp &&
          e.target.value < quantityOriginal
        ) {
          warning = true;
          errorMessage =
            "Quantity is less than one (1) truckload and will require review after submitting this order.";
        } else if (
          !this.state.newOrder.customerPickUp &&
          e.target.value > quantityOriginal
        ) {
          warning = true;
          errorMessage =
            "Quantity is more than one (1) truckload and will be split into multiple orders.";
        }
      }
      if (e.target.value < 0) {
        if (
          !this.state.newOrder.customerPickUp &&
          e.target.value > quantityOriginal * -1
        ) {
          warning = true;
          errorMessage =
            "Quantity is less than one (1) truckload and will require review after submitting this order.";
        } else if (
          !this.state.newOrder.customerPickUp &&
          e.target.value < quantityOriginal * -1
        ) {
          warning = true;
          errorMessage =
            "Quantity is more than one (1) truckload and will be split into multiple orders.";
        }
      }

      const isCleanPal = _.get(this.state.contClass, "value", undefined) === 84;
      if (isCleanPal) {
        warning = false;
        errorMessage = "";
      }

      this.setState({
        contQuantity: e.target.value,
        showQuantityWarning: warning,
        quantityError: errorMessage,
      });
    }
  };

  submitOrder = (e, orderList, emailConfig) => {
    e.preventDefault();

    orderList.forEach((item) => {
      item.reqDelDate = moment(item.reqDelDate).format("YYYY-MM-DD");
    });

    const { newOrder } = this.state,
      { user } = this.props,
      orderHeader = {
        shipToAddress: newOrder.ship_to,
        requestedDeliveryDate: moment(newOrder.req_del_date).format(
          "YYYY-MM-DD",
        ),
        customerPickUp: newOrder.customerPickUp,
        additionalInstructions: newOrder.additional_instructions,
        userEmail: user.Email,
        userName: user.UserName,
        createdBy: user.UserName,
        customerId: user.CustomerInfo.CustID,

        // TODO: Enterprise API does not yet support
        //emailConfig: {
        //  expedited: {
        //    recipients: emailConfig.getReciepients(),
        //    copyRecipients: emailConfig.getCopyReciepients(),
        //  },
        //},
      },
      orderDetails = orderList.map((order) => {
        return {
          quantity: order.quantity,
          itemId: order.containerInfo.itemId,
          additionalInstructions: order.additionalInstructions,
          purchaseOrderNumber: order.poNo,
          requestedDeliveryDate: order.reqDelDate,
        };
      });
    newOrder.orderList = orderList;

    let metaData = {
      customerName: this.props.customer.customerInfo.customerName,
      shipToAddressName: this.state.shipToAddressName,
    };

    this.props.dispatch(
      orderActions.submitNewOrder(
        user.accessToken,
        orderHeader,
        orderDetails,
        metaData,
      ),
    );
  };

  sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };

  clearOrderItem = () => {
    this.setState({
      contType: "",
      contQuantity: "",
      contItemDescription: "",
      po_no: "",
      additional_instructions: "",
      poBlank: false,
      req_del_date: moment().add(
        daysFromOrderDateForRequestedDeliverydate,
        "days",
      ),
      req_del_dateBlank: false,
      contClass: "",
      contProduct: "",
      contColor: "",
    });
  };

  addOrderList = () => {
    // Get all the info to build up the new orderList item
    const {
      contType,
      contQuantity,
      // orderStatus,
      po_no,
      req_del_date,
      additional_instructions,
      orderListItemEditIdx,
    } = this.state;
    const containerInfo = this.props.orderInventory.find(
      (container) => container.itemId === contType.rawData.itemId,
    );

    if (contQuantity === "" || contQuantity === "0") {
      return;
    } else if (po_no === "") {
      this.setState({
        poBlank: true,
      });
      return;
    }

    // Get the current orderList
    const { orderList } = this.state.newOrder;
    const orderListItem = {
      contProduct: this.state.contProduct,
      contColor: this.state.contColor,
      containerInfo,
      quantity: parseInt(contQuantity, 0),
      poNo: po_no,
      reqDelDate: req_del_date,
      additionalInstructions: additional_instructions,
      useAsLid: false,
    };

    //Check duplicate
    this.alertDuplication(orderListItem, orderListItemEditIdx).then(
      (proceed) => {
        if (!proceed) {
          this.poNo.current.focus();
          this.poNo.current.select();
          return null;
        }

        orderList.push(orderListItem);

        this.setState({
          ...this.state,
          contProduct: "",
          contColor: "",
          contItemDescription: "",
          contClass: "",
          contType: "",
          contQuantity: "",
          po_no: "",
          req_del_date: moment().add(
            daysFromOrderDateForRequestedDeliverydate,
            "days",
          ),
          additional_instructions: "",
          orderListItemEditIdx: undefined,
          showQuantityWarning: false,
          quantityOriginal: undefined,
          quantityError: "",
          navPrompt: true,
          newOrder: {
            ...this.state.newOrder,
            orderList,
          },
        });
      },
    );
  };

  alertDuplication = async (currentItem, itemIndex) => {
    const { orderList } = this.state.newOrder;
    let proceed = true;
    let anyItemWithSamePo = orderList.find((i, index) => {
      return index !== itemIndex && i.poNo === currentItem.poNo;
    });

    let error = anyItemWithSamePo
      ? `
      Failure.  purchaseOrderNumber [${currentItem.poNo}] is already in use.
      Please confirm that these are not duplicate orders
    `
      : null;

    if (!error) {
      //Validate only if there is no internal duplication
      try {
        await this.props.dispatch(
          orderActions.validateOrder(this.props.accessToken, [
            {
              purchaseOrderNumber: currentItem.poNo,
            },
          ]),
        );
      } catch (err) {
        error = err.response?.data?.description
          ? `
        ${err.response?.data?.description}
        Please confirm that these are not duplicate orders
        `
          : "An error occured while validating the order.";
      }
    }

    if (error) {
      return swal("Your pick up request has been received.", {
        text: error,
        className: "tw-text-center",
        icon: "warning",

        buttons: {
          cancel: {
            text: "Edit",
            value: false,
            visible: true,
            closeModal: true,
          },
          confirm: {
            text: "Proceed",
            value: true,
            closeModal: true,
          },
        },
      });
    }
    return proceed;
  };

  removeOrderListItem = (e, idx) => {
    if (e) e.stopPropagation();
    let newOrderList = this.state.newOrder.orderList;
    newOrderList.splice(idx, 1);
    this.setState({
      newOrder: {
        ...this.state.newOrder,
        orderList: newOrderList,
      },
      navPrompt: newOrderList.length <= 0 ? false : true,
    });
  };

  resetOrderList = () => {
    this.setState({
      newOrder: {
        ...this.state.newOrder,
        orderList: [],
      },
      navPrompt: false,
    });
    this.props.dispatch(orderActions.cancelOrder());
    window.location.reload();
  };

  handleDateBlur = (date) => {
    date = date.target.value;
    if (date && moment(date, "MM/DD/YYYY", true).isValid()) {
      this.setState({
        req_del_dateBlank: false,
      });
    } else {
      this.setState({
        req_del_dateBlank: true,
      });
    }
  };

  handleDateChange = (date) => {
    if (date && moment(date, "MM/DD/YYYY", true).isValid()) {
      date.set({
        hour: 12,
        minute: 0,
        second: 0,
      });
      this.setState({
        ...this.state,
        req_del_date: date,
        req_del_dateBlank: false,
      });
    } else {
      this.setState({
        req_del_dateBlank: true,
      });
    }
  };

  handleDateSelect = (date) => {
    if (date && moment(date, "MM/DD/YYYY", true).isValid()) {
      const newDateWithLeadTime = moment()
        .clone()
        .add(daysFromOrderDateForExpedited, "days");
      if (
        !this.props.customer.customerInfo.expeditedExempt &&
        date.isBefore(newDateWithLeadTime)
      ) {
        this.setState({
          showDelWarning: true,
        });
      }
      this.setState({
        req_del_dateBlank: false,
      });
    } else {
      this.setState({
        req_del_dateBlank: true,
      });
    }
  };

  handleLeadtimeWarningResponse = (response) => {
    response
      ? this.setState({ showDelWarning: false })
      : this.setState({
          showDelWarning: false,
          req_del_date: moment().add(
            daysFromOrderDateForRequestedDeliverydate,
            "days",
          ),
          newOrder: {
            ...this.state.newOrder,
          },
        });
  };

  handleSuccessResponse = () => {
    this.context.router.history.push("/ordering/new");
    window.location.reload();
  };

  handleViewOrderResponse = () => {
    // window.location.reload();
    this.context.router.history.push("/ordering");
    window.location.reload();
  };

  handleCustomerPickUpChange = () => {
    this.setState({
      newOrder: {
        ...this.state.newOrder,
        customerPickUp: !this.state.newOrder.customerPickUp,
      },
    });
  };

  gotoBasic = (move) => {
    move();
  };

  gotoDetails = (step) => {
    if (this.validateShippingInstruction()) {
      step();
    }
  };

  validateShippingInstruction = () => {
    if (this.state.shipTo === "") {
      window.scrollTo(0, 0);
      this.setState({ reqShipTo: true });
      return false;
    }
    return true;
  };

  shouldNavigate = (from, to) => {
    if (from === to || to < from) {
      return true;
    }
    let result = false;

    for (let i = from; i < to; i++) {
      switch (i) {
        case 0:
          result = this.validateShippingInstruction();
          break;
        case 1:
          result = true;
          break;
        default:
          result = false;
          break;
      }
    }

    return result;
  };

  render() {
    let isSelfPickup = this.state.newOrder.customerPickUp;
    const { user } = this.props;
    const shipToList = [];
    const contClassList = [];
    const contProductsList = [];
    const contColorList = [];
    const contTypeList = [];
    const {
      newOrder,
      address,
      showDelWarning,
      showQuantityWarning,
      quantityError,
      showSuccessModal,
      po_no,
      req_del_date,
      additional_instructions,
      contItemDescription,
    } = this.state;
    const { orderList } = newOrder;
    const quantityErrorStyle = {};
    if (showQuantityWarning) {
      quantityErrorStyle.borderColor = "red";
    }

    // Build shipToList
    this.props.sourceAddressList.map((address) => {
      if (address.addressName !== "") {
        shipToList.push({
          value: address.addressId,
          label: address.addressName,
        });
      }
      return [];
    });

    // Build contClass list
    this.props.orderInventory
      .filter((item) =>
        this.state["contProduct"].value
          ? item.itemBrand === this.state["contProduct"].value
          : item,
      )
      .filter((item) =>
        this.state["contColor"].value
          ? item.itemColor === this.state["contColor"].value
          : item,
      )
      .filter(
        (val, i, arr) =>
          arr.findIndex((t) => t.itemClassKey === val.itemClassKey) === i,
      )
      .map((orderClass) => {
        contClassList.push({
          value: orderClass.itemClassKey,
          label:
            orderClass.itemClassId === "Handheld"
              ? "Case Ready Meat"
              : orderClass.itemClassId === "640"
              ? "Cheese"
              : orderClass.itemClassId,
        });
        return [];
      });

    // Build contProducts list
    this.props.orderInventory
      .filter(
        (val, i, arr) =>
          arr.findIndex((t) => t.itemBrand === val.itemBrand) === i,
      )
      .map((product) => {
        contProductsList.push({
          value: product.itemBrand,
          label: product.itemBrand,
        });
        return [];
      });
    contProductsList.unshift({ value: "", label: "All" });

    // Build contColors list
    this.props.orderInventory
      .filter((item) =>
        this.state["contProduct"].value
          ? item.itemBrand === this.state["contProduct"].value
          : item,
      )
      .filter(
        (val, i, arr) =>
          arr.findIndex((t) => t.itemColor === val.itemColor) === i,
      )
      .map((product) => {
        contColorList.push({
          value: product.itemColor,
          label: product.itemColor,
        });
        return [];
      });
    contColorList.unshift({ value: "", label: "All" });

    // Build contType list
    this.props.orderInventory
      .filter((item) =>
        this.state["contClass"].value
          ? item.itemClassKey === parseInt(this.state["contClass"].value, 10)
          : item,
      )
      .filter((item) =>
        this.state["contProduct"].value
          ? item.itemBrand === this.state["contProduct"].value
          : item,
      )
      .filter((item) =>
        this.state["contColor"].value
          ? item.itemColor === this.state["contColor"].value
          : item,
      )
      .map((orderType) => {
        contTypeList.push({
          value: orderType.itemId,
          label: orderType.modelSize,
          "data-contclass": orderType.itemClassKey,
          "data-contqty": orderType.totalQuantity,
          "data-item-description": orderType.itemDescription,
          rawData: orderType,
        });
        return [];
      });

    return (
      <div id="place-order-page-new">
        <Prompt
          when={this.state.navPrompt}
          message={
            "Are you sure you want to leave the page? Your order has not been submitted."
          }
        />
        <PageDisable
          disabled={this.props.submitting}
          message="Submitting order, please wait"
        />
        <div className="tw-flex tw-pb-4">
          <div className="tw-flex-1">
            <div className="tw-flex-col tw-items-start  sm:tw-flex-row tw-flex sm:tw-items-center tw-justify-between">
              <div className="header-info">
                <h3 className="">New Single Order Form</h3>
                <p>
                  Start a new order below or place a reorder from Order History
                </p>
              </div>
              <div className="tw-flex xs:tw-top-1" id="buttondiv">
                <div className="">
                  <Link
                    to="/ordering"
                    className="tw-text-tosca-orange focus:tw-text-tosca-orange  hover:tw-text-orange-700 tw-no-underline tw-flex tw-flex-col tw-items-center tw-justify-center"
                  >
                    <svg
                      className="tw-fill-current tw-h-6 tw-w-6"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M13 3a9 9 0 00-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0013 21a9 9 0 000-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
                    </svg>
                    <div className="tw-text-xs">History</div>
                  </Link>
                </div>
                <div>
                  <span className="pipe"></span>
                </div>
                <div className="">
                  <Link
                    to="/ordering/request-quote"
                    className="tw-text-tosca-orange focus:tw-text-tosca-orange  hover:tw-text-orange-700 tw-no-underline tw-flex tw-flex-col tw-items-center tw-justify-center"
                  >
                    <svg
                      className="tw-fill-current tw-h-6 tw-w-6"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* <text x="0" y="15" style={{textAnchor: 'middle'}}>Q</text> */}
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
                    </svg>

                    <div className="tw-text-xs">Quote</div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="md:tw--mx-2 tw-flex tw-mb-8">
          <div className="md:tw-mx-2 tw-flex-1 tw-py-4">
            <Accordion
              activeItemIndex={{
                value: this.state.activeComponentIndex,
                sync: (val) => {
                  this.setState({ activeComponentIndex: val });
                },
              }}
            >
              <AccordionItem
                header={(vm) => {
                  return (
                    <React.Fragment>
                      Shipping Instructions
                      <img src={pagination_icons.DownArrow} alt="open" />
                    </React.Fragment>
                  );
                }}
                active={true}
                itemHeaderClass={(vm) => {
                  return vm.props.active
                    ? vm.props.headerClass +
                        " accordion-header accordion-available "
                    : vm.props.headerClass + " accordion-header ";
                }}
              >
                {(data) => (
                  <ShippingInstruction
                    newOrder={newOrder}
                    handleCustomerPickUpChange={this.handleCustomerPickUpChange}
                    shipTo={this.state.shipTo}
                    shipToList={shipToList}
                    isSelfPickup={isSelfPickup}
                    DropdownIndicator={DropdownIndicator}
                    user={user}
                    onShipToChange={this.onShipToChange}
                    reqShipTo={this.state.reqShipTo}
                    isFetchingSourceAddresses={
                      this.props.isFetchingSourceAddresses
                    }
                    address={address}
                    gotoDetails={() =>
                      this.gotoDetails(() => data.navigateTo(1))
                    }
                  />
                )}
              </AccordionItem>

              <AccordionItem
                header={(vm) => {
                  return (
                    <React.Fragment>
                      Order Details
                      <img src={pagination_icons.DownArrow} alt="open" />
                    </React.Fragment>
                  );
                }}
                shouldNavigate={this.shouldNavigate}
                active={this.state.shipTo !== ""}
                itemHeaderClass={(vm) => {
                  return vm.props.active
                    ? vm.props.headerClass +
                        " accordion-header accordion-available "
                    : vm.props.headerClass + " accordion-header ";
                }}
              >
                {(data) => (
                  <EmailConfigHelper configName={emailConfigs.EXPEDITED_ORDER}>
                    {(emailConfig) => (
                      <OrderDetailsPage
                        newOrder={newOrder}
                        quantityError={quantityError}
                        showQuantityWarning={showQuantityWarning}
                        contClassList={contClassList}
                        contProductsList={contProductsList}
                        contColorList={contColorList}
                        DropdownIndicator={DropdownIndicator}
                        onContClassChange={this.onContClassChange}
                        onContProductChange={this.onContProductChange}
                        onContColorChange={this.onContColorChange}
                        contTypeList={contTypeList}
                        contType={this.state.contType}
                        onContTypeChange={this.onContTypeChange}
                        contQuantity={this.state.contQuantity}
                        onContQuantityChange={this.onContQuantityChange}
                        poNo={this.poNo}
                        po_no={po_no}
                        onPOChange={this.onPOChange}
                        poBlank={this.state.poBlank}
                        req_del_date={req_del_date}
                        req_del_dateBlank={this.state.req_del_dateBlank}
                        handleDateBlur={this.handleDateBlur}
                        handleDateChange={this.handleDateChange}
                        handleDateSelect={this.handleDateSelect}
                        additional_instructions={additional_instructions}
                        onAddInstChange={this.onAddInstChange}
                        contClass={this.state.contClass}
                        contProduct={this.state.contProduct}
                        contColor={this.state.contColor}
                        contItemDescription={contItemDescription}
                        addOrderList={this.addOrderList}
                        clearOrderItem={this.clearOrderItem}
                        orderList={orderList}
                        user={user}
                        orderInventory={this.props.orderInventory}
                        removeOrderListItem={this.removeOrderListItem}
                        alertDuplication={this.alertDuplication}
                        submitOrder={(e, orderList) =>
                          this.submitOrder(e, orderList, emailConfig)
                        }
                        submitting={this.props.submitting}
                        gotoBasic={() =>
                          this.gotoBasic(() => data.navigateTo(0))
                        }
                        validationStatus={this.props.validationStatus}
                      />
                    )}
                  </EmailConfigHelper>
                )}
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <ConfirmationModal
          title="Request Submitted"
          brand="default"
          show={showSuccessModal}
          onClose={this.handleSuccessResponse}
        >
          <p>Your order has been submitted.</p>
          <p>
            * Please allow 1-2 minutes for new orders to be displayed in Order
            History.
          </p>

          <div className="tw-flex tw-flex-col tw-gap-2 tw-mt-6">
            <Button
              brand="secondary"
              type="button"
              fullwidth="true"
              onClick={this.handleViewOrderResponse}
            >
              View Orders
            </Button>
            <Button
              brand="primary"
              type="button"
              fullwidth="true"
              onClick={this.handleSuccessResponse}
            >
              Place Another Order
            </Button>
          </div>
        </ConfirmationModal>

        <ConfirmationModal
          title="Warning: Request Error"
          brand="danger"
          show={this.state.showErrorNotification}
          onClose={() => {
            this.setState({ showErrorNotification: false });
          }}
        >
          <p>Your order was not submitted. Please resubmit your order.</p>
          <p>
            If the order fails again, please contact:
            <a
              className="tw-text-blue-600 tw-block"
              href={`mailto:customersolutions@toscaltd.com?subject=${_.get(
                this.props.user,
                "CustomerInfo.CustName",
                "",
              )}:`}
            >
              customersolutions@toscaltd.com
            </a>
          </p>

          <div className="tw-flex tw-flex-col tw-gap-2 tw-mt-6">
            <Button
              brand="secondary"
              fullwidth="true"
              type="button"
              onClick={() => {
                this.setState({ showErrorNotification: false });
              }}
            >
              OK
            </Button>
          </div>
        </ConfirmationModal>

        <ConfirmationModal
          title="Expedited Shipping"
          show={showDelWarning}
          onClose={() => this.handleLeadtimeWarningResponse(false)}
        >
          <p>
            The requested delivery date is less than 7 days, from tomorrow.
            Expedited shipping fees may apply.
          </p>
          <p>
            To continue, click OK or click Cancel to request a new date. If you
            have questions, please contact your Customer Service Representative.
          </p>

          <div className="tw-flex tw-flex-col- tw-gap-2 tw-mt-6">
            <Button
              brand="secondary"
              type="button"
              fullwidth="true"
              onClick={() => this.handleLeadtimeWarningResponse(true)}
            >
              OK
            </Button>
            <Button
              brand="primary"
              type="button"
              fullwidth="true"
              onClick={() => this.handleLeadtimeWarningResponse(false)}
            >
              Cancel
            </Button>
          </div>
        </ConfirmationModal>
      </div>
    );
  }
}

const { object, bool, string } = PropTypes;

PlaceOrder.propTypes = {
  user: object.isRequired,
  authenticated: bool.isRequired,
  checked: bool.isRequired,
  accessToken: string,
};

const DropdownIndicator = (props) => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <img
          src={pagination_icons.DownArrow}
          alt="left arrow"
          width={20}
          height={20}
        />
      </components.DropdownIndicator>
    )
  );
};

const mapState = ({
  session,
  orders,
  sourceAddresses,
  orderInventory,
  customer,
}) => ({
  user: session.user,
  authenticated: session.authenticated,
  checked: session.checked,
  accessToken: session.user.accessToken,
  submitting: orders.submitting,
  submitted: orders.submitted,
  error: orders.error,
  sourceAddressList: sourceAddresses.sourceAddressList,
  isFetchingSourceAddresses: sourceAddresses.fetching,
  orderInventory: orderInventory.orderInventory,
  customer,
  validationStatus: orders.validationStatus,
});

export default connect(mapState)(PlaceOrder);
