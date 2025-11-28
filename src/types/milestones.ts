import { ImageSourcePropType } from "react-native";

export interface MilestoneApiRes<T> {
  status?: string;
  status_code: number;
  message?: string;
  data: T;
}

export interface Category {
  value: string;
  label: string;
}

export interface CategoriesData {
  categories: Category[];
}

// export interface MilestoneCategory {
//   id: string;
//   owner_id: string;
//   owner_type: string;
//   name: string;
//   description: string | null;
//   created_at: string;
//   updated_at: string;
//   stats: MilestoneStats;
// }

export interface MilestoneStats {
  pending_milestones: number;
  completed_milestones: number;
}

export type MilestoneType = "mother" | "child";

export type CategoriesType = {
  id: number;
  title: string;
  desc: string;
  value: number;
  icon: ImageSourcePropType;
};

export interface CreateMilestoneType {
  name: string;
  description: string | null;
  category: string;
  child_id?: string;
}

export type EditMilestoneType = Partial<Omit<CreateMilestoneType, "child_id">>;

export type ToggleMilestonePayload = {
  completed: boolean;
  child_id?: string;
};

export interface MilestoneDataType {
  id: string;
  owner_id: string;
  owner_type: string;
  name: string;
  description: string;
  status: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface MilestoneDataDetails {
  details: MilestoneDataType[];
}

export interface ChildrenDataType {
  children: Children[];
  total: number;
}

export interface Children {
  id: string;
  profile_setup_id: string;
  full_name: string;
  date_of_birth: string;
  due_date: string;
  gender: string;
  birth_order: number;
  profile_picture_url: string;
  age: number;
  created_at: string;
  updated_at: string;
}
