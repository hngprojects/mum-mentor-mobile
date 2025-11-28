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
        image: require('../../assets/images/resources/quick-diaper-change.png'),
        fullContent: "Changing diapers efficiently is key to maintaining hygiene and preventing rashes. Always have wipes, cream, and a fresh diaper ready. Keep one hand on the baby at all times for safety, and clean from front to back to avoid infections. Let the skin air dry briefly before applying barrier cream, then secure the diaper snugly but not too tight.",
        steps: [
          "Gather supplies: wipes, diaper cream, fresh diaper, and changing pad.",
          "Lay the baby down on a clean, safe surface and keep one hand on them.",
          "Remove the dirty diaper and clean the area thoroughly from front to back.",
          "Let the skin dry for a minute to prevent moisture buildup.",
          "Apply a thin layer of diaper cream if needed.",
          "Position the new diaper under the baby and fasten securely.",
          "Dispose of the dirty diaper properly and wash hands.",
        ],
        
      },
      {
        id: "soothing-crying-baby",
        title: "Soothing a Crying Baby",
        description: "Try swaddling, gentle rocking, or white noise to calm your baby.",
        image: require('../../assets/images/resources/soothing-cry-baby.png'),
        fullContent: "Babies cry for various reasons: hunger, discomfort, tiredness, or overstimulation. Start by checking basic needs like feeding, diaper change, or temperature. Swaddling mimics the womb's security, gentle rocking provides comfort, and white noise blocks out distractions. If crying persists, consult a pediatrician to rule out medical issues.",
        steps: [
          "Check for basic needs: Is the baby hungry, wet, too hot/cold, or tired?",
          "Swaddle the baby snugly in a soft blanket, leaving room for hip movement.",
          "Hold and rock gently, or walk around while patting their back.",
          "Play white noise or soft lullabies to create a calming environment.",
          "Offer a pacifier if breastfeeding isn't an issue.",
          "If nothing works, take a break and try again later, staying calm yourself.",
        ],
        
      },
      {
        id: "encouraging-crawling-hacks",
        title: "Encouraging Crawling",
        description: "Place toys just out of reach to motivate your baby to crawl.",
        image: require('../../assets/images/resources/encouraging-crawl.png'),
        fullContent: "Crawling is a crucial developmental milestone that builds strength, coordination, and spatial awareness. Create a safe, carpeted area free of hazards. Use toys as incentives to encourage movement. Supervise closely and celebrate every attempt to build confidence. If your baby skips crawling, consult your pediatrician.",
        steps: [
          "Clear a safe, soft space on the floor, free of small objects or cords.",
          "Place favorite toys or objects just beyond the baby's reach.",
          "Get down to their level and demonstrate reaching or crawling motions.",
          "Encourage with verbal praise and smiles for any movement towards the toy.",
          "Practice for 10-15 minutes, 2-3 times daily, when the baby is alert.",
          "Gradually increase distances as the baby gains confidence.",
        ],
        
      },
      {
        id: "playing-with-toys",
        title: "Playing with Toys",
        description: "Introduce sensory toys to spark curiosity and coordination.",
        image: require('../../assets/images/resources/playing-with-toys.png'),
        fullContent: "Toys are essential for cognitive, motor, and social development. Choose age-appropriate toys that stimulate senses: textures, sounds, colors. Rotate toys to maintain interest and prevent overstimulation. Play together to model interaction and bonding. Avoid toys with small parts that could be choking hazards.",
        steps: [
          "Select toys based on baby's age and developmental stage.",
          "Introduce one or two new toys at a time to avoid overwhelm.",
          "Demonstrate how to use the toy safely and interactively.",
          "Allow supervised free exploration and discovery.",
          "Rotate toys every few days to keep things fresh.",
          "Engage in play together, narrating actions and responses.",
        ],
        
      },
      {
        id: "baby-language-basics",
        title: "Baby Language",
        description: "Repeat simple words and sounds to encourage early speech.",
        image: require('../../assets/images/resources/baby-language.png'),
        fullContent: "Talk to your baby often and repeat simple words to encourage speech development. Use clear pronunciation, make eye contact, and respond to their coos and babbles to build communication skills.",
        steps: [
          "Talk to your baby throughout the day.",
          "Use simple, clear words.",
          "Make eye contact while speaking.",
          "Respond to their sounds.",
          "Read books together daily.",
          "Sing songs and nursery rhymes.",
        ],
        
      },
      {
        id: "baby-cottage-setup",
        title: "Baby Cottage",
        description: "Create a cozy nook with soft lighting for bedtime routines.",
        image: require('../../assets/images/resources/baby-cottage.png'),
        fullContent: "Create a cozy nook with soft lighting, comfortable seating, and calming decor for peaceful bedtime routines. Keep the space clutter-free and dedicated to quiet activities.",
        steps: [
          "Choose a quiet corner of the room.",
          "Install dimmable or soft lighting.",
          "Add comfortable seating.",
          "Keep the area clutter-free.",
          "Use calming colors and decor.",
          "Make it a screen-free zone.",
        ],
        
      },
      {
        id: "sleep-routine-starter",
        title: "Creating a Sleep Routine",
        description: "Wind down with a warm bath and lullaby to signal bedtime.",
        image: require('../../assets/images/resources/creating-sleep-routine.png'),
        fullContent: "A consistent sleep routine helps regulate your baby's internal clock, making bedtime smoother and improving sleep quality. Start winding down 30-60 minutes before bed with calming activities. Keep the routine simple and predictable. Adjust as your baby grows, and be patient as it takes time to establish.",
        steps: [
          "Set a consistent bedtime and wake-up time, even on weekends.",
          "Begin wind-down with a warm bath and gentle massage.",
          "Dress in comfortable sleepwear and dim the lights.",
          "Read a short story or sing lullabies in a quiet room.",
          "Offer a final feed if needed, then place in crib while drowsy but awake.",
          "Use a consistent sleep cue like a special blanket or soft toy.",
        ],
        
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
        image: require('../../assets/images/resources/easy-smoothie.png'),
        fullContent: "Blend your favourite fruits with yogurt or milk for a quick, nutrient-dense drink. Add spinach or nut butter for extra vitamins and healthy fats.",
        steps: [
          "Add 1 cup fruit (fresh or frozen) to blender.",
          "Add 1/2 cup yogurt or milk of choice.",
          "Optional: add a handful of spinach or 1 tbsp nut butter.",
          "Blend until smooth and enjoy immediately.",
        ],
      },
      {
        id: "avocado-toast",
        title: "Avocado Toast",
        description: "Layer avocado on toast for a fast, filling bite.",
        image: require('../../assets/images/resources/avocado-toast.png'),
        fullContent: "Mash ripe avocado with a pinch of salt and lemon juice, then spread it on whole-grain toast. Top with seeds, a drizzle of olive oil, or a poached egg for extra protein.",
        steps: [
          "Toast a slice of whole-grain bread.",
          "Mash 1/2 avocado with salt and lemon.",
          "Spread avocado on toast and add toppings.",
          "Serve immediately.",
        ],
      },
      {
        id: "overnight-oats",
        title: "Overnight Oats",
        description: "Prep oats with berries for a grab-and-go breakfast.",
        image: require('../../assets/images/resources/overnight-oats.png'),
        fullContent: "Combine rolled oats with milk or yogurt, add a sweetener and fruit, then refrigerate overnight for an easy, nutritious breakfast.",
        steps: [
          "Mix 1/2 cup rolled oats with 1/2 cup milk or yogurt.",
          "Add 1 tsp sweetener and a handful of berries.",
          "Cover and refrigerate overnight.",
          "Stir and eat cold or warmed in the morning.",
        ],
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
        image: require('../../assets/images/resources/encouraging-crawl.png'),
        fullContent: "Create a safe, inviting floor space and place favourite toys just beyond reach to motivate movement and exploration. Encourage short, frequent sessions and celebrate attempts.",
        steps: [
          "Set up a soft, safe play area.",
          "Place toys slightly out of reach.",
          "Get down to the baby's level and encourage movement.",
          "Offer praise for attempts and progress.",
        ],
      },
      {
        id: "first-words",
        title: "First Words",
        description: "Talk to your baby often and repeat simple words to encourage speech.",
        image: require('../../assets/images/resources/first-words.png'),
        fullContent: "Narrate daily routines, read aloud, and repeat words to help your baby connect sounds with meaning. Respond to their vocalizations to reinforce communication.",
        steps: [
          "Narrate what you're doing throughout the day.",
          "Read simple books together regularly.",
          "Repeat and expand on your baby's vocalizations.",
          "Use gestures along with words.",
        ],
      },
      {
        id: "tummy-time",
        title: "Tummy Time Essentials",
        description: "Strengthen core muscles with short, frequent tummy time sessions.",
        image: require('../../assets/images/resources/tummy-time-essentials.png'),
        fullContent: "Start with short tummy time sessions while your baby is awake and alert to build neck and upper-body strength. Gradually increase duration and make it engaging with toys.",
        steps: [
          "Begin with 1-2 minutes several times a day.",
          "Place toys or mirrors to encourage reaching.",
          "Stay close and supervise at all times.",
          "Increase session length slowly as tolerated.",
        ],
      },
    ],
  },
  {
    id: "self-care-tips",
    title: "Self-Care Tips",
    categoryId: "selfCare",
    searchPlaceholder: "Search for self-care tips",
    resources: [
      {
        id: "mindful-breathing",
        title: "Mindful Breathing Exercises",
        description: "Practice deep breathing to reduce stress and promote relaxation.",
        image: require('../../assets/images/resources/mindful-breathing-exercises.png'),
        fullContent: "Mindful breathing helps activate the parasympathetic nervous system, reducing stress hormones and promoting calm. Practice for 5-10 minutes daily. Focus on slow, deep breaths through the nose, holding briefly, then exhaling slowly. This can be done anywhere and is especially helpful during moments of overwhelm.",
        steps: [
          "Find a quiet, comfortable place to sit or lie down.",
          "Close your eyes and place one hand on your belly.",
          "Inhale deeply through your nose for a count of 4.",
          "Hold your breath for a count of 4.",
          "Exhale slowly through your mouth for a count of 6.",
          "Repeat for 5-10 minutes, focusing on the breath.",
        ],
        
      },
      {
        id: "quick-self-massage",
        title: "Quick Self-Massage Techniques",
        description: "Relieve tension with simple self-massage for neck and shoulders.",
        image: require('../../assets/images/resources/quick-self-massage.png'),
        fullContent: "Self-massage can release muscle tension, improve circulation, and reduce stress. Use your fingers or a tennis ball for pressure points. Focus on areas like neck, shoulders, and lower back. Always use gentle pressure and stop if you feel pain. Combine with deep breathing for enhanced relaxation.",
        steps: [
          "Sit comfortably with good posture.",
          "Use your fingertips to gently knead neck muscles in circular motions.",
          "Apply pressure to shoulder knots with your opposite hand.",
          "Roll a tennis ball under your feet or lower back for deeper pressure.",
          "Breathe deeply throughout the massage.",
          "Spend 5-10 minutes on each area as needed.",
        ],
        
      },
      {
        id: "gratitude-journaling",
        title: "Gratitude Journaling",
        description: "Write down three things you're grateful for each day to boost positivity.",
        image: require('../../assets/images/resources/gratitude-journaling.png'),
        fullContent: "Gratitude journaling shifts focus from daily stresses to positive aspects of life, improving mental health and resilience. Write 3-5 things you're thankful for each day. Be specific and include small moments. Over time, this practice can rewire your brain to notice more positives and reduce anxiety.",
        steps: [
          "Set aside 5-10 minutes each evening before bed.",
          "Use a dedicated notebook or app for your gratitude journal.",
          "Write down 3 specific things you're grateful for that day.",
          "Include details: why you're grateful and how it made you feel.",
          "Read previous entries occasionally to reflect on patterns.",
          "Make it a consistent habit, even on difficult days.",
        ],
        
      },
    ],
  }
];
