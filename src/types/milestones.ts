import { ImageSourcePropType } from "react-native";

export type MilestoneType = "mother" | "child";

export type CategoriesType = {
  id: number;
  title: string;
  desc: string;
  value: number;
  icon: ImageSourcePropType;
};
