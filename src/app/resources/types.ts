import { ImageSourcePropType } from "react-native";

export interface Category {
  id: string;
  label: string;
}

export interface ResourceListItem {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
  fullContent?: string;
  steps?: string[];
  videoUrl?: string;
}

export interface ResourceSectionData {
  id: string;
  title: string;
  categoryId: string;
  resources: ResourceListItem[];
  searchPlaceholder?: string;
}
