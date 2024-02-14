import axios from "axios";
import { useQuery } from "react-query";
import _ from "lodash";

import { config } from "../../utils/conf";
import { requestHeaders } from "../../utils/http";
import useSession from "../Auth/useSession";

export default function useGetInventories(
  queryParameters,
  queryKey = "inventories",
) {
  const { accessToken, customerId } = useSession();

  const queryId = accessToken ? queryKey : `${queryKey}-no-token`;
  return useQuery(
    queryId,
    async () =>
      await axios.get(`${config.inventoryApiUrl}/v1/order-inventories`, {
        params: {
          customerId,
          ...queryParameters,
        },
        headers: requestHeaders(accessToken),
      }),
    {
      refetchOnWindowFocus: false,
      placeholderData: { data: [] },
      staleTime: Infinity,
      select: (data) => {
        const inventories = data.data || [];
        const ids = inventories.map((i) => i.itemClassId);
        const commodityTypes = Array.from(new Set([...ids]));

        const item =
          inventories.filter(
            (i) => i.itemClassId.toLocaleLowerCase() !== "nopalletitem",
          )[0] || {};
        const commodityType = _.get(item, "itemClassId", undefined);

        return {
          ...data,
          commodityTypes,
          commodityType,
        };
      },
    },
  );
}
