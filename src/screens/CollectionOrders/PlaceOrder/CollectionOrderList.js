import OrderHeader from "./OrderHeader";
import OrderItem from "./OrderItem";
import PropTypes from "prop-types";

const CollectionOrderList = ({
  orderList,
  methods,
  isDeleteAvailable,
  isStatusVisible,
}) => {
  return (
    <div className="summery-list-wrapper tw-mt-5 tw-border tw-border-gray-300 tw-grid tw-overflow-x-scroll lg:tw-overflow-x-hidden">
      <table className="tw-min-w-full ">
        <thead>
          <tr className="tw-bg-tosca-gray tw-grid-flow-col">
            <OrderHeader title="ID" />
            <OrderHeader title="Loading Type" />
            <OrderHeader title="Trailer Number" />
            <OrderHeader title="RPC Details" />
            <OrderHeader title="Date" />
            <OrderHeader title="Shipper #" />
            <OrderHeader title="Carrier" />
            <OrderHeader title="Additional Information" />
            {isStatusVisible && <OrderHeader title="Order Status" />}
            {isDeleteAvailable && <OrderHeader title="" />}
            {isDeleteAvailable && <OrderHeader title="" />}
          </tr>
        </thead>
        <tbody className="tw-bg-white tw-grid-flow-col">
          {Array.isArray(orderList) && !orderList.length ? (
            <td colSpan={9}>
              <p
                style={{
                  marginTop: "10px",
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                No Order Details Have Been Added
              </p>
            </td>
          ) : null}

          {orderList?.map((order) => (
            <OrderItem
              key={order.orderUIDetails.id}
              order={order}
              methods={methods}
              isDeleteAvailable={isDeleteAvailable}
              isStatusVisible={isStatusVisible}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

CollectionOrderList.propTypes = {
  orderList: PropTypes.array,
  methods: PropTypes.object,
  isDeleteAvailable: PropTypes.bool,
  isStatusVisible: PropTypes.bool,
};

export default CollectionOrderList;
