import apiClient from "@/src/core/services/apiClient";
import { logErrorInDevMode } from "@/src/core/utils/logErrorInDevMode";
import {
  CategoriesData,
  CreateMilestoneType,
  MilestoneApiRes,
  MilestoneDataDetails,
  MilestoneDataType,
} from "@/src/types/milestones";
import { isAxiosError } from "axios";

export async function getMilestonesByCategory(
  category?: string,
  childId?: string
): Promise<MilestoneDataType[]> {
  try {
    const res = await apiClient.get<MilestoneApiRes<MilestoneDataDetails>>(
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
//     const res = await apiClient.get("/api/v1/milestones/", {
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
    const res = await apiClient.post<string>("/api/v1/milestones/", payload);

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
  const res = await apiClient.get<MilestoneApiRes<CategoriesData>>(
    "/api/v1/milestones/categories",
    {
      params: {
        child_id: childId,
      },
    }
  );

  return res.data.data;
}
