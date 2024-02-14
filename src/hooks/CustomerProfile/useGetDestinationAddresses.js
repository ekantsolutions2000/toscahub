import axios from "axios";
import { useQuery } from "react-query";
import { config } from "../../utils/conf";
import { requestHeaders } from "../../utils/http";
import useSession from "../Auth/useSession";

export default function useGetDestinationAddresses() {
  const { accessToken } = useSession();

  const queryId = accessToken
    ? "destination-addresses"
    : "destination-addresses-no-token";
  return useQuery(
    queryId,
    async () =>
      await axios.get(
        `${config.customerProfileApiUrl}/v1/addresses?type=destination`,
        {
          headers: requestHeaders(accessToken),
        },
      ),
    {
      refetchOnWindowFocus: false,
      placeholderData: { data: [] },
      staleTime: Infinity,
    },
  );
}
