import { colors, typography } from '@/src/core/styles'
import React from 'react'
import { Image, Text, View } from 'react-native'
import { categories } from './editForm'
import { formatDate } from './journalDetails'

export interface JournalItems {
  id: number
  title: string,
  imageUrl: any | string,
 mood: string,
  thoughts: string,
  date: string,
  category: string,
}

export interface JournalCardProps{
  journal: JournalItems
}

export const journalEntries: JournalItems [] = [
  {id:1,
    title: "First Steps!",
    category: "Milestones",
    mood: "'Happy 😊",
    thoughts: "Today Maya took her first steps! I can’t believe how fast she’s growing. We were in living room and she she just let go of the couch and walked three steps towards me. I cried happy tears. These moments make all the sleepless nights worth it.",
    date: "2025-09-05",
    imageUrl: require("../../assets/images/journal/mom-walking-baby.png")

  },
  {
    id:2,
    title: "The Struggle with Sleep Training",
    category: "Challenges",
    mood: "Sad 😞",
    thoughts: "Night 3 of my sleep training and it’s so hard.listening to her cry breaks my heart when she struggles to sleep and i just want to let her stay up.",
    date: "2025-09-05",
    imageUrl: require("../../assets/images/journal/worried-mom.png")

  },
  {
    id:3,
    title: "A Day To Remember",
    category: "Memories",
    mood: "Happy ❤️",
    thoughts: "Today I found an old photo from our first picnic the way the sunlight hit the trees, the stories, laughter and ambience is something i hold and cherish closely to my heart.",
    date: "2025-09-05",
    imageUrl: require("../../assets/images/journal/smiling-mom-and-preteen.png")
  },

  {
    id:4,
    title: "Finally Made Time For Myself",
    category: "Selfcare",
    mood: "Self 💕",
    thoughts: "Took a 30-minute bath while grandma watched Maya. It was the first time in weeks since i had an alone time, quite rejuvenation, refreshing and relaxing.",
    date: "2025-09-05",
    imageUrl: require("../../assets/images/journal/mum-bubble-bath.png")
  },
  
]
const JournalCard = ({journal}: JournalCardProps) => {
  const matchedCategory = categories.find(
    (cat) => cat.title === journal.category
  );
  
 
  return (
    <View style={{ flexDirection: "row", gap: 8, alignItems: "flex-start", minHeight: 163, padding: 16, borderRadius: 8, borderWidth: 0.5, borderColor: colors.outline}}>
      <Image source={journal.imageUrl}/>
      <View style={{marginLeft: 2, flexDirection: "column", justifyContent: "space-between", gap: 8}}>
        <View style={{flexDirection: "row", gap: 8, alignItems: "center"}}>
          <Text style={{ color: matchedCategory?.color, backgroundColor: matchedCategory?.bgColor, padding: 4, borderRadius:8, ...typography.labelMedium}}>
            {journal.category}
          </Text>
          <Text>{journal.mood.split(" ")[1]}</Text>
        </View>
        <Text style={{paddingVertical: 2, ...typography.bodyLarge}} numberOfLines={1}>{journal.title}</Text>
        <Text style={{paddingVertical: 2, flex: 1, ...typography.bodySmall}}  numberOfLines={2} ellipsizeMode="tail">{journal.thoughts}</Text>
        <View style={{paddingVertical: 2, flexDirection: "row", gap: 6, alignItems: "flex-end"}}>
          <Image source={require("../../assets/images/journal/calendar.png")} style={{width: 24, height: 24}}/>
          <Text style={{...typography.labelMedium}}>{formatDate(journal.date)}</Text>
        </View>
      </View>
    </View>
  )
}

export default JournalCard