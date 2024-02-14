import axios from "axios";
import { useMutation } from "react-query";
import { config } from "../../utils/conf";
import { requestHeaders } from "../../utils/http";
import useSession from "../Auth/useSession";

export default function useCreateBulkOrder(options = {}) {
  const { accessToken } = useSession();

  const action = async (data) => {
    const formData = new FormData();
    formData.append("file", data.file);

    return axios.post(`${config.orderApiUrl}/v1/orders/uploads`, formData, {
      headers: {
        ...requestHeaders(accessToken),
        "Content-Type": "multipart/form-data",
      },
      params: {
        ...(data.validations ? {} : { validations: false }),
      },
    });
  };

  const mutation = useMutation((data) => action(data), {
    // ...options
    onError: (error, variables, context) => {
      error.readableError = error.response.data.message;
    },
  });

  return {
    createBulkOrder: mutation.mutateAsync,
    createBulkOrderStatus: mutation,
  };
}
