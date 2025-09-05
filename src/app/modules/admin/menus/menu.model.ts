export interface MenuDto {
  id: number;
  parentId?: number | null;
  title: string;
  subtitle?: string | null;
  type?: 'basic' | 'group' | 'collapsable' | null;
  link?: string | null;     
  icon?: string | null;
  hasSubMenu?: boolean;
  active: boolean;
  sortNumber: number;
 
  permission?: string | null;   
 
  createdBy?: string | null;
  createdOn?: string;
  lastModifiedBy?: string | null;
  lastModifiedOn?: string | null;
  deletedBy?: string | null;
  deletedOn?: string | null;
}
