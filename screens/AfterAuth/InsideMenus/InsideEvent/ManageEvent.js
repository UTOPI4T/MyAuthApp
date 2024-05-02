import { StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Entypo, Ionicons } from '@expo/vector-icons';

import "firebase/firestore";
import { PGStyling } from '../../PGStyling'
import { ForEventMenu, ForManageEvent } from '../InsideGStyles'
import { query, where } from 'firebase/firestore';
import {collection, db, getDocs} from '../../../../firebaseAPI'
import { getAuth } from 'firebase/auth';

const ManageEvent = () => {
  const [newEventList, setNewEventList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getNewEvent = async () => {
    try {
      setRefreshing(true);
  
      // Get the Firebase authentication object
      const auth = getAuth();
  
      // Get information about the currently authenticated user
      const user = auth.currentUser;
  
      if (!user) {
        // If the user is not signed in, exit the function
        return;
      }
  
      // Get the UID of the currently authenticated user
      const userId = user.uid;
  
      // Create a query to fetch documents from the "newevent" collection for the authenticated user
      const q = query(collection(db, 'newevent'), where('userId', '==', userId));
  
      // Fetch data using the created query
      const querySnapshot = await getDocs(q);
  
      // Create an array to store the retrieved data
      const events = [];
  
      // Iterate through each document in the query result and add it to the events array
      querySnapshot.forEach((doc) => {
        events.push({
          ...doc.data(),
          id: doc.id,
        });
      });
  
      // Set the state with the obtained data
      setNewEventList(events);
    } catch (error) {
      console.error('Error fetching documents: ', error);
    } finally {
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    getNewEvent();
  }, []);
  
  const onRefresh = () => {
    getNewEvent();
  };
  

  return (
    <LinearGradient {...PGStyling.linearGradient} style={ForEventMenu.screenLayout}>
      <View style={ForManageEvent.forContainer}>
        <Text style={ForEventMenu.eventHeading}>Manage Event</Text>
        <View style={ForEventMenu.eventFlex}>
          <Text style={ForEventMenu.textGuide}> Manage your event by update, delete, etc.</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={ForEventMenu.textGuide}> Event Logs</Text>
            <Entypo name="chevron-thin-right" size={18} color="grey" />
          </View>
        </View>

        <ScrollView
          style={ForEventMenu.theFrame}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          
          {newEventList.length > 0 ? (
            newEventList.map(item => (
              <TouchableOpacity key={item.id} onPress={() => console.log(`Event ${item.id} pressed`)}>
                <View style={ForManageEvent.imageContainer}>
                  <Image source={{ uri: item.imageSource }} style={styles.image} />
                  <View style={ForManageEvent.textContainer}>
                    <Text style={ForManageEvent.eventName}>{item.eventName}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="location-outline" size={13} color="lightgrey"  marginRight={5}/>
                      <Text style={ForManageEvent.location}>{item.location}</Text>
                    </View>
                    <Text style={ForManageEvent.dTime}>{item.selectedDate}</Text>
                  </View>
                </View>
              </TouchableOpacity>
          
            ))
          ) : (
              <Text style={styles.noEvents}>No events available yet</Text>
          )}
          
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

export default ManageEvent;

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1, 
    // alignItems: 'center',
    // paddingBottom: 20,
  },
  noEvents: {
    fontSize:13,
    color:'#ABABAB',
    marginVertical:8,
    textAlign: 'center',
    
  },
  image: {
    alignSelf:'center',
    resizeMode: 'cover',
    borderRadius: 3,
    width: '100%', 
    height: 125,
},
});

