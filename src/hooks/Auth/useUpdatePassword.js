import axios from "axios";
import { useMutation } from "react-query";
import { config } from "../../utils/conf";
import { requestHeaders } from "../../utils/http";
import useSession from "../Auth/useSession";

export default function useUpdatePassword(options = {}) {
  const { accessToken } = useSession();
  const mutation = useMutation(
    (updatedUserCredentials) =>
      axios.post(
        `${config.authenticationApiUrl}/v1/users/password-update`,
        updatedUserCredentials,
        {
          headers: requestHeaders(accessToken),
        },
      ),
    {
      // ...options
      onError: (error, variables, context) => {
        error.readableError = error.response.data.message;
      },
    },
  );

  return {
    updatePassword: mutation.mutateAsync,
    updatePasswordStatus: mutation,
  };
}
