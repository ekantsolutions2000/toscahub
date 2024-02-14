import axios from "axios";
import { useQuery } from "react-query";
import { config } from "../../utils/conf";
import { requestHeaders } from "../../utils/http";
import useSession from "../Auth/useSession";
import _ from "lodash";

const enrich = (data) => {
  const excludeContainers = ["Pallet"];
  return data.filter((x) => !excludeContainers.includes(x.containerType));
};

export default function useGetCollectionOrders(userId) {
  const { accessToken } = useSession();

  const queryId = accessToken
    ? "collection-orders"
    : "collection-orders-no-token";
  const url = `${config.orderApiUrl}/v1/collection-orders`;

  return useQuery(
    [queryId, { userId: userId }],
    async () =>
      await axios.get(url, {
        params: {
          limit: 500,
        },
        headers: requestHeaders(accessToken),
      }),
    {
      refetchOnWindowFocus: false,
      placeholderData: { data: [] },
      staleTime: Infinity,
      select: (data) => {
        return {
          ...data,
          data: _.orderBy(
            enrich(data.data),
            ["orderDate", "orderNumber"],
            ["desc", "desc"],
          ),
        };
      },
    },
  );
}
