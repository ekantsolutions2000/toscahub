import axios from "axios";
import { useQuery } from "react-query";
// import { config } from "../../utils/conf";
import { requestHeaders } from "../../utils/http";
import useSession from "../Auth/useSession";

export default function useGetBulkOrderSourceArtifact({ url }) {
  const { accessToken } = useSession();
  const queryId = url;

  // const url = `${config.orderApiUrl}/v1/orders/artifacts/5`;

  const fetchData = async () => {
    const res = await axios.get(url, {
      headers: {
        ...requestHeaders(accessToken),
        "Content-Disposition": "attachment; filename=template.xlsx",
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      responseType: "arraybuffer",
    });

    const data = res.data;
    return data;
  };

  return useQuery([queryId], fetchData, {
    refetchOnWindowFocus: false,
    enabled: !!accessToken && !!url,
  });
}
