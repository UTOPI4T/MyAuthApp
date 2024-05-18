import { StyleSheet, Text, View, TextInput, ScrollView, Linking, Alert, Platform, TouchableOpacity, Image,} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native';
import React, {useState, useEffect} from 'react'
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';

import { getAuth } from 'firebase/auth';
import { doc, deleteDoc, db, collection, where, getDocs, query } from '../../../../firebaseAPI';
import { PGStyling } from '../../PGStyling'
import { ForEventMenu, ForManageEvent, inCRUDevent } from '../InsideGStyles'


const CRUDevent = ({route}) => {
    const { event} = route.params;
    const [updateEvent, setUpdateEvent] = useState('');
    const [address, setAddress] = useState(event.location);
    

    
    const splitDescription = (description) => {
        // Regular expression to split the description text
        const regex = /(@[a-zA-Z0-9_]+)/g;
        return description.split(regex);
      };
      
      // Component to render description text with clickable Instagram usernames
      const DescriptionWithInstagramLinks = ({ description }) => {

        // Split the description text into parts
        const parts = splitDescription(description);
      
        // Directly open someone's profile
        const handleInstagramUsernameClick = (username) => {

          
          const instagramUrl = `https://www.instagram.com/${username}`;
          Linking.openURL(instagramUrl);
        };
      
        return (
          <View style={styles.container}>
            {parts.map((part, index) => {
              if (part.startsWith('@')) {
                // This part is an Instagram username
                const username = part.slice(1); // to remove the '@' symbol
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleInstagramUsernameClick(username)}>
                    <Text style={styles.instagramUsername}>{part}</Text>
                  </TouchableOpacity>
                );
              } else {
                // This part is regular text
                return <Text key={index} style={styles.regularText}>{part}</Text>;
              }
            })}
          </View>
        );
      };

    const openMaps = () => {
        const formattedAddress = address.replace(/\s/g, '+');
        let url;
      
        // Check the platform and generate the appropriate URL for both platforms
        if (Platform.OS === 'android') {
          url = `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;
        } else if (Platform.OS === 'ios') {
          url = `http://maps.apple.com/?q=${formattedAddress}`;
        } else {
          console.warn('Unsupported platform');
          return;
        }
      
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
      };
    
      const handleAddressPress = () => {
        if  (address) {
            console.log("opened address :", address);
            // console.log("URL:", url);
            openMaps();
        }   else {
            console.warn('Location is not provided');
        }
    };

      const MainViewPage = () => {
        return(
            <LinearGradient {...PGStyling.linearGradient} style={ForEventMenu.screenLayout}>
              <View style={PGStyling.forContainer}>
                <TopBarCustom event={event}/> 
                <View style={inCRUDevent.theFrame}>
                  <Image source={{ uri: event.imageSource }} style={styles.image} />
                  <View style={styles.nameWlocation}>
                    <Text style={inCRUDevent.eventName}>{event.eventName}</Text>
                    <Text style={inCRUDevent.anotherTxt}>{event.selectedDate}</Text>
                  </View>
                  <View style={{flexDirection:'row', alignItems:'center', marginHorizontal:5}}>
                    <Ionicons name="location-outline" size={18} color="lightgrey"/>
                    <TouchableOpacity onPress={handleAddressPress}>
                    <Text style={[
                        inCRUDevent.anotherTxt, 
                        {   textDecorationLine:'underline',
                              marginVertical:3,
                            
                        }]}>{event.location}</Text>
                    </TouchableOpacity>
                      
                  </View>
                  <DescriptionWithInstagramLinks description={event.description} />
                  {/* <Text style={inCRUDevent.anotherTxt}>{event.description}</Text> */}
              </View>
            </View>
          </LinearGradient>
        )
      }
      

    return (
      <MainViewPage/>
    )
}

const TopBarCustom = ({event}) => {
  const [toEdit, setToEdit] = useState(true);

  // const { event} = route.params;
  const navigation = useNavigation()

  const handleGoBack = () => {
    navigation.goBack();
  };


  const handleDeleteEvent = async() => {
    const q = query(collection(db, 'newevent'), where('eventName', '==', event.eventName));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      if (doc.exists) {
        const eventId = doc.id;
        await deleteDoc(doc.ref);
        console.log(`Deleted document with ID: ${eventId}`);
        navigation.navigate('EventMenuPage')
      }
    });
  };


  

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <TouchableOpacity onPress={handleGoBack} >
        <MaterialIcons name="arrow-back-ios" size={20} color="#353535" marginLeft={7} />
      </TouchableOpacity>
      <Text style={styles.eventEdit}>Edit Event</Text>

      <View style={{ flexDirection: 'row', alignItems:'center' }}>
        <TouchableOpacity>
          <Feather name="edit" size={20} color="black" marginHorizontal={10}  />
        </TouchableOpacity>
        

        <TouchableOpacity onPress={handleDeleteEvent}> 
          <MaterialIcons name="delete" size={24} color='#353535' marginRight={5} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CRUDevent

const styles = StyleSheet.create({
    eventEdit:{
        color:'#353535',
        textAlign:'center',
        fontSize:18,
        fontWeight:'500',
        marginLeft:40,
    },
    nameWlocation: {
      flexDirection: 'row', 
      alignItems: 'center' ,
      justifyContent:'space-between',
      marginTop:10,
    },

    image: {
        
        alignSelf:'center',
        resizeMode: 'cover',
        borderRadius: 2,
        width: '100%', 
        height: 200,
    },  


    // for description only
    container: {
        flexDirection: 'row',
        flexWrap:'wrap',
        // borderWidth:0.5,
        borderColor:'#f1f1f1',
        borderRadius:5,
        // marginVertical:5,
        padding:5,
        
    },
    regularText: {
        // fontSize:13,
        marginLeft:5,
        color:'rgba(255, 255, 255, 0.8)',
        textAlign:'left',

        
    },
    instagramUsername: {
        // fontSize:13,
        color: 'rgba(205, 185, 255, 0.8)',
        textAlign:'left'
    },



})