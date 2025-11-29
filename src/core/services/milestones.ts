import {authApi} from "@/src/lib/api";

const MILESTONES_ENDPOINT = "/api/v1/milestones";

export async function createMilestones({
  name,
  description,
  category,
  child_id,
}: {
  name: string;
  description?: string;
  category: string;
  child_id?: string;
}) {
  const body: any = { name, category };

  if (description) body.description = description;
  if (child_id) body.child_id = child_id;

    const response = await authApi.post(`${MILESTONES_ENDPOINT}`, body);

  if (response.status >= 200 && response.status < 300) return response.data;
  throw new Error(response.data?.message || "Failed to create milestone");
}

/* -------------------------------------------------------------------------- */
/*                           GET ALL MILESTONES                               */
/* -------------------------------------------------------------------------- */
export async function getAllMilestones({
  category,
  child_id,
}: {
  category?: string;
  child_id?: string;
}) {
  const params = new URLSearchParams();

  if (child_id) params.append("child_id", child_id);
  if (category) params.append("category", category);

    const response = await authApi.get(
    `${MILESTONES_ENDPOINT}?${params.toString()}`
  );

  if (response.status >= 200 && response.status < 300) return response.data;
  throw new Error(response.data?.message || "Failed to get milestones");
}

/* -------------------------------------------------------------------------- */
/*                        GET MILESTONES BY CATEGORY                          */
/* -------------------------------------------------------------------------- */
export async function getMilestonesByCategory({
  category_id,
  milestone_status,
  child_id,
  page,
  limit,
}: {
  category_id: string;
  milestone_status: "pending" | "completed";
  child_id?: string;
  page?: number;
  limit?: number;
}) {
  let url = `${MILESTONES_ENDPOINT}/categories/${category_id}?milestone_status=${milestone_status}`;

  if (child_id) url += `&child_id=${child_id}`;
  if (page) url += `&page=${page}`;
  if (limit) url += `&limit=${limit}`;

    const response = await authApi.get(url);

  if (response.status >= 200 && response.status < 300) {
    return response.data;
  } else {
    throw new Error(
      response.data?.message || "Failed to get milestones by category"
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                         TOGGLE MILESTONE STATUS                            */
/* -------------------------------------------------------------------------- */
export async function toggleMilestoneStatus({
  milestone_id,
  completed,
  child_id,
}: {
  milestone_id: string;
  completed: boolean;
  child_id?: string;
}) {
  const body: any = { completed };
  if (child_id) body.child_id = child_id;

    const response = await authApi.patch(
    `${MILESTONES_ENDPOINT}/${milestone_id}/status`,
    body
  );

  if (response.status >= 200 && response.status < 300) return response.data;
  throw new Error(
    response.data?.message || "Failed to update milestone status"
  );
}

/* -------------------------------------------------------------------------- */
/*                             UPDATE MILESTONE                               */
/* -------------------------------------------------------------------------- */
export async function updateMilestone({
  milestone_id,
  name,
  description,
  category,
}: {
  milestone_id: string;
  name?: string;
  description?: string;
  category?: string;
}) {
  const body: any = {};
  if (name) body.name = name;
  if (description) body.description = description;
  if (category) body.category = category;

    const response = await authApi.put(
    `${MILESTONES_ENDPOINT}/${milestone_id}`,
    body
  );

  if (response.status >= 200 && response.status < 300) return response.data;
  throw new Error(response.data?.message || "Failed to update milestone");
}

/* -------------------------------------------------------------------------- */
/*                             DELETE MILESTONE                               */
/* -------------------------------------------------------------------------- */
export async function deleteMilestone(milestone_id: string) {
    const response = await authApi.delete(
    `${MILESTONES_ENDPOINT}/${milestone_id}`
  );

  if (response.status >= 200 && response.status < 300) return response.data;
  throw new Error(response.data?.message || "Failed to delete milestone");
}

export async function getMilestonesSummary({
  child_id,
  duration,
}: {
  child_id?: string;
  duration?: "day" | "week" | "month" | "year";
}) {
  let url = `${MILESTONES_ENDPOINT}/summary`;

  const query: string[] = [];
  if (child_id) query.push(`child_id=${child_id}`);
  if (duration) query.push(`duration=${duration}`);

  if (query.length > 0) url += `?${query.join("&")}`;

    const response = await authApi.get(url);

  if (response.status >= 200 && response.status < 300) {
    return response.data;
  } else {
    throw new Error(
      response.data?.message || "Failed to get milestone summary"
    );
  }
}

export async function getPendingMilestones({
  child_id,
}: {
  child_id?: string;
}) {
  let url = `${MILESTONES_ENDPOINT}/pending`;

  if (child_id) {
    url += `?child_id=${child_id}`;
  }

    const response = await authApi.get(url);

  if (response.status >= 200 && response.status < 300) {
    return response.data;
  } else {
    throw new Error(
      response.data?.message || "Failed to get pending milestones"
    );
  }
}

export async function getMilestoneProgress({
  child_id,
}: {
  child_id?: string;
}) {
  let url = `${MILESTONES_ENDPOINT}/progress`;

  if (child_id) {
    url += `?child_id=${child_id}`;
  }

    const response = await authApi.get(url);

  if (response.status >= 200 && response.status < 300) {
    return response.data;
  } else {
    throw new Error(
      response.data?.message || "Failed to get milestone progress"
    );
  }
}

export async function getAvailableCategories({
  child_id,
}: {
  child_id?: string;
}) {
  let url = `${MILESTONES_ENDPOINT}/categories`;

  if (child_id) {
    url += `?child_id=${child_id}`;
  }

    const response = await authApi.get(url);

  if (response.status >= 200 && response.status < 300) {
    return response.data;
  } else {
    throw new Error(
      response.data?.message || "Failed to get available categories"
    );
  }
}
