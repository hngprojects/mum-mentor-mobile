import { CategoryInfo } from "@/src/store/types";
import { CategoriesType } from "@/src/types/milestones";

export const MILESTONE_DATA = [
  {
    id: "1",
    name: "Drank warm water",
    description: "Warm hydration to help digestion and relax muscles.",
    status: "pending",
  },

  {
    id: "2",
    name: "Stretched the back",
    description: "A slow stretch to ease stiffness in the spine.",
    status: "pending",
  },

  {
    id: "3",
    name: "Laid down to relax",
    description: "Took a short moment to lie flat and rest.",
    status: "pending",
  },
];

export const MILESTONE_SECTION = [
  { id: 1, type: "mother" },
  { id: 2, type: "child" },
];

export const MILESTONE_STATUS = [
  { id: 1, status: "completed" },
  { id: 1, status: "pending" },
];

export const TOP_CATEGORIES: CategoriesType[] = [
  {
    id: 1,
    title: "body recovery",
    desc: "Gentle guidance as your body heals after birth.",
    icon: require("../../assets/images/body-recovery-icon.png"),
    value: 0,
  },

  {
    id: 2,

    title: "mental wellness",
    desc: "Log in with your emotions and find calm routines.",
    icon: require("../../assets/images/mental-wellness.png"),
    value: 5,
  },
];

export const BOTTOM_CATEGORIES: CategoriesType[] = [
  {
    id: 3,
    title: "Emotional Tracker",
    desc: "See patterns in how you feel over time.",
    icon: require("../../assets/images/emotional-tracker.png"),
    value: 20,
  },

  {
    id: 4,
    title: "routine builder",
    desc: "Create simple habits that fit your lifestyle.",
    icon: require("../../assets/images/routine-builder.png"),
    value: 10,
  },
];

export const PENDING_MILESTONES = [
  { title: "Titled the room", category: "routing builder" },
  { title: "Played soft music", category: "mental wellness" },
];

export const CATEGORIES: Record<string, CategoryInfo> = {
  "Body Recovery": {
    title: "body recovery",
    desc: "Gentle guidance as your body heals after birth.",
    icon: require("../../assets/images/body-recovery-icon.png"),
  },
  "Mental Wellness": {
    title: "mental wellness",
    desc: "Log in with your emotions and find calm routines.",
    icon: require("../../assets/images/mental-wellness.png"),
  },
  "Routine Builder": {
    title: "routine builder",
    desc: "Create simple habits that fit your lifestyle.",
    icon: require("../../assets/images/routine-builder.png"),
  },
  "Self Care": {
    title: "Emotional Tracker",
    desc: "See patterns in how you feel over time.",
    icon: require("../../assets/images/emotional-tracker.png"),
  },

  // child

  Development: {
    title: "month development",
    desc: "See what your baby is learning at each age.",
    icon: require("../../assets/images/month.png"),
  },
  "Health and Nutrition": {
    title: "Health & Nutrition",
    desc: "Monitor growth measurements easily.",
    icon: require("../../assets/images/health.png"),
  },
  "Activities and Play": {
    title: "Activities & Play",
    desc: "Age-appropriate activities to support learning.",
    icon: require("../../assets/images/activity.png"),
  },
  "Growth Check": {
    title: "Growth Check",
    desc: "Monitor feeding, sleep, and basic wellness.",
    icon: require("../../assets/images/emotional-tracker.png"),
  },
};
