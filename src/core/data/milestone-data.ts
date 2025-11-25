import { CategoriesType } from "@/src/types/milestones";

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
