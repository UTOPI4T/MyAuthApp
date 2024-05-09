import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, updateProfile, } from 'firebase/auth';
import {collection, addDoc, db,} from '../../firebaseAPI'


import { authGStyles } from './AuthGlobalStyling';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const auth = getAuth();

  const handleRegister = async () => {
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user.uid;

      // Update user profile with username
      await updateProfile(user, {
        displayName: username
        
      });

      // Add user data to Firestore collection
      const userData = {
        uid: user.uid,
        email: user.email,
        username: username
      };
      await addDoc(collection(db, 'userprofile'), userData);

      console.log('User registered successfully with username:', username);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={authGStyles.headingAuth}> Sign Up</Text>
      <Text style={authGStyles.subHeadingAuth}> Create a new account </Text>
      <View style={authGStyles.boxesAuth}>
        <TextInput
          placeholder='Username'
          placeholderTextColor='#f1f1f1'
          style={[authGStyles.inputAuth, { color: '#f1f1f1' }]}
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          placeholder='Email'
          placeholderTextColor='#f1f1f1'
          style={[authGStyles.inputAuth, { color: '#f1f1f1' }]}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          placeholder='Password'
          placeholderTextColor='#f1f1f1'
          secureTextEntry={true}
          style={[authGStyles.inputAuth, { color: '#f1f1f1' }]}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <View style={{ width: '80%', alignSelf: 'center', marginTop: 20, }}>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={authGStyles.btnAuth}> Sign up </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    margin: 15
  },
});
