import axios from "axios";
import { useQuery } from "react-query";
import { config } from "../../utils/conf";
import { requestHeaders } from "../../utils/http";
import useSession from "../Auth/useSession";

export default function useGetLogs(queryParameters = {}) {
  const { accessToken } = useSession();
  const { customerId = "C1100179", timespan = 1200 } = queryParameters;

  const queryId = ["logs", { customerId, timespan }];

  const fetchData = async () => {
    const response = await axios.get(`${config.logsApiUrl}/v1/aggregate`, {
      headers: requestHeaders(accessToken),
      params: {
        customerId,
        timespan,
        queryType: "APIM",
      },
    });

    const result = [];
    const responseData = response.data;

    return responseData;
  };

  return useQuery(queryId, fetchData, {
    refetchOnWindowFocus: false,
    placeholderData: { data: [] },
    staleTime: Infinity,
    enabled: !!accessToken,
  });
}
