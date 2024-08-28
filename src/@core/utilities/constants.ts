export const PERMISSIONS = {
  CREATE_ADMIN: "create.admin",
  VIEW_ADMIN: "view.admin",
  UPDATE_ADMIN: "update.admin",
  DELETE_ADMIN: "delete.admin",
  CREATE_USER: "create.user",
  VIEW_USER: "view.user",
  UPDATE_USER: "update.user",
  DELETE_USER: "delete.user",
  VIEW_PERMISSIONS: "view.permissions",
  CREATE_PERMISSIONS: "create.permissions",
  DELETE_PERMISSIONS: "delete.permissions",
  CREATE_ROLE: "create.role",
  VIEW_ROLE: "view.role",
  UPDATE_ROLE: "update.role",
  DELETE_ROLE: "delete.role",
  CREATE_JOB: "create.job",
  VIEW_JOB: "view.job",
  UPDATE_JOB: "update.job",
  DELETE_JOB: "delete.job",
  VIEW_CATEGORY: "view.category",
  UPDATE_CATEGORY: "update.category",
  DELETE_CATEGORY: "delete.category",
  CREATE_CATEGORY: "create.category",
  VIEW_INVOICE: "view.invoice",
  UPDATE_INVOICE: "update.invoice",
  DELETE_INVOICE: "delete.invoice",
  CREATE_INVOICE: "create.invoice",
  VIEW_PAYMENT: 'view.payment',
  UPDATE_PAYMENT: 'update.payment',
  DELETE_PAYMENT: 'delete.payment',
  CREATE_PAYMENT: 'create.payment'
};

export const PENDING = 'PENDING'
export const SUBMITTED = "SUBMITTED";
export const ACCEPTED = "ACCEPTED";
export const IN_PROGRESS = 'IN_PROGRESS'
export const CLOSED = "CLOSED";
export const APPROVED = 'APPROVED'



export const redirectUrl = "/auth";
export const FREELANCER = "freelancer";
export const CLIENT = "client";

export const IMAGE_EX = ["jpg", "jpeg", "bmp", "gif", "png"];
export const PDF_EX = ["pdf"];
export const EXCEL_EX = ["xls", "xlsx"];
export const POWERPOINT_EX = ["ppt", "pptx"];
export const DOCX_EX = ["doc", "docx", "odt","txt","rtd"];
export const VIDEO_EX = ["mp4", "mov", "wmv", "webm"];
export const ALLOWED_EX = [
  ...IMAGE_EX,
  ...PDF_EX,
  ...EXCEL_EX,
  ...DOCX_EX,
  ...VIDEO_EX,
  ...POWERPOINT_EX
];
