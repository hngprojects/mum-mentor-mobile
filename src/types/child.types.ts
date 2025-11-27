// types/child.types.ts

export interface ChildProfile {
  id: string;
  profile_setup_id: string;
  full_name: string;
  date_of_birth: string; // ISO date string
  due_date?: string; // ISO date string, optional
  gender: string;
  birth_order: number;
  profile_picture_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateChildProfileRequest {
  profile_setup_id: string;
  full_name: string;
  date_of_birth: string;
  due_date?: string;
  gender: string;
  birth_order: number;
  profile_picture_url?: string;
}

export interface UpdateChildProfileRequest {
  full_name?: string;
  date_of_birth?: string;
  due_date?: string;
  gender?: string;
  birth_order?: number;
  profile_picture_url?: string;
}

export interface UploadProfilePictureResponse {
  profile_picture_url: string;
  message: string;
}

export interface ApiError {
  detail: {
    loc: (string | number)[];
    msg: string;
    type: string;
  }[];
}