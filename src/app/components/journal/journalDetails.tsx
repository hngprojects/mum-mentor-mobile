import { colors, typography } from '@/src/core/styles'
import React from 'react'
import { Image, Text, View } from 'react-native'
import { categories } from './editForm'
import type { JournalCardProps } from './journalCard'

export function formatDate(dateString: string) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const [year, month, day] = dateString.split("-");
    const monthName = months[parseInt(month) - 1];
  
    return `${monthName} ${parseInt(day)}, ${year}`;
  }

const JournalDetails = ({ journal}: JournalCardProps) => {
    const matchedCategory = categories.find(
        (cat) => cat.title === journal.category
      );

  return (
    <View style={{flexDirection: "column", gap: 10, padding:16, justifyContent: "space-between", borderWidth: 0.5, borderRadius: 8, borderColor: colors.outline, width: "100%"}}>
        <View style={{flexDirection: "row", gap: 8, alignItems: "center"}}>
          <Text style={{ color: matchedCategory?.color, backgroundColor: matchedCategory?.bgColor, padding: 4, borderRadius:8, ...typography.labelMedium}}>
            {journal.category}
          </Text>
          <Text>{journal.mood.split(" ")[1]}</Text>
        </View>
        <Text style={{...typography.bodyLarge}}>{journal.title}</Text>
        <View style={{paddingVertical: 2, flexDirection: "row", gap: 6, alignItems: "flex-end"}}>
            <Image source={require("../../assets/images/journal/calendar.png")} style={{width: 24, height: 24}}/>
            <Text style={{...typography.labelMedium}}>{formatDate(journal.date)}</Text>
        </View>
        <View style={{width: 376, marginHorizontal: "auto"}}>
            <Image source={journal.imageUrl} style={{ width: "100%", height: 316, borderRadius: 8}} resizeMode='cover'/>
        </View>
        <Text style={{...typography.bodySmall}}>{journal.thoughts}</Text>
    </View>
  )
}

export default JournalDetails