import React, { useState, useEffect, useReducer } from "react";
import { Accordion, AccordionItem } from "../../../components/Accordion";
import BasicInfo from "./BasicInfo";
import OrderDetails from "./OrderDetail";
import Confirmation from "./Confirmation";
import DetailFormHandler from "./DetailFormHandler";
import BasicFormHandler from "./BasicFormHandler";
import _, { trim } from "lodash";
import moment from "moment";
import { Prompt } from "react-router";
import { PageDisable } from "../../../components";
import { createBrowserHistory } from "history";
import useGetInventories from "./../../../hooks/Inventory/useGetInventories";
import useSession from "./../../../hooks/Auth/useSession";
import useGetSourceAddresses from "./../../../hooks/CustomerProfile/useGetSourceAddresses";
import useCreateCollectionOrder from "./../../../hooks/Order/useCreateCollectionOrder";
import { carrierActions } from "../../../actions";
import useGetCustomer from "../../../hooks/CustomerProfile/useGetCustomer";
import { useDispatch, connect } from "react-redux";
import { SUBMITTED, NOTSUBMITTED, REJECTED } from "../../../utils/APIStatus";
import ConfirmationModal from "../../../components/Modal/ConfirmationModal";
import Button from "../../../components/Button/Button";

export function PlaceOrder(props) {
  const { createCollectionOrder, createCollectionOrderStatus } =
    useCreateCollectionOrder();

  const { accessToken, user, customerId } = useSession();

  const { data: customer } = useGetCustomer(customerId);

  const inventoryQuery = useGetInventories({ inbound: true });
  let orderInventory = inventoryQuery?.data?.data;

  // orderInventory.forEach((item) => {
  //   delete item.itemKey
  // });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(carrierActions.fetchCarrierList(accessToken));
  }, [accessToken, dispatch]);

  const addressQuery = useGetSourceAddresses({ customerType: "cop" });
  const shipFromLocations = addressQuery?.data?.data;
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [copyOrder, setCopyOrder] = useState(null);
  const [activeComponentIndex, setActiveComponentIndex] = useState(0);
  const [compKey, setCompKey] = useState(1);
  const [orderList, setOrderList] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [copyOrderNumber, setCopyOrderNumber] = useState(1);
  const [showSuccessfullAlert, setShowSuccessfullAlert] = useState(false);
  const [showfailedAlert, setShowfailedAlert] = useState(false);
  const [submittingOrders, setSubmittingOrders] = useState(false);
  const [isStatusVisible, setIsStatusVsisible] = useState(false);
  const [basicForm, setBasicForm] = useState();
  const [navigationWarning, setNavigationWarning] = useState(true);

  useEffect(() => {
    setBasicForm(
      BasicFormHandler({
        shipFromLocations: shipFromLocations,
        onFormChange: forceUpdate,
        user: user,
        customer: customer,
      }),
    );
    setDetailForm(
      DetailFormHandler({
        carrierList: props.carriers.carrierList,
        onFormChange: forceUpdate,
      }),
    );
    // eslint-disable-next-line
  }, [addressQuery.isFetching, props.carriers.carrierList]);

  const [detailForm, setDetailForm] = useState();
  const formData = { rpcSizeOptions: orderInventory };

  useEffect(() => {
    const history = createBrowserHistory();

    if (_.get(props.location, "state.copy")) {
      let state = { ...props.location.state };
      delete state.copy;
      history.replace({ ...props.location, state });
    }

    if (props.location.state && shipFromLocations.length) {
      setCopyOrder(props.location.state.copy);
      setActiveComponentIndex(0);
    }
    // eslint-disable-next-line
  }, [addressQuery.isFetching]);

  useEffect(() => {
    if (copyOrder) {
      if (!basicForm) return;
      const shipFromOptions = basicForm.shipFrom.options || [];

      let shipFrom = shipFromOptions.find(
        (container) =>
          container.addressName.toString() ===
          copyOrder.shipFromLocationName.toString(),
      );

      if (shipFrom) basicForm.onChange("shipFrom", shipFrom);
    }
  }, [copyOrder, basicForm]);

  useEffect(() => {
    if (orderList.length > 0) {
      setShowSuccessfullAlert(
        orderList.every((order) => order.submitted === SUBMITTED) &&
          activeComponentIndex === 2,
      );
      setShowfailedAlert(
        orderList.some((order) => order.submitted === REJECTED) &&
          activeComponentIndex === 2,
      );
      setIsStatusVsisible(
        orderList.some((order) => order.submitted === REJECTED),
      );
    }
    // eslint-disable-next-line
  }, [orderList]);

  useEffect(() => {
    if (
      createCollectionOrderStatus.isSuccess &&
      !createCollectionOrderStatus.isError
    ) {
      setNavigationWarning(false);
    }
  }, [
    createCollectionOrderStatus.isSuccess,
    createCollectionOrderStatus.isError,
  ]);

  const resetForm = () => {
    setNavigationWarning(true);
    createCollectionOrderStatus.reset();
    initializeForm();
    setActiveComponentIndex(0);
    window.scrollTo(0, 0);
    setShowSuccessfullAlert(false);
  };

  const gotoViewOrders = () => {
    props.history.push("/collection-orders");
  };

  const initializeForm = () => {
    setBasicForm(
      BasicFormHandler({
        shipFromLocations: shipFromLocations,
        onFormChange: forceUpdate,
        user: user,
        customer: customer,
      }),
    );
    setDetailForm(
      DetailFormHandler({
        carrierList: props.carriers.carrierList,
        onFormChange: forceUpdate,
      }),
    );
    setOrderList([]);
    setUpdatingId(null);
    setCopyOrderNumber(1);
    setCompKey((val) => val++);
  };

  const addToList = (id) => {
    const startDate = moment(detailForm.pickupDate.value).format("YYYY-MM-DD");
    const startTime = moment(detailForm.pickupDate.value).format("HH:mm");
    const startDateTime = moment(startDate + " " + startTime);
    const poNo = trim(detailForm.shipperRefno.value);

    const orderUIDetails = {
      id: id
        ? id
        : orderList.length
        ? orderList[orderList.length - 1].orderUIDetails.id + 1
        : 1,
      loadingType: detailForm.loadingType,
      date: detailForm.pickupDate,
      pickupTimeEnd: detailForm.pickupTimeEnd,
      pickupTimeStart: detailForm.pickupTimeStart,
      carrier: detailForm.carrier,
    };

    const orderHeader = {
      shipFromAddress: basicForm.shipFrom.value.addressId,
      purchaseOrderNumber: poNo === "" ? "COP" : poNo,
      additionalInstructions: detailForm.additionalInfo.value,
      pickupTimeFrom: moment.utc(startDateTime).toISOString(),
      pickupTimeTo: moment.utc(startDateTime).toISOString(),
      trailerNumber: detailForm.trailerNo.value,
      scac: detailForm.carrier.value.scac,
      carrier: detailForm.carrier.value,
      userEmail: user.Email,
      userName: user.UserName,
      createdBy: user.UserName,
      customerId: user.CustomerInfo.CustID,
    };

    const orderDetails = detailForm.rpcItems.value.map((order) => {
      return {
        quantity: order.qty,
        itemId: order.itemId,
      };
    });

    return {
      orderHeader,
      orderDetails,
      orderUIDetails,
    };
  };

  const methods = {
    addOrder: () => {
      if (copyOrderNumber > 1) {
        const orders = [];
        for (let i = 1; i <= copyOrderNumber; i++) {
          const order = addToList(i + orderList.length);
          orders.push({
            orderHeader: order.orderHeader,
            orderDetails: order.orderDetails,
            orderUIDetails: order.orderUIDetails,
            unfilteredOrderDetails: detailForm.rpcItems,
            submitted: NOTSUBMITTED,
          });
        }
        setOrderList([...orderList, ...orders]);
      } else {
        const order = addToList();
        setOrderList([
          ...orderList,
          {
            orderHeader: order.orderHeader,
            orderDetails: order.orderDetails,
            orderUIDetails: order.orderUIDetails,
            unfilteredOrderDetails: detailForm.rpcItems,
            submitted: NOTSUBMITTED,
          },
        ]);
      }
      setDetailForm(
        DetailFormHandler({
          carrierList: props.carriers.carrierList,
          onFormChange: forceUpdate,
        }),
      );
      setUpdatingId(null);
    },
    updateOrder: (id) => {
      const order = addToList(id);
      const updatedOrderList = orderList.map((ordr) =>
        ordr.orderUIDetails.id === order.orderUIDetails.id
          ? {
              orderHeader: order.orderHeader,
              orderDetails: order.orderDetails,
              orderUIDetails: order.orderUIDetails,
              unfilteredOrderDetails: detailForm.rpcItems,
              submitted: NOTSUBMITTED,
            }
          : ordr,
      );
      setOrderList(updatedOrderList);
      setDetailForm(
        DetailFormHandler({
          carrierList: props.carriers.carrierList,
          onFormChange: forceUpdate,
        }),
      );
      setUpdatingId(null);
    },
    remove: (e, itemId) => {
      e.stopPropagation();
      const filteredList = orderList.filter(
        (order) => order.orderUIDetails.id !== itemId,
      );
      setOrderList(filteredList);
    },
    submit: async () => {
      const allOrders = [];
      setSubmittingOrders(true);
      await Promise.all(
        orderList.map(async (item) => {
          if (item.submitted !== SUBMITTED) {
            try {
              await createCollectionOrder({
                orderHeader: item.orderHeader,
                orderDetails: item.orderDetails,
              });
              allOrders.push({
                id: item.orderUIDetails.id,
                submitted: SUBMITTED,
              });
            } catch (error) {
              allOrders.push({
                id: item.orderUIDetails.id,
                submitted: REJECTED,
              });
            }
          }
        }),
      );
      const updatedOrderList = [...orderList];
      allOrders.forEach((orderResult) => {
        orderList.map((order, j) => {
          if (
            orderResult.id === order.orderUIDetails.id &&
            order.submitted !== SUBMITTED
          ) {
            updatedOrderList[j].submitted = orderResult.submitted;
          }
          return [];
        });
      });
      setOrderList(updatedOrderList);
      setSubmittingOrders(false);
    },
    editRow: (rowData) => {
      setUpdatingId(rowData.orderUIDetails.id);
      detailForm.onChange("pickupDate", rowData.orderUIDetails.date.value);
      detailForm.onChange(
        "loadingType",
        rowData.orderUIDetails.loadingType.value,
      );
      detailForm.onChange("trailerNo", rowData.orderHeader.trailerNumber);
      detailForm.onChange("rpcItems", rowData.unfilteredOrderDetails.value);
      detailForm.onChange(
        "shipperRefno",
        rowData.orderHeader.purchaseOrderNumber,
      );
      detailForm.onChange("carrier", rowData.orderUIDetails.carrier.value);
      detailForm.onChange(
        "additionalInfo",
        rowData.orderHeader.additionalInstructions,
      );
    },
    isLiveLoad: () => {
      return detailForm.loadingType.value.value === "1";
    },
    getRpcItems: () => {
      return detailForm.rpcItems.value;
    },
    getRpcSizeOptions: () => {
      return formData.rpcSizeOptions;
    },
  };

  const shouldNavigate = (from, to) => {
    if (from === to || to < from) {
      return true;
    }
    let result = false;

    for (let i = from; i < to; i++) {
      switch (i) {
        case 0:
          result = basicForm.isFormValid;
          break;
        case 1:
          result = detailForm.isFormValid;
          break;
        default:
          result = false;
          break;
      }
    }

    return result;
  };

  const editOrderDetails = () => {
    setActiveComponentIndex(1);
    setShowfailedAlert(false);
    setTimeout(() => {
      window.scrollTo(0, 20000);
    }, 0);
  };
  let mergedFormData = { ...basicForm, ...detailForm };

  if (!basicForm || !detailForm) return null;
  return (
    <div className="tw-bg-white tw-rounded tw-overflow-hidden tw-my-4">
      <Prompt
        when={
          (basicForm.isFormUpdated() || detailForm.isFormUpdated()) &&
          navigationWarning
        }
        message=""
      />
      <PageDisable
        disabled={submittingOrders}
        message="Submitting order, please wait"
      />
      <Accordion
        key={compKey}
        activeItemIndex={{
          value: activeComponentIndex,
          sync: (val) => setActiveComponentIndex(val),
        }}
      >
        <AccordionItem
          header="Basic Information"
          shouldNavigate={shouldNavigate}
          spacingClass="tw-p-0 sm:tw-p-8"
        >
          {(data) => (
            <BasicInfo
              methods={methods}
              formData={formData}
              form={basicForm}
              navigateTo={data.navigateTo}
              isLoadingAddresses={addressQuery.isFetching}
            />
          )}
        </AccordionItem>

        <AccordionItem
          header="Order Details"
          shouldNavigate={shouldNavigate}
          spacingClass="tw-p-0 sm:tw-p-8"
        >
          {(data) => (
            <OrderDetails
              methods={methods}
              formData={formData}
              form={detailForm}
              navigateTo={data.navigateTo}
              orderList={orderList}
              updatingId={updatingId}
              setCopyOrderNumber={setCopyOrderNumber}
              copyOrderNumber={copyOrderNumber}
              isStatusVisible={isStatusVisible}
            />
          )}
        </AccordionItem>
        <AccordionItem
          header="Confirmation"
          shouldNavigate={shouldNavigate}
          spacingClass="tw-p-0 sm:tw-p-8"
        >
          {(data) => (
            <Confirmation
              methods={methods}
              formData={mergedFormData}
              navigateTo={data.navigateTo}
              orderList={orderList}
            />
          )}
        </AccordionItem>
      </Accordion>

      <ConfirmationModal
        title="Request Submitted"
        show={showSuccessfullAlert}
        onClose={resetForm}
      >
        <p>Your pick up request has been received.</p>
        <p>
          For additional questions, please contact{" "}
          <a href="mailto:supplychain@toscaltd.com">supplychain@toscaltd.com</a>{" "}
        </p>

        <div className="tw-flex tw-flex-col tw-gap-2 tw-mt-6">
          <Button
            brand="secondary"
            type="button"
            fullwidth="true"
            onClick={gotoViewOrders}
          >
            View Orders
          </Button>
          <Button
            brand="primary"
            type="button"
            fullwidth="true"
            onClick={resetForm}
          >
            Place Another Order
          </Button>
        </div>
      </ConfirmationModal>

      <ConfirmationModal
        title="Warning: Request Error"
        brand="danger"
        show={showfailedAlert}
        onClose={() => setShowfailedAlert(false)}
      >
        <p>
          Some of the orders were not submitted. Please review the orders and
          submit it again.
        </p>
        <p>
          If the order fails again, please contact:
          {/* TODO: get email customer name */}
          <a
            className="tw-text-blue-600 tw-block"
            href={`mailto:customerexperience@toscaltd.com?subject=${_.get(
              props.user,
              "CustomerInfo.CustName",
              "",
            )}:`}
          >
            customerexperience@toscaltd.com
          </a>
        </p>

        <div className="tw-flex tw-flex-col tw-gap-2 tw-mt-6">
          <Button
            brand="primary"
            fullwidth="false"
            type="button"
            onClick={editOrderDetails}
          >
            Edit order details
          </Button>

          <Button
            brand="secondary"
            fullwidth="false"
            type="button"
            onClick={() => setShowfailedAlert(false)}
          >
            OK
          </Button>
        </div>
      </ConfirmationModal>
    </div>
  );
}

function mapStateToProps(state) {
  return { carriers: state.carriers };
}

export default connect(mapStateToProps)(PlaceOrder);
