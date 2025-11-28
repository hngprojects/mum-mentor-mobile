import { MilestoneDataType } from "@/src/types/milestones";

// export type MilestoneDataType = typeof MILESTONE_DATA;

export interface initialStateTypes {
  isCreateFormOpen: boolean;
  isDeleteModalOpen: boolean;
  isSuccessModalOpen: boolean;
  isEditModalOpen: boolean;
  milestoneToDelId: string;
  milestoneToEditId: string;
  milestoneData: MilestoneDataType[];
  isEditSuccessModalOpen: boolean;
}

export type Milestone = {
  id: string;
  name: string;
  description: string;
  status: string;
};

export type CategoryInfo = {
  title: string;
  desc: string;
  icon: any;
};
