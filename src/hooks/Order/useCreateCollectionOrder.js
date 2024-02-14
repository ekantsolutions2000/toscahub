import axios from "axios";
import { useMutation } from "react-query";
import { config } from "../../utils/conf";
import { requestHeaders } from "../../utils/http";
import useSession from "../Auth/useSession";

export default function useCreateCollectionOrder(options = {}) {
  const { accessToken } = useSession();
  const mutation = useMutation(
    (data) =>
      axios.post(`${config.orderApiUrl}/v1/collection-orders`, data, {
        headers: requestHeaders(accessToken),
      }),
    {
      // ...options
      onError: (error, variables, context) => {
        error.readableError = error.response.data.message;
      },
    },
  );

  return {
    createCollectionOrder: mutation.mutateAsync,
    createCollectionOrderStatus: mutation,
  };
}
