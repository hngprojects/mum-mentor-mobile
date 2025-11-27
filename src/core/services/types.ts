// core/services/types.ts

/**
 * Simple re-export file for type convenience
 * All child-related types come from types/child.types.ts
 * Profile setup types are defined in profileSetup.service.ts
 */

// Re-export all child types for convenience
export type { 
  ChildProfile,
  CreateChildProfileRequest,
  UpdateChildProfileRequest,
  UploadProfilePictureResponse,
  ApiError
} from '../../types/child.types';

// Re-export profile setup types
export type {
  CreateProfileSetupRequest,
  ProfileSetupData
} from './profileSetup.service';