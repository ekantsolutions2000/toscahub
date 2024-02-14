import React, { useEffect, useState } from "react";
import "./style.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  CollectionOrderHistoryList,
  NotificationPopup,
  OrderHistoryItemPopup,
} from "../../../components";
import { determineNavStyling } from "../../../components/Nav/determineNavStyling";
import useGetCollectionOrdersByFilter from "../../../hooks/Order/useGetCollectionOrdersByFilter";
import _ from "lodash";

import useUpdateCollectionOrderTrailerNumber from "../../../hooks/Order/useUpdateCollectionOrderTrailerNumber";
import { PageDisable } from "../../../components";
import ConfirmationModal from "../../../components/Modal/ConfirmationModal";
import Button from "../../../components/Button/Button";

function CollectionOrdersHistory(props) {
  const [showFilter, setShowFilter] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [orderInfo, setOrderInfo] = useState({});
  const [carouselIndex, setCarouselIndex] = useState({});
  const [carouselOrders, setCarouselOrders] = useState([]);
  const [myOrdersOnly, setMyOrdersOnly] = useState(true);

  const {
    updateCollectionOrderTrailerNumber,
    updateCollectionOrderTrailerNumberStatus,
  } = useUpdateCollectionOrderTrailerNumber();

  useEffect(() => {
    determineNavStyling(props.location.pathname);
  }, [props.location.pathname]);

  const collectionOrdersQuery = useGetCollectionOrdersByFilter(
    props.user.UserId,
    myOrdersOnly ? props.user.Email : null,
  );
  const collectionOrders = collectionOrdersQuery.data.data || [];

  const changeFilters = () => {
    setMyOrdersOnly(!myOrdersOnly);
  };

  const closeModal = () => {
    updateCollectionOrderTrailerNumberStatus.reset();
    setShowInfoPopup(false);
  };

  const showModal = (order, reorder, orders, index) => {
    setShowInfoPopup(true);
    setOrderInfo(order);
    setCarouselOrders(orders);
    setCarouselIndex(index);
  };

  const updateOrder = (orders, index, flag) => {
    if (flag === "next" && !_.isEmpty(orders[index + 1])) {
      setOrderInfo(orders[index + 1]);
      setCarouselIndex(index + 1);
    }

    if (flag === "prev" && !_.isEmpty(orders[index - 1])) {
      setOrderInfo(orders[index - 1]);
      setCarouselIndex(index - 1);
    }
  };

  const updateTrailerNumber = async (e, orderDetails) => {
    e.preventDefault();

    try {
      await updateCollectionOrderTrailerNumber({
        orderNumber: orderDetails.orderNumber,
        payload: {
          orderHeader: orderDetails,
        },
      });
    } catch (error) {
      console.log(error);
    }

    if (updateCollectionOrderTrailerNumberStatus.isSuccess) {
      closeModal();
    }
  };

  const updateError =
    updateCollectionOrderTrailerNumberStatus.error?.response?.data?.message ??
    null;

  return (
    <div className="page" id="inbound-collection-orders-page">
      <PageDisable
        disabled={updateCollectionOrderTrailerNumberStatus.isLoading}
        message="Updating  trailer number, please wait"
      />
      <NotificationPopup
        message={updateError}
        visible={updateCollectionOrderTrailerNumberStatus.isError}
        closeModal={updateCollectionOrderTrailerNumberStatus.reset}
        type="danger"
      />

      <ConfirmationModal
        title="Request Submitted"
        show={updateCollectionOrderTrailerNumberStatus.isSuccess}
        onClose={updateCollectionOrderTrailerNumberStatus.reset}
      >
        <p>Trailer Number has been updated.</p>

        <div className="tw-flex tw-flex-col tw-gap-2 tw-mt-6">
          <Button
            brand="secondary"
            type="button"
            fullwidth="true"
            onClick={() => {
              updateCollectionOrderTrailerNumberStatus.reset();
              closeModal();
            }}
          >
            OK
          </Button>
        </div>
      </ConfirmationModal>

      <OrderHistoryItemPopup
        visible={showInfoPopup}
        closeModal={closeModal}
        orderInfo={orderInfo}
        updateOrder={updateOrder}
        orders={carouselOrders}
        index={carouselIndex}
        user={props.user}
        updateTrailerNumber={updateTrailerNumber}
        key={orderInfo.orderNumber}
      />
      <div
        id="order-history-page"
        style={{ display: showFilter ? "none" : "block" }}
      >
        <div className="order-page-header">
          <div className="header-info">
            <div className="tw-flex tw-items-baseline">
              <h3>Collection Order History</h3>
            </div>
            <p>View details, check status or order again.</p>
            <p className="order-history-page-info">
              * Please allow 1-2 minutes for new orders to be displayed in Order
              History.
            </p>
          </div>
          <div className="header-btn">
            <Link
              to="/collection-orders/new"
              className="btn pull-right order-button"
            >
              Place New Order
            </Link>
          </div>
        </div>
        <CollectionOrderHistoryList
          orders={collectionOrders}
          loading={collectionOrdersQuery.isFetching}
          showFilter={() => setShowFilter(true)}
          showModal={showModal}
          changeFilters={changeFilters}
          myOrdersOnly={myOrdersOnly}
        />
      </div>
    </div>
  );
}

const { string } = PropTypes;

CollectionOrdersHistory.propTypes = {
  accessToken: string,
};

const mapState = ({ session }) => ({
  accessToken: session.user.accessToken,
  user: session.user,
});

export default connect(mapState)(CollectionOrdersHistory);
