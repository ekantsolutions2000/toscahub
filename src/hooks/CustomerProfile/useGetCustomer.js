import axios from "axios";
import { useQuery } from "react-query";
import { config } from "../../utils/conf";
import { requestHeaders } from "../../utils/http";
import useSession from "../Auth/useSession";

export default function useGetCustomer(customerId) {
  const { accessToken } = useSession();

  const fetchData = async () => {
    const response = await axios.get(
      `${config.customerProfileApiUrl}/v1/customers/${customerId}`,
      {
        headers: requestHeaders(accessToken),
      },
    );
    return response.data;
  };

  return useQuery(["customer", customerId], fetchData, {
    refetchOnWindowFocus: false,
    placeholderData: { data: [] },
    staleTime: Infinity,
    enabled: customerId !== "na",
  });
}
