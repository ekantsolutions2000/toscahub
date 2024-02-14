import React, { Component } from "react";
import axios from "axios";
import { config } from "../../utils/conf";
import { requestHeaders } from "../../utils/http";
import * as Account from "./Account";
import * as CustomsDetails from "./CustomsDetails";
import * as PalletProgram from "./PalletProgram";
import * as Shipping from "./Shipping";
import * as ItInfor from "./ItInformation";
import * as CreditApp from "./CreditApplication";
import { Accordion, AccordionItem } from "./../../components/Accordion";
import { PageDisable } from "../../components";
import BreadCrumb from "./Components/BreadCrumb";
import PropTypes from "prop-types";
import { newCustomerActions, customerActions } from "../../actions";
import { toast, ToastContainer } from "react-toastify";
import { connect } from "react-redux";
import _ from "lodash";
import Loader from "react-loader-spinner";
import { logo } from "../../images";
import "./style.css";
import ThankYouModal from "../../components/Modals/ThankYou";
// import AccountFormHandler from './Account/FormHandler';
// import AccountComponent from './Account/AccountComponent'

const initState = {
  config: { receivedCustomerSetup: false, data: {} },
  setSavedFormData: false,
  accountForm: null,
  palletProgramForm: null,
  shippingForm: null,
  customsDetailsForm: null,
  shippingDetails: {},
  customsDetails: {},
  itInformation: {},
  CreditApplication: {},
  itemIndex: 0,
  saveForLaterState: "insert",
  showErrorNotification: false,
  accordionItems: [
    {
      name: "Account & Billing Information",
      component: Account.Component,
      form: "accountForm",
    },
    {
      name: "Pallet Program",
      component: PalletProgram.Component,
      form: "palletProgramForm",
    },
    {
      name: "Ship to Address",
      component: Shipping.Component,
      form: "shippingForm",
    },
    {
      name: "IT Information",
      component: ItInfor.Component,
      form: "itInforForm",
    },
    {
      name: "Application For Credit",
      component: CreditApp.Component,
      form: "CreditAppForm",
    },
    // {
    //   name: "Customs Details\n(For export only)",
    //   component: CustomsDetails.Component,
    //   form: "customsDetailsForm",
    // },
    // {
    //   name: 'Outbound Reporting Preference',
    //   component: null,
    //   form: null
    // },
    // {
    //   name: 'Final RPC Location',
    //   component: null,
    //   form: null
    // },
  ],
};
class NewCustomerSetup extends Component {
  static contextTypes = {
    router: PropTypes.object,
  };
  constructor(props, context) {
    super(props, context);

    this.state = {
      ...initState,
      accountForm: Account.FormHandler(this),
      palletProgramForm: PalletProgram.FormHandler(this),
      customsDetailsForm: CustomsDetails.FormHandler(this),
      shippingForm: Shipping.FormHandler(this),
      itInforForm: ItInfor.FormHandler(this),
      CreditAppForm: CreditApp.FormHandler(this),
      showSuccessModal: false,
    };
  }

  getNewCustomerKey = () => {
    return `NEW_CUSTOMER_${this.props.user.CustomerInfo.CustID.replace(
      new RegExp(" ", "g"),
      "_",
    )}`;
  };

  onFormChange = (e) => {
    this.forceUpdate();
  };

  shouldNavigate = (from, to) => {
    if (from === to || to < from) {
      return true;
    }
    let result = true;
    let errorMsg = "";

    for (let i = from; i < to; i++) {
      switch (i) {
        case 0:
          result = this.state.accountForm.isFormValid && result; // Account & Billing Information validation
          errorMsg =
            "Please complete the Account & Billing Information form before navigating.";
          break;
        case 1:
          result = this.state.palletProgramForm.isFormValid && result; // Pallet Program validation
          errorMsg =
            "Please complete the Pallet Program form before navigating.";
          break;
        case 2:
          result = this.state.shippingForm.isFormValid && result; // Shipping Details validation
          errorMsg =
            "Please complete the Shipping Details form before navigating.";
          break;
        case 3:
          result =
            this.state.accordionItems[3].form === "customsDetailsForm"
              ? this.state.customsDetailsForm.isFormValid && result
              : this.state.accordionItems[3].form === "itInforForm"
              ? this.state.itInforForm.isFormValid && result
              : result;
          errorMsg =
            this.state.accordionItems[3].form === "customsDetailsForm"
              ? "Please complete the Custom Details form before navigating."
              : this.state.accordionItems[3].form === "itInforForm"
              ? "Please complete the IT information form before navigating."
              : null;
          break;
        case 4:
          result =
            this.state.accordionItems[4].form === "itInforForm"
              ? this.state.itInforForm.isFormValid && result
              : result;
          errorMsg =
            "Please complete the IT information form before navigating.";
          break;
        default:
          result = true;
          errorMsg = "";
          break;
      }
    }

    if (!result) {
      toast.error(
        errorMsg ? errorMsg : "Please complete the form before navigating.",
      );
    }

    return result;
  };

  getFormData = (obj) => {
    return obj.map((formItem) => {
      let address = {};
      for (const key in formItem.form) {
        const formKey = key.split("_");
        if (formKey.length === 1) {
          address = { ...address, [key]: formItem.form[key].value };
        }
      }
      return address;
    });
  };

  navigateTo = (index) => {
    if (this.shouldNavigate(this.state.itemIndex, index)) {
      this.setState({ itemIndex: index });
    }
  };

  onSubmitForm = async () => {
    const { dispatch, user } = this.props;
    let token = user.accessToken;

    const accountAttachment = _.isEmpty(
      this.state.accountForm.getData(true).attachments,
    )
      ? []
      : [this.state.accountForm.getData(true).attachments];

    const newCustomerData = {
      attachments: accountAttachment,
      customerInquiry: {
        customerName: this.props.customerInfo.customerName,
        accountDetails: this.state.accountForm.getData(true),
        palletProgramDetails: this.state.palletProgramForm.getData(true),
        itInforFormDetails: this.state.itInforForm.getData(true),
        creditAppDetails: this.state.CreditAppForm.getData(true),
        shippingDetails: this.getFormData(
          this.state.shippingDetails.shippingAddresses,
        ),
        customsDetails:
          this.state.customsDetails.customsDetails === undefined
            ? null
            : this.getFormData(this.state.customsDetails.customsDetails),
      },
    };
    dispatch(newCustomerActions.submitNewCustomerData(token, newCustomerData));
  };

  setupForm = () => {
    this.setState({
      accountForm: Account.FormHandler(this),
      palletProgramForm: PalletProgram.FormHandler(this),
    });
  };

  onSaveLater = async () => {
    const { dispatch, user } = this.props;

    let token = user.accessToken;

    let newCustomerData = {
      accountForm: this.state.accountForm.getData(true),

      attachments: [this.state.accountForm.getData(true).attachments],

      palletProgramForm: this.state.palletProgramForm.getData(true),

      shippingFormData: {
        shippingForm: this.state.shippingForm.getData(true),
        shippingDetails: this.state.shippingDetails,
      },

      customsFormData: {
        customsForm: this.state.customsDetailsForm.getData(true),
        customsDetails: this.state.customsDetails,
      },

      itInforFormData: this.state.itInforForm.getData(true),

      creditAppFormData: this.state.CreditAppForm.getData(true),
    };

    if (this.state.saveForLaterState === "insert") {
      this.setState({ saveForLaterState: "update" });
      dispatch(
        newCustomerActions.saveLaterNewCustomerData(
          token,
          this.getNewCustomerKey(),
          newCustomerData,
        ),
      );
    }
    if (this.state.saveForLaterState === "update") {
      dispatch(
        newCustomerActions.updayeLaterNewCustomerData(
          token,
          this.getNewCustomerKey(),
          newCustomerData,
        ),
      );
    }
  };

  deleteSavedCustomer = () => {
    const { dispatch, user } = this.props;
    let token = user.accessToken;

    dispatch(
      newCustomerActions.deleteSavedForLaterNewCustomerData(
        token,
        this.getNewCustomerKey(),
      ),
    );
  };

  getAddressValidation = (addressObj) => {
    return new Promise((resolve, reject) => {
      let validationUserKey = "586INNOV6461";
      let xml = `<AddressValidateRequest USERID="${validationUserKey}">
                    <Address>
                      <Address1>${addressObj.address1ine1}</Address1>
                      <Address2>${addressObj.address1ine2}</Address2>
                      <City>${addressObj.city}</City>
                      <State>${addressObj.state.code}</State>
                      <Zip5>${addressObj.zip5}</Zip5>
                      <Zip4></Zip4>
                    </Address>
                  </AddressValidateRequest>`;

      let url = `https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&XML=${encodeURIComponent(
        xml,
      )}`;

      axios
        .get(url)
        .then((res) => {
          const xmlRes = res.data;
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlRes, "text/xml");

          if (xmlDoc.getElementsByTagName("Error")[0] !== undefined) {
            resolve({
              addressKey: addressObj.addressKey,
              validate: false,
              errorMsg:
                xmlDoc.getElementsByTagName("Description")[0].childNodes[0]
                  .nodeValue,
            });
          } else {
            resolve({
              addressKey: addressObj.addressKey,
              validate: true,
              errorMsg: "",
            });
          }
        })
        .catch((error) => {
          reject();
        });
    });
  };

  setShippingDetails = (shippingDetailsState) => {
    this.setState({
      shippingDetails: shippingDetailsState,
    });
  };

  setCustomsDetails = (CustomsDetailsState) => {
    this.setState({
      customsDetails: CustomsDetailsState,
    });
  };

  handleSuccessResponse = () => {
    this.context.router.history.push("/");
    window.location.reload();
  };

  componentDidMount() {
    const { user } = this.props;
    let newCustomer = this.props.new_customer_form_data.newCustomer;
    if (user.accessToken && newCustomer.length === 0) {
      this.getNewCustomerData();
      this.getCustomerProfileCountries();
    }

    this.props.dispatch(
      customerActions.fetchCustomerInfo(
        user.accessToken,
        user.CustomerInfo.CustID,
      ),
    );
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { user, new_customer_form_data } = this.props;
    let newCustomer = new_customer_form_data.newCustomer;

    if (
      prevProps.submitting &&
      this.props.error &&
      !this.state.showErrorNotification
    ) {
      this.setState({ showErrorNotification: true });
      return;
    }

    if (user.accessToken !== prevProps.user.accessToken) {
      this.getNewCustomerData();
    }

    if (
      this.state.shippingDetails &&
      !_.isEmpty(this.state.shippingDetails.shippingAddresses) &&
      this.state.shippingDetails.shippingAddresses !==
        prevState.shippingDetails.shippingAddresses
    ) {
      if (this.isExport() > 0) {
        this.setState({
          accordionItems: [
            {
              name: "Account & Billing Information",
              component: Account.Component,
              form: "accountForm",
            },
            {
              name: "Pallet Program",
              component: PalletProgram.Component,
              form: "palletProgramForm",
            },
            {
              name: "Shipping Details",
              component: Shipping.Component,
              form: "shippingForm",
            },
            {
              name: "Customs Details",
              component: CustomsDetails.Component,
              form: "customsDetailsForm",
            },
            {
              name: "IT Information",
              component: ItInfor.Component,
              form: "itInforForm",
            },
            {
              name: "Application For Credit",
              component: CreditApp.Component,
              form: "CreditAppForm",
            },
          ],
        });
      } else {
        this.setState({
          accordionItems: [
            {
              name: "Account & Billing Information",
              component: Account.Component,
              form: "accountForm",
            },
            {
              name: "Pallet Program",
              component: PalletProgram.Component,
              form: "palletProgramForm",
            },
            {
              name: "Shipping Details",
              component: Shipping.Component,
              form: "shippingForm",
            },
            {
              name: "IT Information",
              component: ItInfor.Component,
              form: "itInforForm",
            },
            {
              name: "Application For Credit",
              component: CreditApp.Component,
              form: "CreditAppForm",
            },
          ],
        });
      }
    }

    if (!_.isEmpty(newCustomer) && !this.state.setSavedFormData) {
      this.setState({ saveForLaterState: "update" });

      if (newCustomer.accountForm) {
        let accountForm = newCustomer.accountForm;
        this.state.accountForm.setData(accountForm);
      }

      if (newCustomer.palletProgramForm) {
        let palletProgramForm = newCustomer.palletProgramForm;
        this.state.palletProgramForm.setData(palletProgramForm);
      }

      if (newCustomer.shippingFormData) {
        let shippingForm = newCustomer.shippingFormData.shippingForm;
        this.state.shippingForm.setData(shippingForm);
        let shippingDetails = newCustomer.shippingFormData.shippingDetails;
        this.setState({ shippingDetails: shippingDetails });
      }

      if (newCustomer.shippingFormData) {
        let customsForm = newCustomer.customsFormData.customsForm;
        this.state.customsDetailsForm.setData(customsForm);
        let customsDetails = newCustomer.customsFormData.customsDetails;
        this.setState({ customsDetails: customsDetails });
      }

      if (newCustomer.itInforFormData) {
        let itInformation = newCustomer.itInforFormData;
        this.state.itInforForm.setData(itInformation);
      }

      if (newCustomer.creditAppFormData) {
        let creditApplication = newCustomer.creditAppFormData;
        this.state.CreditAppForm.setData(creditApplication);
      }

      this.setState({
        setSavedFormData: true,
      });
    }

    if (prevProps.submitting && this.props.submitted) {
      this.setState({ showSuccessModal: true });
      this.deleteSavedCustomer();
      // this.handleSuccessResponse();
    }
  };

  getNewCustomerData = () => {
    const { user, dispatch } = this.props;
    dispatch(
      newCustomerActions.fetchNewCustomerData(
        user.accessToken,
        this.getNewCustomerKey(),
      ),
    );
  };

  getCustomerProfileCountries = () => {
    const { user, dispatch } = this.props;
    dispatch(newCustomerActions.getCountries(user.accessToken));
  };

  getCustomerProfileRegions = (countryCode) => {
    const { user } = this.props;

    return new Promise((resolve, reject) => {
      axios
        .get(
          `${config.customerProfileApiUrl}/v1/regions?countryCode=${countryCode}`,
          {
            headers: requestHeaders(user.accessToken),
          },
        )
        .then((res) => {
          resolve({
            data: res,
          });
        })
        .catch((error) => {
          reject();
        });
    });
  };

  getCustomerProfileCountries = () => {
    const { user, dispatch } = this.props;
    dispatch(newCustomerActions.getCountries(user.accessToken));
  };

  getExportCountries() {
    if (!_.isEmpty(this.state.shippingDetails.shippingAddresses)) {
      let exportCountries = this.state.shippingDetails.shippingAddresses.map(
        (address) => {
          if (address.form.siExport.value) {
            return address.form.siCountry.value.trim().toLowerCase();
          }
          return null;
        },
      );

      exportCountries = exportCountries.filter((el) => {
        return el != null;
      });

      exportCountries = [...new Set(exportCountries)];

      return exportCountries;
    }
    return [];
  }

  isExport() {
    let count = 0;
    if (
      this.state.shippingDetails &&
      this.state.shippingDetails.shippingAddresses
    ) {
      this.state.shippingDetails.shippingAddresses.forEach((element) => {
        if (element.form.siCountry.value.requiresBroker) count++;
      });
    }

    return count;
  }

  render() {
    let { loading } = this.props;

    // console.log("~~~~~~~~~~~~", this.state);

    return (
      <div>
        {/* Success message */}
        <ThankYouModal
          visible={this.state.showSuccessModal}
          closeModal={this.handleSuccessResponse}
          title="Request Submitted"
        >
          <p>New customer has been successfully submitted.</p>

          <div className="modal-btns">
            <button
              type="button"
              className="home-nav_btn"
              onClick={this.handleSuccessResponse}
            >
              Go To Dashboard
            </button>
          </div>
        </ThankYouModal>

        {/* error message */}
        <ThankYouModal
          visible={this.state.showErrorNotification}
          closeModal={() => {
            this.setState({ showErrorNotification: false });
          }}
          title="Warning: Request Error"
          isWarning={true}
        >
          <p className="place-order-page-info">
            New customer details were not submitted. Please resubmit your
            details.{" "}
          </p>
          <p className="place-order-page-info">
            If the submitting fails again, please contact:
            <a
              className="tw-text-blue-600 tw-block"
              href={`mailto:CustomerExperience@toscaltd.com?subject=${_.get(
                this.props.user,
                "CustomerInfo.CustName",
                "",
              )}:`}
            >
              CustomerExperience@toscaltd.com
            </a>
          </p>
          <div className="modal-btns">
            <button
              type="button"
              onClick={() => {
                this.setState({ showErrorNotification: false });
              }}
            >
              OK
            </button>
          </div>
        </ThankYouModal>

        <PageDisable
          disabled={this.props.submitting || this.props.saving}
          message={
            this.props.submitting
              ? "Submitting your request."
              : "Saving new customer, please wait"
          }
        />
        <ToastContainer position="bottom-right" hideProgressBar={true} />

        <div className="title-wrapper">
          <div className="logo-wrapper">
            <img src={logo} alt="tosca logo" />
          </div>

          <h4 className="tw-text-tosca-orange tw-py-5">
            New Customer Setup Form
          </h4>
        </div>

        <p className="tw-text-gray-600 tw-max-w-2xl">
          To help us serve you better, please fill out all the details. If you
          have any questions, please contact us at&nbsp;
          <a
            className="tw-text-tosca-orange"
            href={`mailto:CustomerExperience@toscaltd.com?subject=New Customer Setup`}
          >
            CustomerExperience@toscaltd.com
          </a>
        </p>

        <div className="tw-mt-8 tw-mb-20">
          <BreadCrumb
            navigateTo={this.navigateTo}
            activeIndex={this.state.itemIndex}
            components={this.state.accordionItems}
          />
        </div>

        {loading ? (
          <div
            className="loader-container"
            style={{ margin: "50px auto", width: "50px" }}
          >
            <Loader
              type="Oval"
              color="rgba(246,130,32,1)"
              height="50"
              width="50"
            />
          </div>
        ) : (
          <Accordion
            activeItemIndex={{
              value: this.state.itemIndex,
              sync: (val) => {
                this.setState({ itemIndex: val });
              },
            }}
          >
            {this.state.accordionItems.map((page, i) => (
              <AccordionItem
                key={i}
                header={page.name}
                shouldNavigate={this.shouldNavigate}
              >
                {(data) => (
                  <page.component
                    form={this.state[page.form]}
                    countries={this.props.countries}
                    onChangeCountry={(code) =>
                      this.getCustomerProfileRegions(code)
                    }
                    shippingDetailsForm={this.state.shippingForm}
                    navigateTo={data.navigateTo}
                    onSaveLater={this.onSaveLater}
                    getAddressValidation={(addressObj) =>
                      this.getAddressValidation(addressObj)
                    }
                    onSubmitForm={this.onSubmitForm}
                    setShippingDetails={this.setShippingDetails}
                    shippingDetailsState={this.state.shippingDetails}
                    setCustomsDetails={this.setCustomsDetails}
                    customsDetailsState={this.state.customsDetails}
                    isExport={this.isExport()}
                    activeItemIndex={this.state.itemIndex}
                  />
                )}
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    );
  }
}

const { object, bool } = PropTypes;

NewCustomerSetup.propTypes = {
  user: object,
  new_customer_form_data: object,
  loading: bool,
  submitting: bool,
  saving: bool,
};

const mapState = ({ session, newCustomer, customer }) => ({
  customerInfo: customer.customerInfo,
  user: session.user,
  new_customer_form_data: newCustomer,
  loading: newCustomer.fetching,
  submitting: newCustomer.submitting,
  submitted: newCustomer.submitted,
  error: newCustomer.error,
  saving: newCustomer.saving,
  countries: newCustomer.countries,
});

export default connect(mapState)(NewCustomerSetup);
