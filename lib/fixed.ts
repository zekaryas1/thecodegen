import { DataTableProps } from "primereact/datatable";

export const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-700",
  rejected: "text-red-700",
  accepted: "text-green-700",
};

export const DATA_TYPES = [
  { name: "String", code: "string" },
  { name: "Number", code: "number" },
  { name: "Boolean", code: "boolean" },
  { name: "Date", code: "date" },
  { name: "Array", code: "array" },
];

// language=txt
export const DEFAULT_TEMPLATE = `<!-- you can start coding now -->
<!-- visit https://shopify.github.io/liquid/ to get started -->

{{ name | upcase }}

{%- for column in columns %}
    columnName = {{ column.name }}
    no of constraints = {{ column.constraint.size }}
    ----
{% endfor %}
`;

export const TABLE_CLASSNAMES =
  "shadow-1 border-1 px-4 pt-4 surface-card border-round border-200";

export const TABLE_PROPS: DataTableProps = {
  className: TABLE_CLASSNAMES,
  rowHover: true,
  responsiveLayout: "scroll",
  paginator: true,
  stripedRows: false,
  rows: 5,
  rowsPerPageOptions: [5, 10, 25, 50],
};

export const DIALOG_STYLES = {
  width: "40vw",
};

export const DIALOG_PROPS: Record<string, any> = {
  maximizable: true,
  modal: true,
  style: DIALOG_STYLES,
};

export const DESTINATIONS = {
  fromDashboard: [
    {
      label: "entities",
      icon: "pi pi-fw pi-database",
    },
    {
      label: "codes",
      icon: "pi pi-fw pi-code",
    },
    {
      label: "members",
      icon: "pi pi-fw pi-users",
    },
  ],
  fromPrject: [
    {
      label: "Go to Invitations",
      icon: "pi pi-envelope",
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
    },
  ],
  fromLandingPage: [
    {
      label: "About",
      url: "#About",
    },
    {
      label: "Reason",
      url: "/#Reason",
    },
    {
      label: "Collaboration",
      url: "#Collaboration",
    },
    {
      label: "Github",
      url: "https://github.com/codegen-io/codegen",
    },
  ],
};


export const PROJECT_NAME = "Codegen";