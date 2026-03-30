import { BaseModel } from '@/shared/models/base-model';

export interface ProductCategory extends BaseModel {
  id?: string;
  name: string;
  parentId?: string | null;
  description?: string;
}
