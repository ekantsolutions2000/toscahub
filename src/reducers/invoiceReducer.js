export default function reducer(
  state = {
    invoices: [],
    atcURL: {
      Result: false,
      Value: "",
    },
    fetching: false,
    fetched: false,
    fetchingATC: false,
    fetchedATC: false,
    error: null,
  },
  action,
) {
  switch (action.type) {
    case "FETCH_INVOICES_PENDING": {
      return {
        ...state,
        fetching: true,
        fetched: false,
        error: null,
      };
    }
    case "FETCH_INVOICES_REJECTED": {
      return {
        ...state,
        fetching: false,
        fetched: false,
        error: action.payload,
      };
    }
    case "FETCH_INVOICES_FULFILLED": {
      return {
        ...state,
        fetching: false,
        fetched: true,
        invoices: transformInvoices(action.payload.data),
      };
    }
    case "FETCH_ATC_PENDING": {
      return {
        ...state,
        fetchingATC: true,
      };
    }
    case "FETCH_ATC_REJECTED": {
      return {
        ...state,
        fetchingATC: false,
        fetchedATC: false,
        error: action.payload,
      };
    }
    case "FETCH_ATC_FULFILLED": {
      return {
        ...state,
        fetchingATC: false,
        fetchedATC: true,
        atcURL: action.payload.data,
      };
    }
    case "REMOVE_ATC_LINK": {
      return {
        ...state,
        invoices: [],
        atcURL: {
          Result: false,
          Value: "",
        },
      };
    }
    default: {
      return { ...state };
    }
  }
}

function transformInvoices(invoices) {
  let result = [];
  let invoiceIds = [...new Set(invoices.map((invoice) => invoice.invoice))];

  invoiceIds.forEach((invoiceId) => {
    let invoice = invoices
      .filter((invoice) => invoice.invoice === invoiceId)
      .slice()
      .sort((a, b) => b.ageAmount - a.ageAmount)[0];
    if (invoice.ageAmount === 0) {
      invoice.aging = "0 Days";
    }
    result.push(invoice);
  });

  return result.sort((a, b) => (a.invoiceDate > b.invoiceDate ? -1 : 1));
}
