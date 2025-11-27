import { RootState } from "@/src/store/store";
import { initialStateTypes } from "@/src/store/types";
import { MilestoneDataType } from "@/src/types/milestones";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: initialStateTypes = {
  isCreateFormOpen: false,
  isDeleteModalOpen: false,
  isSuccessModalOpen: false,
  isEditSuccessModalOpen: false,

  isEditModalOpen: false,
  milestoneToDelId: "",
  milestoneToEditId: "",
  milestoneData: [],
};

export const milestoneSlice = createSlice({
  name: "milestone",
  initialState,
  reducers: {
    onAddMilestoneOnMount(state, action: PayloadAction<MilestoneDataType[]>) {
      state.milestoneData = action.payload;
    },

    onAddMilestone(state, action: PayloadAction<MilestoneDataType>) {
      state.milestoneData = [action.payload, ...state.milestoneData];
    },

    onDeleteMilestone(state) {
      state.milestoneData = state.milestoneData.filter(
        (milestone) => milestone.id !== state.milestoneToDelId
      );
    },

    onEditMileStone(
      state,
      action: PayloadAction<{
        name: string;
        description: string;
        updated_at: string;
      }>
    ) {
      const { name, description, updated_at } = action?.payload;
      state.milestoneData = state.milestoneData.map((milestone) =>
        milestone.id === state.milestoneToEditId
          ? { ...milestone, name, description, updated_at }
          : milestone
      );
    },

    onCheckMilestoneStatus(state, action: PayloadAction<{ id: string }>) {
      state.milestoneData = state.milestoneData.map((milestone) =>
        milestone.id === action.payload.id
          ? {
              ...milestone,
              status: milestone.status === "pending" ? "completed" : "pending",
            }
          : milestone
      );
    },

    onToggleEditSuccessModal(state, action: PayloadAction<boolean>) {
      state.isEditSuccessModalOpen = action.payload;
    },
    onToggleSuccessModal(state, action: PayloadAction<boolean>) {
      state.isSuccessModalOpen = action.payload;
    },
    onToggleCreateForm(state, action: PayloadAction<boolean>) {
      state.isCreateFormOpen = action.payload;
    },

    onToggleEditForm(
      state,
      action: PayloadAction<{ isOpenForm: boolean; milestoneId?: string }>
    ) {
      const { isOpenForm, milestoneId } = action.payload;

      if (isOpenForm && milestoneId) {
        state.isEditModalOpen = isOpenForm;
        state.milestoneToEditId = milestoneId;
      } else {
        state.isEditModalOpen = isOpenForm;
        state.milestoneToEditId = "";
      }
    },

    onToggleDeleteModal(
      state,
      action: PayloadAction<{ isOpenForm: boolean; milestoneId?: string }>
    ) {
      const { isOpenForm, milestoneId } = action.payload;

      if (isOpenForm && milestoneId) {
        state.isDeleteModalOpen = isOpenForm;
        state.milestoneToDelId = milestoneId;
      } else {
        state.isDeleteModalOpen = isOpenForm;
        state.milestoneToDelId = "";
      }
    },
  },
});

export const {
  onAddMilestoneOnMount,
  onAddMilestone,
  onCheckMilestoneStatus,
  onDeleteMilestone,
  onEditMileStone,
  onToggleCreateForm,
  onToggleDeleteModal,
  onToggleEditForm,
  onToggleSuccessModal,
  onToggleEditSuccessModal,
} = milestoneSlice.actions;

export const getMilestoneStates = (state: RootState) => state.milestone;

export default milestoneSlice.reducer;
