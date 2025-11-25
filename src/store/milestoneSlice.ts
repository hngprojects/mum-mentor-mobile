import { RootState } from "@/src/store/store";
import { initialStateTypes } from "@/src/store/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: initialStateTypes = {
  isCreateFormOpen: false,
  isDeleteModalOpen: false,
  isSuccessModalOpen: false,
  isEditModalOpen: false,
  milestoneToDelId: "",
  milestoneToEditId: "",
};

export const milestoneSlice = createSlice({
  name: "milestone",
  initialState,
  reducers: {
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
  onToggleCreateForm,
  onToggleDeleteModal,
  onToggleEditForm,
  onToggleSuccessModal,
} = milestoneSlice.actions;

export const getMilestoneStates = (state: RootState) => state.milestone;

export default milestoneSlice.reducer;
