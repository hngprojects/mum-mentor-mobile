import { initialStateTypes } from "@/src/store/types";
import { MilestoneDataType } from "@/src/types/milestones";
import { create } from "zustand";

interface EditMilestonePayloadType {
  name: string;
  description: string;
  updated_at: string;
}

interface ToggleFormPayload {
  isOpenForm: boolean;
  milestoneId?: string;
}

interface MilestoneStates extends initialStateTypes {
  onAddMilestoneOnMount: (milestones: MilestoneDataType[]) => void;
  onAddMilestone: (milestone: MilestoneDataType) => void;
  onDeleteMilestone: () => void;
  onEditMileStone: (editPayload: EditMilestonePayloadType) => void;
  onCheckMilestoneStatus: (statusPayload: { id: string }) => void;
  onToggleEditSuccessModal: (togglePayload: boolean) => void;
  onToggleSuccessModal: (togglePayload: boolean) => void;
  onToggleCreateForm: (togglePayload: boolean) => void;
  onToggleEditForm: (togglePaylod: ToggleFormPayload) => void;
  onToggleDeleteModal: (togglePaylod: ToggleFormPayload) => void;
}

export const useMilestoneStore = create<MilestoneStates>((set) => ({
  isCreateFormOpen: false,
  isDeleteModalOpen: false,
  isSuccessModalOpen: false,
  isEditSuccessModalOpen: false,
  isEditModalOpen: false,
  milestoneToDelId: "",
  milestoneToEditId: "",
  milestoneData: [],

  onAddMilestoneOnMount: (milestones) =>
    set((s) => ({ milestoneData: milestones })),
  onAddMilestone: (milestone) =>
    set((s) => ({ milestoneData: [milestone, ...s.milestoneData] })),
  onDeleteMilestone: () =>
    set((s) => ({
      milestoneData: s.milestoneData.filter(
        (milestone) => milestone.id !== s.milestoneToDelId
      ),
    })),
  onEditMileStone: (editPayload) =>
    set((s) => ({
      milestoneData: s.milestoneData.map((milestone) =>
        milestone.id === s.milestoneToEditId
          ? { ...milestone, ...editPayload }
          : milestone
      ),
    })),

  onCheckMilestoneStatus: (statusPayload) =>
    set((s) => ({
      milestoneData: s.milestoneData.map((milestone) =>
        milestone.id === statusPayload.id
          ? {
              ...milestone,
              status: milestone.status === "pending" ? "completed" : "pending",
            }
          : milestone
      ),
    })),

  onToggleEditSuccessModal: (togglePayload) =>
    set((s) => ({ isEditSuccessModalOpen: togglePayload })),

  onToggleSuccessModal: (togglePayload) =>
    set((s) => ({ isSuccessModalOpen: togglePayload })),

  onToggleCreateForm: (togglePayload) =>
    set((s) => ({ isCreateFormOpen: togglePayload })),

  onToggleEditForm: (togglePayload) =>
    set((s) => toggleEditFormReducer(togglePayload, s)),

  onToggleDeleteModal: (togglePayload) =>
    set((s) => toggleDeleteFormReducer(togglePayload, s)),
}));

function toggleEditFormReducer(
  togglePayload: ToggleFormPayload,
  state: MilestoneStates
) {
  const { isOpenForm, milestoneId } = togglePayload;

  if (isOpenForm && milestoneId) {
    return { isEditModalOpen: isOpenForm, milestoneToEditId: milestoneId };
  } else {
    return { isEditModalOpen: isOpenForm, milestoneToEditId: "" };
  }
}

function toggleDeleteFormReducer(
  togglePayload: ToggleFormPayload,
  state: MilestoneStates
) {
  const { isOpenForm, milestoneId } = togglePayload;

  if (isOpenForm && milestoneId) {
    return { isDeleteModalOpen: isOpenForm, milestoneToDelId: milestoneId };
  } else {
    return { isDeleteModalOpen: isOpenForm, milestoneToDelId: "" };
  }
}
