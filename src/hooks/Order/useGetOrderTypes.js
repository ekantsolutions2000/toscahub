import axios from "axios";
import { useQuery } from "react-query";
import { config } from "../../utils/conf";
import { requestHeaders } from "../../utils/http";
import useSession from "../Auth/useSession";

export default function useGetOrderTypes() {
  const { accessToken } = useSession();

  const queryId = accessToken ? "order-types" : `order-types-no-token`;
  return useQuery(
    queryId,
    async () =>
      await axios.get(`${config.orderApiUrl}/v1/order-types`, {
        headers: requestHeaders(accessToken),
      }),
    {
      refetchOnWindowFocus: false,
      placeholderData: { data: [] },
      staleTime: Infinity,
      enabled: !!accessToken,
      select: (data) => {
        let types = data.data.map((x) => x.orderTypeId);
        let customerType = "OTHER";

        if (types.includes(1)) {
          customerType = "OUTBOUND";
        }

        if (types.includes(6)) {
          customerType = "INBOUND";
        }

        return {
          ...data,
          customerType,
          isInboundCustomer: customerType === "INBOUND",
        };
      },
    },
  );
}
