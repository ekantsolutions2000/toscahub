import axios from "axios";
import { useQuery } from "react-query";
import { config } from "../../utils/conf";
import { requestHeaders } from "../../utils/http";
import useSession from "./../Auth/useSession";

export default function useGetSalespersons() {
  const { accessToken } = useSession();

  const queryId = accessToken ? "sales-persons" : "sales-persons-no-token";
  return useQuery(
    queryId,
    async () =>
      await axios.get(`${config.customerProfileApiUrl}/v1/salespersons`, {
        headers: requestHeaders(accessToken),
      }),
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
        const salespersons = data.data || [];

        const forAddress = function (addressId) {
          return (
            salespersons.find(
              (salesperson) => salesperson.addressId === addressId,
            ) || {}
          );
        };

        return {
          ...data,
          forAddress,
        };
      },
    },
  );
}
