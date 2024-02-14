import { QueryClient, QueryClientProvider } from "react-query";
import { config } from "../../utils/conf";
import Loader from "react-loader-spinner";
import useGetImage from "../../hooks/useGetImage";
import useGetInventories from "../../hooks/Inventory/useGetInventories";
import store from "../../store";
import { Provider } from "react-redux";
import useSession from "../../hooks/Auth/useSession";
import * as userTypes from "../../utils/UserTypes";

const ImageContent = (props) => {
  const { mediaUrl, itemId } = props;

  const user = useSession();
  const params =
    user.userType === userTypes.OUTBOUND
      ? { outbound: true }
      : { inbound: true };

  let inventoriesQuery = useGetInventories(params);
  const { data } = inventoriesQuery.data;

  const filteredItem =
    !mediaUrl &&
    data.find((item) => {
      return item.itemId === itemId;
    });

  const imageQuery = useGetImage(
    mediaUrl
      ? mediaUrl
      : filteredItem
      ? filteredItem.mediaUrl
      : `${config.rpcImagePath}default.png`,
    `${config.rpcImagePath}default.png`,
  );

  return (
    <>
      {!imageQuery.isFetching && (
        <img
          className="tw-object-contain tw-w-full tw-h-full"
          src={imageQuery.data}
          alt={itemId}
        />
      )}

      {imageQuery.isFetching && (
        <div
          className={
            "tw-absolute loader-container tw-inset-0 tw-flex tw-items-center tw-justify-center"
          }>
          <Loader
            type="ThreeDots"
            color="rgba(246,130,32,1)"
            height="50"
            width="50"
          />
        </div>
      )}
    </>
  );
};

const Wrapper = (props) => {
  const queryClient = new QueryClient();
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ImageContent {...props} />
      </QueryClientProvider>
    </Provider>
  );
};

export default Wrapper;
