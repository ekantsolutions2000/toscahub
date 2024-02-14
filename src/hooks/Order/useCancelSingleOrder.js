import axios from "axios";
import { useMutation } from "react-query";
import { config } from "../../utils/conf";
import { requestHeaders } from "../../utils/http";
import useSession from "../Auth/useSession";

export default function useCancelSingleOrder(options = {}) {
  const { accessToken } = useSession();
  const mutation = useMutation(
    (data) =>
      axios.delete(`${config.orderApiUrl}/v1/orders/${data.orderId}`, {
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
    cancelSingleOrder: mutation.mutateAsync,
    cancelSingleOrderStatus: mutation,
  };
}
