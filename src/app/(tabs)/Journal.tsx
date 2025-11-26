import { colors, typography } from "@/src/core/styles";
import { rbr } from '@/src/core/styles/scaling';

import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EditForm, { categories } from "../components/journal/editForm";
import type { JournalItems } from "../components/journal/journalCard";
import JournalCard, { journalEntries } from "../components/journal/journalCard";
import JournalDetails from "../components/journal/journalDetails";

import DeleteModal from "../components/journal/deleteModal";


interface Category{
    title: string
    color?: string;    // optional extra props if you have
    bgColor?: string;
}

const Journal = () => {
    
    const [visible, setVisible] = useState(false)
    const [showCategory, setShowCategory] = useState<string>("all")
    const [data, setData] = useState<JournalItems[]>([])
    const [showDetails, setShowDetails] = useState<boolean>(false)
    const [editJournal, setEditJournal] = useState(false)
    const [showDelModal, setShowDelModal] = useState(false)
    const [selectedJournal, setSelectedJournal] = useState<JournalItems>({
      id: 0,
      title: "",
      imageUrl: "",
     mood: "",
     thoughts: "",
     date: "",
    category: "",
    })

    let allJournals = journalEntries
    const handleSetCategory = (categoryObj: Category) => {
        setShowCategory(categoryObj.title)
    
        if( categoryObj.title === "all"){
            setData(allJournals)
            return;
        }else{
            const filteredData =  allJournals.filter(item => item.category === categoryObj.title)
            setData(filteredData)
            return;
        }
       
    }

    const handleSelectJournal = (item: JournalItems) => {
        setShowDetails(true)
        setSelectedJournal(item)
       
    }

    // to show the delete modal
    const handleShowDelModal = () => {
        setShowDelModal(true)
    }
 // all delete journal modal

 const handleConfirmDel = () => {
    const remaining = allJournals.filter(item => (item.id !== selectedJournal.id))
    allJournals = remaining;
    setData(remaining)
    setShowDetails(false);
    setShowDelModal(false)
    console.log("remainin daata:", data)
    return;
 }
   const goBack = () => {
    if(showDetails) {
       return setShowDetails(false)
    }
   }

    // to edit

    const handleEdit = () => {
        if(selectedJournal){
            setEditJournal(true)
            setVisible(true)
        }
    }
    useEffect(() => {
        handleSetCategory({title: showCategory})
    }), [data]

  return (
    <SafeAreaView style={{ padding: 16, position: "relative", minHeight: "100%", paddingVertical: 60}}>
       { !visible && 
        <View  style={{flex:1 }}>
            <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                <TouchableOpacity style={{flexDirection: 'row', gap: 8, alignItems: "center", }} onPress={goBack}>
                    {/* <Image source={require('../../assets/images/arrow-left.png')}/> */}
                    <Text style={styles.backIcon} >←</Text>
                    <Text style={{fontWeight: 600, fontSize: 24}}>
                        {showDetails ? "Details" : "My Journal"}
                    </Text>
                </TouchableOpacity>
                {showDetails && <View  style={{flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 16}}>
                        <TouchableOpacity onPress={handleEdit}>
                            <Image source={require("../assets/images/journal/edit.svg")} style={{paddingHorizontal: 10}}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowDelModal(true)}>
                            <Image  source={require("../assets/images/journal/trash.svg")} style={{paddingHorizontal: 10}}/>
                        </TouchableOpacity>
                    </View>}
            </View>
            {journalEntries.length === 0 ? (
                <View style={{flexDirection: 'column', gap: 8, alignItems: "center", marginHorizontal: 'auto', width: 330, position: "absolute", top: 180}}>
                    <Image source={require('../assets/images/journal/note.png')} style={{marginBottom: 24}}/>
                    <Text  style={{textAlign: "center", fontWeight: 600, fontSize: 20}}>No journal entries yet</Text>
                    <Text style={{textAlign: "center", fontWeight: 400, fontSize: 16}}>
                      Create your first entry to start tracking your thoughts, goals, or memories.
                    </Text>
                </View>
            ) : (
                <View>
                    { !showDetails && (<Text style={{...typography.bodyLarge, paddingTop: 40, paddingBottom: 12}}>Categories</Text>)}
                    
                    <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                     {!showDetails && (
                         <TouchableOpacity onPress={() => handleSetCategory({title: "all"})}>
                         <Text style={{padding: 10, borderBottomWidth: showCategory === "all" ? 2 : 0, borderColor: showCategory === "all" ?  colors.primary : 'transparent',
                             color: showCategory === "all" ? colors.primary :  colors.textGrey1, ...typography.bodyMedium}}>
                             All
                         </Text>
                     </TouchableOpacity>
                     )}
                    
                     
                        {
                            !showDetails && (categories.map((category) => (
                                <TouchableOpacity onPress={() => handleSetCategory(category)}>
                                    <Text 
                                    style={{padding: 10, borderBottomWidth: showCategory === category.title ? 2 : 0, borderColor: showCategory === category.title ?  colors.primary : 'transparent',
                                        color: showCategory === category.title ? colors.primary :  colors.textGrey1  , ...typography.bodyMedium
                                    }}>
                                        {category.title}
                                    </Text>
                                </TouchableOpacity>
                            )))
                        }
                    </ScrollView>
                    {
                        showDetails ? (
                           <ScrollView style={{paddingVertical: 20}}>
                               <JournalDetails journal={selectedJournal}/>
                           </ScrollView>
                        ) : (
                            <ScrollView  showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 24, gap: 24}}>
                        {data.map((card) => (
                            <TouchableOpacity key={card.id} onPress={() => handleSelectJournal(card)}>
                                <JournalCard journal={card} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                        )
                    }
                    
                </View>
            )}
            
        </View>
        }

        { !showDetails && (
          <TouchableOpacity onPress={() => setVisible(!visible)} style={styles.button}>
                <Image source={require('../../assets/images/plus.png')} style={{width: 24, height: 24}}/>
            </TouchableOpacity>
        )}

        { visible && (
            <View>
                <EditForm isEditing={editJournal} visible={visible} onClose={() => setVisible(false)} existingEntry={editJournal ? selectedJournal : undefined}/>
            </View>
        )}

        {/* to show the delete modal */}

        {
           ( showDetails && showDelModal) && (
            <View style={{marginHorizontal: "auto"}}>
                <DeleteModal onConfirm={handleConfirmDel} onCancel={() => setShowDelModal(false)} visible={showDelModal}/>
            </View>
           )
        }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    button: {
        width: 56,
        height: 56,
        borderRadius: rbr(6),
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 60,
        right: 30,
    },

    backIcon: {
        fontSize: 24,
        color: '#000000',
      },
   

})

export default Journal