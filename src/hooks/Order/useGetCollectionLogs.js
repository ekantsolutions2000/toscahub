import axios from "axios";
import { useQuery } from "react-query";
import { config } from "../../utils/conf";
import { requestHeaders } from "../../utils/http";
import useSession from "../Auth/useSession";
import _ from "lodash";

export default function useGetCollectionLogs() {
  const { accessToken, customerId } = useSession();

  const queryId = accessToken ? "collection-logs" : "collection-logs-no-token";

  const url = `${config.logsApiUrl}/v1/aggregate`;

  const fetchCollections = async () => {
    const res = await axios.get(url, {
      headers: requestHeaders(accessToken),
      params: {
        customerId: customerId, //'C1100179',
        timespan: 1440, // 720, 12000, 1440
        queryType: "APIM",
      },
    });

    const collectionOrders = res.data || [];

    let ordersFlat = [];
    if (!_.isEmpty(collectionOrders)) {
      collectionOrders.forEach((order) => {
        const isSuccess = true;
        order.message[`Request-Body`].orderDetails.forEach((details) => {
          const tmp = {
            ...order.message["Request-Body"],
            ...details,
            ...order.message["Request-Body"].orderHeader,
            organizationName: "",
            isSuccess,
          };
          ordersFlat.push(tmp);
        });
      });

      ordersFlat = _.orderBy(ordersFlat, "createdAt", "desc");
    }

    const formatedFlats = enrich(ordersFlat);
    return formatedFlats;
  };

  function enrich(data) {
    const result = data.map((currentdata) => {
      let oneObj = {
        additional_instructions: currentdata.additionalInstructions,
        crItemCode: currentdata.itemId,
        customer_name: currentdata.customerId,
        header: currentdata.orderHeader,
        itemDescription: currentdata.itemId,
        itemId: currentdata.itemId,
        organizationName: currentdata.organizationName,
        pickup_time_from: currentdata.pickupTimeFrom,
        pickup_time_to: currentdata.pickupTimeTo,
        po_no: currentdata.purchaseOrderNumber,
        isSuccess: true, //this is temporary hard codeed value
        qty: currentdata.quantity,
        user: currentdata.userName,
      };

      const details = currentdata.orderDetails.map((lineItem) => {
        return {
          itemId: lineItem.itemId,
          qty: lineItem.quantity,
        };
      });

      oneObj.details = details;
      return { ...oneObj };
    });

    return result;
  }

  return useQuery([queryId], fetchCollections, {
    refetchOnWindowFocus: false,
    enabled: !!accessToken,
  });
}
