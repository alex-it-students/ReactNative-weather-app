import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
    Image
} from 'react-native';
import React, {useState, useEffect}
  from "react";
import * as Location from 'expo-location';

const API_KEY = "9727c2c6aae9af369bc61a39edbcdbac"


export default function App() {

  // state pour stocker la localisation
  const [location, setLocation] = useState({latitude:'', longitude:''});
  const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState('');
  useEffect(() => {
    // on demande les autorisations
    const getPermissions = async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }

      // on fetch les coordonnées et on les set dans le useState location
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude});
    };
    getPermissions()
        .then(() => console.log("permission granted"))
        .catch(error => console.log(error));

  }, [])

  useEffect( ()=>{
    if (location) {
      //on récupère la ville
      const getCity = async () => {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${location.latitude}&lon=${location.longitude}&limit=5&&appid=${API_KEY}`);
        const data = await response.json();
        data && data[0] &&
          await setCity(data[0].name);
      }
      //on récupère la météo actuelle
      const getCurrentWeather = async () => {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}`);
        const data = await response.json();
        data &&
          await setCurrentWeather(data);
      }
      getCity()
          .then(() => console.log(city))
          .catch(error => console.log(error));
      getCurrentWeather()
          .then(() => console.log(({currentWeather})))
          .catch(error => console.log(error));

    }
  }, [location])


  return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.currentWeatherContainer}>
          <View style={styles.iconContainer}>
            <Image style={styles.icon} source={{uri :`http://openweathermap.org/img/wn/${currentWeather.weather && currentWeather.weather[0].icon}.png`}}/>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cityText}>{city}</Text>
            <Text style={styles.tempText}>{currentWeather.main && (currentWeather.main.temp - 273.15).toFixed(1)}&deg;C</Text>
          </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  currentWeatherContainer:{
    flexDirection:'row',
    paddingTop:'35%'
  },
  iconContainer: {

  },
  icon:{
    height:160,
    width:160
  },
  textContainer: {
    justifyContent: 'center',
  },
  cityText:{
    fontSize:24,
    paddingBottom:30
  },
  tempText:{
    fontSize:20,
  }
});
