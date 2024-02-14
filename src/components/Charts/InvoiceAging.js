import React, { Component } from "react";
import { connect } from "react-redux";
import Chart from "chart.js";
import Numeral from "numeral";
import Loader from "react-loader-spinner";

class InvoiceAging extends Component {
  canvasRef = React.createRef();

  state = {
    chart: null,
    nodata: false,
    chartIsLoading: true,
  };

  static getDerivedStateFromProps(props, state) {
    const { invoices } = props;
    const data = {};

    invoices.forEach((invoice) => {
      data[invoice.aging] = (data[invoice.aging] || 0) + invoice.invoiceAmount;
    });
    return {
      labels: Object.keys(data),
      data: Object.keys(data).map((key) => data[key].toFixed(2)),
    };
  }

  componentDidMount() {
    this.createChart();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.invoices.length !== this.props.invoices.length) {
      this.reload();
    }
  }

  createChart() {
    let ctx = this.canvasRef.current.getContext("2d");

    let vm = this;

    let chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: this.state.labels,
        datasets: [
          {
            label: "Amount",
            backgroundColor: "#EC710A",
            borderColor: "rgb(255, 99, 132)",
            barPercentage: 0.5,
            maxBarThickness: 50,
            data: this.state.data,
          },
        ],
      },

      plugins: [
        {
          beforeInit: function (chart, options) {
            vm.setState({ chartIsLoading: true });
          },
          afterInit: function (chart, options) {
            let firstSet = chart.config.data.datasets[0].data,
              dataSum = firstSet.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0,
              );
            let nodata = false;
            if (typeof firstSet !== "object" || dataSum === 0) {
              nodata = true;
            }
            vm.setState({ nodata: nodata, chartIsLoading: false });
          },
          afterRender: function (chart, options) {
            let ctx = chart.ctx;
            ctx.textAlign = "center";
            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            ctx.textBaseline = "bottom";

            // Loop through each data in the datasets
            chart.config.data.datasets.forEach(function (dataset, i) {
              let meta = chart.controller.getDatasetMeta(i);

              meta.data.forEach(function (bar, index) {
                let data = Numeral(dataset.data[index]).format("$0,0.00");
                ctx.fillText(data, bar._model.x, bar._model.y - 5);
              });
            });
          },
        },
      ],
      options: {
        hover: {
          animationDuration: 0,
        },
        tooltips: {
          enabled: false,
        },
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                callback: function (value, index, values) {
                  return Numeral(value).format("$0,0.00");
                },
              },
            },
          ],
        },
      },
    });

    this.setState({ chart });
  }

  reload = () => {
    this.state.chart.destroy();
    this.createChart();
  };

  render() {
    const showChart = !(this.props.loading || this.props.invoices.length === 0);

    return (
      <div className="tw-flex tw-justify-center tw-items-center tw-relative">
        <div className={`tw-w-full ${!showChart && "tw-hidden"}`}>
          <canvas ref={this.canvasRef} height={this.props.height}></canvas>
        </div>

        {this.props.loading || this.state.chartIsLoading ? (
          <div className="loader-container tw-absolute">
            <Loader
              type="Oval"
              color="rgba(246,130,32,1)"
              height="50"
              width="50"
            />
          </div>
        ) : this.state.nodata ? (
          <div className="tw-text-gray-600 tw-font-light"> No data </div>
        ) : null}
      </div>
    );
  }
}

const mapState = ({ invoices }) => ({
  invoices: invoices.invoices,
  loading: invoices.fetching,
  loaded: invoices.fetched,
});

InvoiceAging.defaultProps = {
  height: 150,
};

export default connect(mapState)(InvoiceAging);
