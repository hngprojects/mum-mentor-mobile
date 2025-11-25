import { Category, ResourceSectionData } from "./types";

export const categories: Category[] = [
  { id: "all", label: "All" },
  { id: "parenting", label: "Parenting" },
  { id: "selfCare", label: "Self-care" },
  { id: "recipe", label: "Quick recipe" },
];

// Temporary demo data matching the design; replace with API payloads once available.
export const resourceSections: ResourceSectionData[] = [
  {
    id: "parenting-hacks",
    title: "Parenting Hacks",
    categoryId: "parenting",
    searchPlaceholder: "Search for Parenting tips",
    resources: [
      {
        id: "quick-diaper",
        title: "Quick Diaper Change",
        description: "Use a portable changing pad and keep essentials organized.",
        image: { uri: "https://images.unsplash.com/photo-1519681393784-d120267933ba" },
      },
      {
        id: "soothing-crying-baby",
        title: "Soothing a Crying Baby",
        description: "Try swaddling, gentle rocking, or white noise to calm your baby.",
        image: { uri: "https://images.unsplash.com/photo-1542974248-0b3c81705fe0" },
      },
      {
        id: "encouraging-crawling-hacks",
        title: "Encouraging Crawling",
        description: "Place toys just out of reach to motivate your baby to crawl.",
        image: { uri: "https://images.unsplash.com/photo-1584211950622-8b5303f0c03c" },
      },
      {
        id: "playing-with-toys",
        title: "Playing with Toys",
        description: "Introduce sensory toys to spark curiosity and coordination.",
        image: { uri: "https://images.unsplash.com/photo-1509701852059-c221a6f1e878" },
      },
      {
        id: "baby-language-basics",
        title: "Baby language",
        description: "Repeat simple words and sounds to encourage early speech.",
        image: { uri: "https://images.unsplash.com/photo-1520719627573-5e2c1a6610f0" },
      },
      {
        id: "baby-cottage-setup",
        title: "Baby cottage",
        description: "Create a cozy nook with soft lighting for bedtime routines.",
        image: { uri: "https://images.unsplash.com/photo-1519681394486-87b6aa5f10cc" },
      },
      {
        id: "sleep-routine-starter",
        title: "Creating a Sleep Routine",
        description: "Wind down with a warm bath and lullaby to signal bedtime.",
        image: { uri: "https://images.unsplash.com/photo-1504150558240-0b4fd94a4e89" },
      },
    ],
  },
  {
    id: "quick-recipes",
    title: "Quick Recipes",
    categoryId: "recipe",
    searchPlaceholder: "Search for recipes",
    resources: [
      {
        id: "easy-smoothie",
        title: "Easy Smoothie",
        description: "Whip up a vitamin-rich smoothie to keep energy levels up.",
        image: { uri: "https://images.unsplash.com/photo-1572441710534-680c18843ece" },
      },
      {
        id: "avocado-toast",
        title: "Avocado Toast",
        description: "Layer avocado on toast for a fast, filling bite.",
        image: { uri: "https://images.unsplash.com/photo-1522184216315-dcdee1329d9d" },
      },
      {
        id: "overnight-oats",
        title: "Overnight Oats",
        description: "Prep oats with berries for a grab-and-go breakfast.",
        image: { uri: "https://images.unsplash.com/photo-1525755662778-989d0524087e" },
      },
    ],
  },
  {
    id: "child-development",
    title: "Child Development",
    categoryId: "parenting",
    searchPlaceholder: "Search developmental tips",
    resources: [
      {
        id: "encouraging-crawling",
        title: "Encouraging Crawling",
        description: "Place toys just out of reach to motivate your baby to crawl.",
        image: { uri: "https://images.unsplash.com/photo-1584211950622-8b5303f0c03c" },
      },
      {
        id: "first-words",
        title: "First Words",
        description: "Talk to your baby often and repeat simple words to encourage speech.",
        image: { uri: "https://images.unsplash.com/photo-1504150558240-0b4fd94a4e89" },
      },
      {
        id: "tummy-time",
        title: "Tummy Time Essentials",
        description: "Strengthen core muscles with short, frequent tummy time sessions.",
        image: { uri: "https://images.unsplash.com/photo-1628717349804-430897f18e2d" },
      },
    ],
  },
];
