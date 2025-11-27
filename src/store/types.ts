import { MILESTONE_DATA } from "@/src/core/data/milestone-data";

export type MilestoneDataType = typeof MILESTONE_DATA;

export interface initialStateTypes {
  isCreateFormOpen: boolean;
  isDeleteModalOpen: boolean;
  isSuccessModalOpen: boolean;
  isEditModalOpen: boolean;
  milestoneToDelId: string;
  milestoneToEditId: string;
  milestoneData: MilestoneDataType;
  isEditSuccessModalOpen: boolean;
}

export type Milestone = {
  id: string;
  title: string;
  desc: string;
  status: string;
};
