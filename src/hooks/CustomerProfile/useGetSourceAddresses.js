import axios from "axios";
import { useQuery } from "react-query";
import { config } from "../../utils/conf";
import { requestHeaders } from "../../utils/http";
import useSession from "../Auth/useSession";

export default function useGetSourceAddresses(queryParameters = {}) {
  const { accessToken } = useSession();
  const { userId, customerType } = queryParameters;

  const queryId = accessToken
    ? "source-addresses"
    : "source-addresses-no-token";
  return useQuery(
    queryId,
    async () =>
      await axios.get(`${config.customerProfileApiUrl}/v1/addresses`, {
        params: {
          type: "source",
          userId,
          customerType,
        },
        headers: requestHeaders(accessToken),
      }),
    {
      refetchOnWindowFocus: false,
      placeholderData: { data: [] },
      staleTime: Infinity,
    },
  );
}
