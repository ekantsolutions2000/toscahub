const userInfo = [
  {
    title: "First Name",
    id: "firstName",
    type: "text",
    required: true,
  },
  {
    title: "Middle Name",
    id: "middleName",
    type: "text",
    required: false,
  },
  {
    title: "Last Name",
    id: "lastName",
    type: "text",
    required: true,
  },
  {
    title: "Requested User ID",
    id: "reqUserId",
    type: "text",
    required: true,
  },
  {
    title: "Password",
    id: "password",
    type: "password",
    required: true,
  },
  {
    title: "Re-type password",
    id: "confirmPass",
    type: "password",
    required: true,
  },
  {
    title: "Email",
    id: "email",
    type: "email",
    required: true,
  },
  {
    title: "Phone",
    id: "phone",
    type: "tel",
    required: true,
  },
];

const orgInfo = [
  {
    title: "Organization",
    id: "orgName",
    type: "text",
    required: true,
  },
  {
    title: "Location Name",
    id: "locName",
    type: "text",
    required: false,
  },
  {
    title: "Street Address",
    id: "streetAddress",
    type: "text",
    required: false,
  },
  {
    title: "Street Address (cont.)",
    id: "streetAddress2",
    type: "text",
    required: false,
  },
  {
    title: "City",
    id: "city",
    type: "text",
    required: false,
  },
  {
    title: "State",
    id: "state",
    type: "text",
    required: false,
  },
  {
    title: "Zip",
    id: "zip",
    type: "zip",
    required: false,
  },
  {
    title: "Country",
    id: "country",
    type: "text",
    required: false,
  },
];

export { userInfo, orgInfo };
