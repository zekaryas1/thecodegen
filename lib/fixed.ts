/**
 * Constant values that are fixed and do not change.
 */
import { DataTableProps } from "primereact/datatable";

// load environment variables to be used in browser
export const PROJECT_NAME =
  process.env.NEXT_PUBLIC_PROJECT_NAME || "The Codegen";
export const PROJECT_DESCRIPTION_MAX_LENGTH = parseInt(
  process.env.NEXT_PUBLIC_PROJECT_DESCRIPTION_MAX_LENGTH || "80"
);
export const REQUEST_REFRESH_INTERVAL = parseInt(
  process.env.NEXT_PUBLIC_REQUEST_REFRESH_INTERVAL || "1000"
);

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
  { name: "Foreign Key", code: "fk" },
];

export const MARKDOWN_INDICATOR = '[//]: # "markdown"';

// language=txt
export const DEFAULT_TEMPLATE = `[//]: # "markdown"

## How to start
- First select and an entity from the dropdown above
    - then click \`Regenerate\` button
- To write a markdown start your template with
    - \`[//]: # "markdown"\` just like this template
- To write a template code
    - you have to follow [liquid syntax](https://shopify.github.io/liquid/)
    - here is an output of template code example

\`\`\`
Entity = {{ name | upcase }}

{%- for column in columns %}
    columnName = {{ column.name }}
    no of constraints = {{ column.constraint.size }}
    ----
{% endfor %}
\`\`\`
*if you see an empty code block it means you haven't selected an entity*

> btw, you can also write markdown and templates together(wip)
`;

export const GLOBAL_STYLES = {
  forTable: "shadow-2xl",
  forDialog: {
    width: "40vw",
  },
  forLinearGradient: {
    background: "linear-gradient(0deg, #0d0c0c 0%, #1c1d1a 100%)",
  },
  forHeaderPattern: {
    background: `radial-gradient(35.36% 35.36% at 100% 25%,#0000 66%,#0f0d0d 68% 70%,#0000 72%) 32px 32px/calc(2*32px) calc(2*32px),
    radial-gradient(35.36% 35.36% at 0    75%,#0000 66%,#0f0d0d 68% 70%,#0000 72%) 32px 32px/calc(2*32px) calc(2*32px),
    radial-gradient(35.36% 35.36% at 100% 25%,#0000 66%,#0f0d0d 68% 70%,#0000 72%) 0 0/calc(2*32px) calc(2*32px),
    radial-gradient(35.36% 35.36% at 0    75%,#0000 66%,#0f0d0d 68% 70%,#0000 72%) 0 0/calc(2*32px) calc(2*32px),
    repeating-conic-gradient(rgba(18, 18, 18, 0) 0 25%,#0000 0 50%) 0 0/calc(2*32px) calc(2*32px),
    radial-gradient(#0000 66%,#0f0d0d 68% 70%,#0000 72%) 0 calc(32px/2)/32px 32px
    rgba(18, 18, 18, 0)`,
  },
};

export const TABLE_PROPS: DataTableProps = {
  className: GLOBAL_STYLES.forTable,
  rowHover: true,
  showGridlines: true,
  responsiveLayout: "scroll",
  paginator: true,
  stripedRows: true,
  rows: 5,
  rowsPerPageOptions: [5, 10, 25, 50],
};

export const DIALOG_PROPS: Record<string, any> = {
  maximizable: true,
  modal: true,
  style: GLOBAL_STYLES.forDialog,
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
  fromProject: [
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

export const RECENT_PROJECTS_STORAGE_KEY = "recentProjects";

export const MAX_NO_OF_RECENT_PROJECTS = 7;

export const FLOW_KEY = "flow_key";
