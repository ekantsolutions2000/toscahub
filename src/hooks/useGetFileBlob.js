import axios from "axios";
import { useMutation } from "react-query";
import { requestHeaders } from "../utils/http";
import useSession from "./Auth/useSession";

export default function useGetFileBlob() {
  const { accessToken } = useSession();

  const action = async ({ url, contentType }) => {
    return axios.get(url, {
      headers: {
        ...requestHeaders(accessToken),
        "Content-Type": contentType,
      },
      responseType: "arraybuffer",
    });
  };

  const mutation = useMutation(
    ({ url, contentType = "application/pdf" }) => action({ url, contentType }),
    {
      // ...options
      onError: (error, variables, context) => {
        error.readableError = error.response.data.message;
      },
    },
  );

  return {
    getFileBlob: mutation.mutateAsync,
    getFileBlobStatus: mutation,
  };
}
