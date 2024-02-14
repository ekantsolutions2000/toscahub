import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { config } from "../../utils/conf";
import { requestHeaders } from "../../utils/http";
import useSession from "../Auth/useSession";

export default function useUpdateCollectionOrderTrailerNumber(options = {}) {
  const { accessToken } = useSession();
  const cache = useQueryClient();

  const action = async (data) => {
    return axios.patch(
      `${config.orderApiUrl}/v1/collection-orders/${data.orderNumber}`,
      data.payload,
      {
        headers: {
          ...requestHeaders(accessToken),
        },
      },
    );
  };

  const mutation = useMutation((data) => action(data), {
    onError: (error, variables, context) => {
      error.readableError =
        error?.response?.data?.message ?? "Something went wrong.";
    },
    onSuccess: () => {
      cache.invalidateQueries("collection-orders");
    },
  });

  return {
    updateCollectionOrderTrailerNumber: mutation.mutateAsync,
    updateCollectionOrderTrailerNumberStatus: mutation,
  };
}
