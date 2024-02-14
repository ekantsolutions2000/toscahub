import axios from "axios";
import { useQuery } from "react-query";
import { requestHeaders } from "../../utils/http";
import useSession from "../Auth/useSession";

export default function useGetLadingDocumentRef({ url }) {
  const { accessToken } = useSession();
  const queryId = url;

  const fetchData = async () => {
    const res = await axios.get(url, {
      headers: {
        ...requestHeaders(accessToken),
      },
    });

    const data = res.data;
    return data;
  };

  return useQuery([queryId], fetchData, {
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    enabled: !!accessToken && !!url,
    retry: false,
  });
}
