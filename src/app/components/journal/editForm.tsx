import * as ImagePicker from "expo-image-picker";
import React, { useState } from 'react';
import {
    Image,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import { journalEntries } from './journalCard';


interface EditFormProps {
    isEditing: boolean;
    visible: boolean;
  onClose?: () => void;
  existingEntry?: {
    title: string;
    date: string;
    category: string;
    mood: string;
   imageUrl: any;
    thoughts: string;
  };
  }
  export const categories = [{title:'Sleep', color: "", bgColor: "#e4d4ff"}, 
    {title:'Memories', color:"#2C9E76", bgColor: "#D7F4EA66"}, 
    {title: 'Challenges', color: "#B2243B", bgColor: "#FBEAED"}, 
    {title:'Milestones',color: "#5B3C8A", bgColor: "#e4d4ff" },
     {title: 'Selfcare', color: "#AB9F45", bgColor: "#FDF7C5B2"},
    {title: "Body Recovery", color: "", bgColor: ""}
]

  export const moods = ['Angry 😡', 'Self 🧘‍♀️', 'Love ❤️', 'Happy 😊', 'Stressed 🙁', 'Sad 😞', 'Memories ❤️'];
  



const EditForm: React.FC<EditFormProps> = ({isEditing,  onClose, existingEntry, visible} )  => {
    const [title, setTitle] = useState(existingEntry?.title || '');
    const [date, setDate] = useState(existingEntry?.date || new Date().toLocaleDateString('en-GB'));
    const [selectedCategory, setSelectedCategory] = useState(existingEntry?.category || '');
    const [selectedMood, setSelectedMood] = useState(existingEntry?.mood || '');
    const [thoughts, setThoughts] = useState(existingEntry?.thoughts || '');
    const [imageUrl, setImageUrl] = useState(existingEntry?.imageUrl|| '')
     const [addMood, setAddMood] = useState(false)

    const pickImage = async () => {
        // Ask for permission first
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (!permission.granted) {
          alert("Permission to access gallery is required!");
          return;
        }
    
        // Open gallery
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
    
        if (!result.canceled) {
          setImageUrl(result.assets[0].uri);
        }
      };

    const handleCancel = () => {
        setTitle(""), setDate(""), setSelectedMood(""), setSelectedCategory(""), setThoughts("")
    }

    const handleSave = () =>{
        const length = journalEntries.length
        const data = {
            id: length + 1,
            title: title,
            category: selectedCategory,
            mood: selectedMood,
            thoughts: thoughts,
            date: date,
            imageUrl: imageUrl
        }
        journalEntries.push(data)
        onClose?.();
        
    }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <ScrollView style={{paddingBottom: 16, marginHorizontal: "auto"}}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
              <Text style={styles.backIcon} >←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New entry</Text>
          </View>
          {/* Title Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Entry title...."
              placeholderTextColor="#C7C7CD"
              value={title}
              onChangeText={setTitle}
            />
          </View>
          {/* Date Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Date</Text>
            <View style={styles.dateInputContainer}>
              <TextInput
                style={styles.dateInput}
                value={date}
                onChangeText={setDate}
              />
              <Image  source={require('../../assets/images/journal/calendar.png')} style={{height: 24, width: 24}}/>
            </View>
          </View>
          {/* Category Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.chipContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.title}
                  style={[
                    styles.chip,
                    selectedCategory === category.title && styles.chipSelected
                  ]}
                  onPress={() => setSelectedCategory(category.title)}
                >
                  <Text style={[
                    styles.chipText,
                    selectedCategory === category.color && styles.chipTextSelected
                  ]}>
                    {category.title}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Mood Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Mood (Optional)</Text>
            <View style={styles.chipContainer}>
              {moods.map((mood) => (
                <TouchableOpacity
                  key={mood}
                  style={[
                    styles.chip,
                    selectedMood === mood && styles.chipSelected
                  ]}
                  onPress={() => setSelectedMood(mood)}
                >
                  <Text style={[
                    styles.chipText,
                    selectedMood === mood && styles.chipTextSelected
                  ]}>
                    {mood}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.addButton} onPress={() => {setAddMood(!addMood)}}>
                <Text style={styles.addButtonText}>+ Add</Text>
              </TouchableOpacity>
              {
                addMood && (
                    <TextInput  style={styles.photoInput}
                    placeholder="Enter your mood with an emoji too..."></TextInput>
                )
              }
            </View>
          </View>
          {/* Photos Section */}
          <View style={styles.section}>
            <Text style={styles.label}>Photos (Optional)</Text>
            <View style={styles.photoInputContainer}>
              <TextInput
                style={styles.photoInput}
                placeholder="Entry title...."
                value={typeof imageUrl === "string" ? imageUrl : JSON.stringify(imageUrl)}
                placeholderTextColor="#C7C7CD"
              />
              <TouchableOpacity style={styles.photoAddButton}>
                <TouchableOpacity onPress={pickImage}><Text  style={styles.photoAddIcon }>+</Text></TouchableOpacity>
              </TouchableOpacity>

              {/* to preview image uf it exists */}
              {imageUrl ? (
              <View>
                 <Image
                  source={
                  typeof imageUrl === "string"
                 ? { uri: imageUrl }
                 : imageUrl?.uri
                 ? { uri: imageUrl.uri }
                  : imageUrl
                 }/>
                 <TouchableOpacity onPress={() => setImageUrl("")}>
                    <Text>x</Text>
                 </TouchableOpacity>
              </View>) :  null}
             </View>
           </View>
          {/* Your Thoughts */}
          <View style={styles.section}>
            <Text style={styles.label}>Your Thoughts</Text>
            <TextInput
              style={styles.thoughtsInput}
              placeholder="Write about your day, feelings and moment....."
              placeholderTextColor="#C7C7CD"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={thoughts}
              onChangeText={setThoughts}
            />
          </View>
          <View style={{paddingHorizontal: 16}}>
            <PrimaryButton title='Save' onPress={handleSave} style={{marginBottom: 16}}/>
              <SecondaryButton title='Cancel' onPress={handleCancel} style={{ backgroundColor: "white"}}/>
          </View>
      </ScrollView>
    </Modal>
  );
}

export default EditForm

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  backIcon: {
    fontSize: 24,
    color: '#000000',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000000',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateInput: {
    width: 100,
    fontSize: 16,
    color: '#000000',
  },
  calendarIcon: {
    fontSize: 20,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  chipSelected: {
    borderColor: '#FF3B30',
    borderWidth: 2,
  },
  chipText: {
    fontSize: 14,
    color: '#3C3C43',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#000000',
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  addButtonText: {
    fontSize: 14,
    color: '#3C3C43',
    fontWeight: '500',
  },
  photoInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  photoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000000',
  },
  photoAddButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoAddIcon: {
    fontSize: 24,
    color: '#FF3B30',
    fontWeight: '300',
  },
  thoughtsInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000000',
    minHeight: 120,
  },
});