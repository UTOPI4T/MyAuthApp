import { StyleSheet, Text, View, TextInput, ScrollView, Linking, Alert, ToastAndroid, TouchableOpacity, Image, StatusBar} from 'react-native'
import React, {useState} from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

import PickCategories from '../../../../components/eventComps/pickCategories';
import DatePicker from '../../../../components/eventComps/datePicker';
import { ForEventMenu, inCRUDevent } from '../InsideGStyles'
import { PGStyling } from '../../PGStyling'


// Firestore Add Data
import "firebase/firestore"; 
import 'firebase/auth';
import { getAuth } from 'firebase/auth';
import {  db , collection,  addDoc}  from '../../../../firebaseAPI';

const AddEvent = () => {
  const navigation = useNavigation(); 

  const [imageSource, setImageSource] = useState(null);
  const [eventName, setEventName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [location, setLocation] = useState(""); 
  const [description, setDescription] = useState('');
  
  const [category, setCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Tech', value: 'Tech', id: 0 },
    { label: 'Sports', value: 'Sports', id: 1 },
    { label: 'Competition', value: 'Competition', id: 2 },
    { label: 'Tour', value: 'Tour', id: 3 },
    { label: 'Seminar', value: 'Seminar', id: 4 },
    { label: 'Online', value: 'Online', id: 5 },
    { label: 'Concert', value: 'Concert', id: 6},
    { label: 'Workshop', value: 'Workshop', id: 7 },
    { label: 'Others', value: 'Others', id: 8 },
  ]);

  const handleCategory = (category) => { 
    setCategory(category);
  }

  const handleEventName = (inputText) => { 
    setEventName(inputText);
  }

  const handleDateChange = (formattedDateTime) => {
    setSelectedDate(formattedDateTime); 
  
  };

  const handleLocation = (inputText) => {
    setLocation(inputText);
  };

  
  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [5, 3],
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      const selectedImage = pickerResult.assets[0].uri;
      setImageSource(selectedImage);
      console.log('Image uploaded for box:', selectedImage);
    }
  };

  const handleConfirmAndSave = async () => {
    try {
      const auth = getAuth(); 
      const user = auth.currentUser; 

      if (!user) {
        ToastAndroid.show('Please sign in to continue.', ToastAndroid.LONG);
        return;
      }

      if (!category || !imageSource || !eventName || !selectedDate || !location || !description) {
        console.log('One or more fields are empty. Showing toast...');
        ToastAndroid.showWithGravity(
          'Please fill in all fields.',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
        console.log('Toast shown.');
        return;
        
      }
      
      Alert.alert(
        'Confirmation',
        'Do you want to continue with the entered information?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          {
            text: 'Continue',
            onPress: async () => {
              try {
                const newEventRef = collection(db, 'newevent');
                const docRef = await addDoc(newEventRef, {
                  category: category,
                  imageSource: imageSource,
                  eventName: eventName,
                  selectedDate: selectedDate,
                  location: location,
                  description: description,
                  uid: user.uid, 
                  createdAt: new Date(),
                });
                console.log("Document written with ID: ", docRef.id);
                ToastAndroid.show('New event created!', ToastAndroid.SHORT);
                navigation.navigate('EventMenuPage');

                // // Proceed to the next step or navigate to another page
                // console.log('The Image:', imageSource);
                // console.log('Event Name:', eventName);
                // console.log('Date & Time:', selectedDate);
                // console.log('Location:', location);
                // console.log('Description:', description);
               
              } catch (error) {
                console.error("Error adding document: ", error);
                ToastAndroid.show(`${error.message}`, ToastAndroid.LONG);
              }
            }
          }
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error adding document: ", error);
      ToastAndroid.show(`Error: ${error.message}`, ToastAndroid.LONG);
    }
  };

  
  
  const openInstagramProfile = (username) => {
    const url = `https://www.instagram.com/${username}`;
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }

  const handleDescription = (inputText) => {
    // Parse the input text to identify Instagram usernames
    const segments = description.split(/\s+/);
    const parsedSegments = segments.map((segment, index) => {
      if (segment.startsWith('@')) {
        const username = segment.slice(1); // Remove '@' symbol
        return (
          <TouchableOpacity key={index} onPress={() => openInstagramProfile(username)}>
            <Text style={styles.link}>@{username}</Text>
          </TouchableOpacity>
        );
      } else {
        return segment;
      }
    });
    
    setDescription(inputText);
  };

  return (
    <LinearGradient {...PGStyling.linearGradient} style={ForEventMenu.screenLayout}>
      <View style={{marginTop:10,}}>
        <Text style={styles.create}>Create Event</Text>
      </View>
      <PickCategories
        open={open}
        setOpen={setOpen}
        value={category}
        setValue={setCategory}
        items={items}
        setItems={setItems}
        category={category}
        setCategory={handleCategory}
        theBar={{flex:1, marginTop:25}}
      />
      
      <ScrollView 
        style={{marginTop:53,}}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>

        <View style={inCRUDevent.theFrame}>
          <View style={ForEventMenu.imageContainer}>
            <View style={styles.addImages}>
              <TouchableOpacity onPress={selectImage}>
                {imageSource ? (
                  <Image
                    source={{ uri: imageSource }}
                    style={styles.theImage}
                    resizeMode="contain"
                  />
                ) : (
                  <Ionicons 
                    name="add-circle-outline" 
                    size={35} 
                    color="#f1f1f1" 
                  />
                )}
              </TouchableOpacity>
              <View style={{ alignItems: 'center', marginTop: 5 }}>
                <Text style={{ fontWeight: '450', color:'#f1f1f1' }}>
                  {imageSource ? 'Tap again to change ' : 'Add Image'}
                </Text>
                <Text style={{fontSize:12, color:'#ABABAB'}}>
                  (poster, environment, etc.)
                </Text>
              </View>

            </View>
          </View>
          <TxtInputs 
            label='Event Name' 
            placeholder='Input the name...'
            value={eventName}
            onChangeText={handleEventName}
          />
          
          <DatePicker onDateChange={handleDateChange} value={selectedDate} />
          
          <TxtInputs 
            label='Location' 
            placeholder='Input the location...'
            value={location}
            onChangeText={handleLocation}
          />
          
          
          <TxtInputs 
            label='Description' 
            placeholder='Input description (mention with @..)'
            value={description}
            onChangeText={setDescription}
          />

          {/* <TxtInputs 
            label='Max Attendee :' 
            placeholder='Set Max Attendee...'
            value={description}
            onChangeText={handleDescription}
            // onChangeText={(text) => handleDescription(text)}
          /> */}
          
          
           
        </View>
        
      </ScrollView>
      <TouchableOpacity onPress={handleConfirmAndSave} style={styles.btnSubmit}>
        <Text style={{
          color:'#321c43',
          textAlign:'center',
          fontWeight:'500',
          }}>  Submit Event  </Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}

const TxtInputs = ({placeholder,value, onChangeText, label}) => {
  return(
    <View>
      <Text style={ForEventMenu.addEventLabels}>{label}</Text>
      <TextInput
        // autoFocus={true}
        multiline
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={ForEventMenu.inputBox}
        color='#f1f1f1'
        placeholderTextColor='rgba(234, 221, 243, 0.5)'

      />
    </View>
  )

}

export default AddEvent

const styles = StyleSheet.create({
  create:{
    color:'#f1f1f1',
    textAlign:'center',
    fontSize:18,
    fontWeight:'400',
    // marginHorizontal:4,
    // marginTop:40
  },
  btnSubmit:{
    borderRadius: 5,
    backgroundColor: '#f1f1f1',
    padding: 10,
    marginVertical:10,
    width:135,
    alignSelf: 'center',

  },

  link:{
    fontSize:20,
    color:'#f1f1f1',
    padding:10,
  },
  addImages: {
    alignItems: 'center',
    padding: 20,
    
  },
  theImage: {
    
    borderRadius:5,
    width:370,
    height: 200,
  },

})