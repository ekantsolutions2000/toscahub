import axios from "axios";
import { useQuery } from "react-query";
import { config } from "../../utils/conf";
import { requestHeaders } from "../../utils/http";
import useSession from "../Auth/useSession";

export default function useGetCSRs() {
  const { accessToken } = useSession();

  const queryId = accessToken ? "csrs" : "csrs-no-token";
  return useQuery(
    queryId,
    async () =>
      await axios.get(
        `${config.customerProfileApiUrl}/v1/customer-solutions-representatives`,
        {
          headers: requestHeaders(accessToken),
        },
      ),
    {
      refetchOnWindowFocus: false,
      placeholderData: {
        data: [],
        forAddress: () => {
          return {};
        },
      },
      staleTime: Infinity,
      select: (data) => {
        const csrs = data.data || [];

        const forAddress = (addressId) => {
          return csrs.find((csr) => csr.addressId === addressId) || {};
        };

        return {
          ...data,
          forAddress,
        };
      },
    },
  );
}
