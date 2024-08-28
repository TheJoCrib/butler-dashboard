// import { CoreMenu } from '@core/types'

import { PERMISSIONS } from "@core/utilities/constants";

// prettier-ignore
export interface CoreMenuItem {
    id: string;
    title: string;
    url?: string;
    permission?:string;
    type: 'section' | 'collapsible' | 'item';
    role?: Array<string>;
    translate?: string;
    icon?: string;
    disabled?: boolean;
    hidden?: boolean;
    classes?: string;
    exactMatch?: boolean;
    externalUrl?: boolean;
    openInNewTab?: boolean;
    badge?: {
        title?: string;
        translate?: string;
        classes?: string;
    };
    children?: CoreMenuItem[];
}

export interface CoreMenu extends CoreMenuItem {
  children?: CoreMenuItem[];
}

export const menu: CoreMenu[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    type: "item",
    icon: "home",
    url: "admin/dashboard",
  },

  {
    id: "freelancers",
    type: "item",
    title: "Designers",
    icon: "user",
    url: "admin/freelancers",
    permission: PERMISSIONS.VIEW_USER,
  },
  {
    id: "freelancers_requests",
    type: "item",
    title: "Designer Requests",
    icon: "mail",
    url: "admin/freelancer_requests",
    permission: PERMISSIONS.VIEW_USER,
  },
  {
    id: "orders",
    type: "item",
    title: "Jobs",
    url: "admin/jobs",
    permission: PERMISSIONS.VIEW_JOB,
    icon: "calendar",
  },
  {
    id: "clients",
    type: "item",
    title: "Clients",
    icon: "user",
    url: "admin/clients",
    permission: PERMISSIONS.VIEW_USER,
  },
    {
        id: "reviews",
        type: "item",
        title: "Reviews",
        icon: "flag",
        url: "admin/reviews",
        permission: PERMISSIONS.VIEW_USER,
    },

  {
    id: "chats",
    type: "item",
    title: "Chats",
    icon: "message-square",
    url: "admin/chats",
    permission: PERMISSIONS.VIEW_USER,
  },
  {
    id: "invoices",
    type: "item",
    title: "Invoices",
    icon: "file",
    url: "admin/invoices",
    permission: PERMISSIONS.VIEW_INVOICE,
  },
  {
    id: "payments",
    type: "item",
    title: "Payments",
    icon: "dollar-sign",
    url: "admin/payments",
    permission: PERMISSIONS.VIEW_PAYMENT,
  },
  {
    id: "control-panel",
    type: "collapsible",
    title: "Control Panel",
    icon: "menu",
    children: [
      {
        id: "roles",
        title: "Roles",
        type: "item",
        permission: PERMISSIONS.VIEW_ROLE,
        icon: "circle",
        url: "admin/control-panel/role-management",
      },
      {
        id: "admin-management",
        title: "Admin Management",
        type: "item",
        permission: PERMISSIONS.VIEW_ADMIN,
        icon: "circle",
        url: "admin/control-panel/admin-management",
      },
     /* {
        id: "category-management",
        title: "Category Management",
        type: "item",
        permission: PERMISSIONS.VIEW_CATEGORY,
        icon: "circle",
        url: "admin/control-panel/category-management",
      },*/
    ],
  },
];
