import React, { Component } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export default class LoadingData extends Component {
  showLoading = () => {
    return this.props.loading;
  };

  render() {
    return this.showLoading() ? <Skeleton {...this.props} /> : this.props.data;
  }
}

LoadingData.defaultProps = {
  loading: true,
  data: "",
};
