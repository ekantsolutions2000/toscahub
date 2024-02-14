import axios from "axios";
import { useQuery } from "react-query";
import { config } from "../../utils/conf";
import { requestHeaders } from "../../utils/http";
import useSession from "../Auth/useSession";
import _ from "lodash";

export default function useGetOrganizationsLogs() {
  const { accessToken } = useSession();

  const queryId = accessToken ? "organizations" : "organizations-no-token";

  const url = `${config.customerProfileApiUrl}/v1/organizations`;

  const fetchOrganizations = async () => {
    let res = await axios.get(url, {
      headers: requestHeaders(accessToken),
    });

    res = _.orderBy(res.data, "organizationName", "asc");

    return res;
  };

  return useQuery([queryId], fetchOrganizations, {
    refetchOnWindowFocus: false,
    enabled: !!accessToken,
  });
}
