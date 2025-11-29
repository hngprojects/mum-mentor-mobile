import {logErrorInDevMode} from "@/src/core/utils/logErrorInDevMode";
import {
    CategoriesData,
    ChildrenDataType,
    CreateMilestoneType,
    EditMilestoneType,
    MilestoneApiRes,
    MilestoneDataDetails,
    MilestoneDataType,
    ToggleMilestonePayload,
} from "@/src/types/milestones";
import {isAxiosError} from "axios";
import {authApi} from "@/src/lib/api";

export async function getChildProfiles(): Promise<ChildrenDataType> {
  try {
      const res = await authApi.get<MilestoneApiRes<ChildrenDataType>>(
      "/api/v1/child-profiles/"
    );

    return res.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorInDevMode(error.message);
      throw new Error("Something went wrong getting children profiles");
    }
    throw new Error("Something went wrong");
  }
}

export async function getMilestoneProgress(childId?: string) {
  try {
      const res = await authApi.get("/api/v1/milestones/progress", {
      params: {
        child_id: childId,
      },
    });

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorInDevMode(error.message);
      throw new Error("Something went wrong trying to get milestone progress");
    }
    throw new Error("Something went wrong");
  }
}

export async function getPendingMilestones(
  childId?: string
): Promise<MilestoneDataType[]> {
  try {
      const res = await authApi.get<MilestoneApiRes<MilestoneDataDetails>>(
      `/api/v1/milestones/pending`,
      {
        params: {
          child_id: childId,
        },
      }
    );

    console.log(res.data.data, "yress");

    return res.data.data.details;
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorInDevMode(error.message);

      throw new Error("Something went wrong getting pending milestoneSlice");
    }

    throw new Error("Something went wrong");
  }
}

export async function toggleMilestoneStatusAction(
  milestoneId: string,
  payload: ToggleMilestonePayload
) {
  console.log(payload, "payload");
  try {
      const res = await authApi.patch(
      `/api/v1/milestones/${milestoneId}/status`,
      payload
    );

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorInDevMode(error.message);

      throw new Error("Something went wrong toggling milestone status");
    }

    throw new Error("Something went wrong");
  }
}

export async function deleteMilestoneAction(milestoneId: string) {
  try {
      const res = await authApi.delete(`/api/v1/milestones/${milestoneId}`);

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorInDevMode(error.message);
      throw new Error("Something went wrong delete this milestone");
    }

    throw new Error("Something went wrong");
  }
}

export async function editMilestone(
  milestoneId: string,
  payload: EditMilestoneType
): Promise<MilestoneDataType> {
  try {
      const res = await authApi.put<MilestoneApiRes<MilestoneDataType>>(
      `/api/v1/milestones/${milestoneId}`,
      payload
    );

    return res.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorInDevMode(error.message);

      throw new Error("Something went wrong editing milestone");
    }

    throw new Error("Something went wrong");
  }
}

export async function getMilestonesByCategory(
  category?: string,
  childId?: string
): Promise<MilestoneDataType[]> {
  try {
      const res = await authApi.get<MilestoneApiRes<MilestoneDataDetails>>(
      "/api/v1/milestones/",
      {
        params: {
          child_id: childId,
          category,
        },
      }
    );

    return res.data.data.details;
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorInDevMode(error.message);
      throw new Error(
        "Something went wrong fetching milestones for the category!"
      );
    }

    throw new Error("Something went wrong");
  }
}

// export async function getMilestones(
//   category?: string,
//   childId?: string
// ): Promise<MilestoneDataType | null> {
//   try {
//     const res = await authApi.get("/api/v1/milestones/", {
//       params: {
//         child_id: childId,
//         category: category,
//       },
//     });
//     return res.data.data?.details;
//   } catch (error) {
//     if (isAxiosError(error)) {
//       throw new Error(error.message);
//     }

//     return null;
//   }
// }

export async function createMilestone(
  payload: CreateMilestoneType
): Promise<string | null> {
  try {
      const res = await authApi.post<string>("/api/v1/milestones/", payload);

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorInDevMode(error.message);
      throw new Error("Something went wrong while trying to create milestone!");
    }

    throw new Error("Something went wrong!");
  }
}

export async function getMilestoneCategories(
  childId?: string
): Promise<CategoriesData> {
    const res = await authApi.get<MilestoneApiRes<CategoriesData>>(
    "/api/v1/milestones/categories",
    {
      params: {
        child_id: childId,
      },
    }
  );

  return res.data.data;
}
