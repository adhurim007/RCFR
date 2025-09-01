export interface MenuDto {
  id: number;
  parentId?: number | null;
  title: string;
  subtitle?: string | null;
  type?: string | null;        // "basic", "group", "collapsable"
  link?: string | null;        // e.g. "/cars/list"
  icon?: string | null;
  hasSubMenu?: boolean;
  claim?: string | null;
  active: boolean;
  sortNumber: number;

  createdBy?: string | null;
  createdOn?: string;
  lastModifiedBy?: string | null;
  lastModifiedOn?: string | null;
  deletedBy?: string | null;
  deletedOn?: string | null;
}
