export default function reducer(
  state = {
    fetching: false,
    fetched: false,
    error: null,
    orders: [],
  },
  action,
) {
  switch (action.type) {
    case "FETCH_ORDER_LOG_PENDING": {
      return {
        ...state,
        fetching: true,
        fetched: false,
      };
    }
    case "FETCH_ORDER_LOG_REJECTED": {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      };
    }
    case "FETCH_ORDER_LOG_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        orders: enrich(action.payload.data),
        error: null,
      };
    }

    case "RESET_STATE": {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: null,
      };
    }

    default: {
      return { ...state };
    }
  }
}

function enrich(data) {
  const result = data.map((currentdata) => {
    let logData = currentdata.message;
    const requestBody = logData["Request-Body"];
    let success = Array.isArray(logData["Response-Body"]);

    let oneObj = {
      createdAt: currentdata.timestamp,
      cust_name: requestBody.metaData
        ? requestBody.metaData.customerName
        : requestBody.orderHeader.customerId,
      customer: requestBody.orderHeader.customerId,
      error: "",
      isSuccess: success,
      organization_id: requestBody.orderHeader.customerId,
      ship_to_address_name: requestBody.metaData
        ? requestBody.metaData.shipToAddressName
        : requestBody.orderHeader.customerId,

      order_header: {
        order_date: currentdata.timestamp,
        customer: requestBody.orderHeader.customerId, //id
        organization_id: requestBody.orderHeader.customerId,
        ship_to_address: requestBody.orderHeader.shipToAddress, //id
        req_del_date: requestBody.orderHeader.requestedDeliveryDate,
        cpu: 0,
        po_no: "",
        additional_instructions: requestBody.orderHeader.additionalInstructions,
        user_email: requestBody.orderHeader.userEmail,
        user_name: requestBody.orderHeader.userName,
        create_by: requestBody.orderHeader.userName,
        reqDelDate: requestBody.orderHeader.requestedDeliveryDate,
        customerPickUp: requestBody.orderHeader.customerPickUp,
      },
    };

    const details = requestBody.orderDetails.map((lineItem) => {
      return {
        modelSize: lineItem.itemId,
        poNo: lineItem.purchaseOrderNumber,
        additional_instructions: lineItem.additionalInstructions,
        quantity: lineItem.quantity,
        req_del_date: lineItem.requestedDeliveryDate,
      };
    });

    oneObj.order_detail = details;

    return oneObj;
  });

  return result;
}
