import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, SafeAreaView, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    address: '',
    profilePicture: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const savedUserData = await AsyncStorage.getItem('userData');
      const status = await AsyncStorage.getItem('isLoggedIn');
      if (savedUserData) setUserData(JSON.parse(savedUserData));
      if (status === 'true') setIsLoggedIn(true);
    };
    checkLoginStatus();
  }, []);

  const handleSubmit = async () => {
    if (isLogin) {
      const savedUserData = await AsyncStorage.getItem('userData');
      if (savedUserData) {
        const parsedData = JSON.parse(savedUserData);
        if (userData.username === parsedData.username && userData.password === parsedData.password) {
          setIsLoggedIn(true);
          await AsyncStorage.setItem('isLoggedIn', 'true');
          Alert.alert('Success', 'Logged in successfully');
        } else {
          Alert.alert('Error', 'Invalid credentials');
        }
      }
    } else {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setIsLoggedIn(true);
      await AsyncStorage.setItem('isLoggedIn', 'true');
      Alert.alert('Success', 'Registration successful');
      setIsLogin(true);
    }
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setUserData({ username: '', password: '', firstName: '', lastName: '', email: '', contactNumber: '', address: '', profilePicture: '' });
    await AsyncStorage.removeItem('isLoggedIn');
  };

  const handleEdit = () => setIsEditing(true);
  const handleSaveChanges = async () => {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated');
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoggedIn ? (
        <ScrollView contentContainerStyle={styles.profileContainer}>
          <View style={styles.welcomeContainer}>
            <Image source={userData.profilePicture ? { uri: userData.profilePicture } : require('./assets/pfp.jpg')} style={styles.profilePicture} />
            <Text style={styles.welcomeText}>Welcome, {userData.firstName}!</Text>
            <View style={styles.detailsContainer}>
              {!isEditing ? (
                <>
                  {Object.entries(userData).map(([key, value]) => key !== 'profilePicture' && (
                    <Text style={styles.infoText} key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</Text>
                  ))}
                </>
              ) : (
                Object.entries(userData).map(([key, value]) => key !== 'profilePicture' && (
                  <TextInput
                    key={key}
                    style={styles.input}
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={value}
                    onChangeText={(text) => setUserData({ ...userData, [key]: text })}
                  />
                ))
              )}
            </View>
            <TouchableOpacity style={styles.button} onPress={isEditing ? handleSaveChanges : handleEdit}>
              <Text style={styles.buttonText}>{isEditing ? 'Save Changes' : 'Edit Profile'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.authContainer}>
          <Image source={require('./assets/logo.png')} style={styles.logo} />
          <View style={styles.formContainer}>
            <Text style={styles.title}>{isLogin ? 'Sign In' : 'Create Account'}</Text>
            {['username', 'password'].map((field, index) => (
              <TextInput
                key={index}
                style={styles.input}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={userData[field]}
                onChangeText={(text) => setUserData({ ...userData, [field]: text })}
                secureTextEntry={field === 'password'}
              />
            ))}
            <TouchableOpacity style={styles.mainButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>{isLogin ? 'Sign In' : 'Register'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin ? 'New here? Register' : 'Already have an account? Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F8' },
  profileContainer: { padding: 20, alignItems: 'center' },
  welcomeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 380,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
    alignItems: 'center',
  },
  profilePicture: { width: 140, height: 140, borderRadius: 70, marginBottom: 15, borderWidth: 3, borderColor: '#B0BEC5' },
  welcomeText: { fontSize: 26, fontWeight: 'bold', color: '#344955', marginBottom: 10 },
  detailsContainer: { width: '100%' },
  infoText: { fontSize: 18, marginBottom: 12, color: '#607D8B' },
  input: { height: 50, borderColor: '#B0BEC5', borderWidth: 1.5, borderRadius: 12, marginBottom: 15, paddingLeft: 16, backgroundColor: '#ECEFF1' },
  button: { backgroundColor: '#26A69A', padding: 14, borderRadius: 10, marginTop: 15, width: '100%' },
  logoutButton: { backgroundColor: '#FF5252', padding: 14, borderRadius: 10, marginTop: 10, width: '100%' },
  buttonText: { color: '#FFFFFF', textAlign: 'center', fontSize: 16, fontWeight: '600' },
  authContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  logo: { width: 180, height: 180, marginBottom: 40 },
  formContainer: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 25, width: '100%', maxWidth: 380, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 10 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#344955' },
  mainButton: { backgroundColor: '#00796B', padding: 16, borderRadius: 10, marginBottom: 20, width: '100%' },
  switchText: { color: '#00796B', textAlign: 'center', marginTop: 15, fontSize: 14 },
});
