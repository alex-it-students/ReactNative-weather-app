import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ImageBackground
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
  const [morningForecast, setMorningForecast] = useState([]);
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
        .then(()=> console.log(location))
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
        console.log(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}`)
        data &&
          await setCurrentWeather(data);
      }

      // on récupère les prévisions météo sur une heure précise
      const getMorningForecast = async () => {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}`);
        const data = await response.json();
        const filteredData = data.list.filter(item => item.dt_txt.includes('09:00:00'));
        filteredData &&
        await setMorningForecast(filteredData);
      }


      getCity()
          .then(() => console.log(city))
          .catch(error => console.log(error));

      getCurrentWeather()
          .then(() => console.log(({currentWeather})))
          .catch(error => console.log(error));

      getMorningForecast()
          .then(() => console.log(morningForecast))
          .catch(error => console.log(error));
    }
  }, [location])


  return (
<ImageBackground style={styles.backGroundImage} source={require('./assets/weather-app_wp.jpg')} resizeMode={"cover"}>
      <View style={styles.container}>
        <StatusBar style="auto" />


        <View style={styles.currentWeatherContainer}>

          <View style={styles.iconContainer}>
            <Image style={styles.icon} source={{uri :`http://openweathermap.org/img/wn/${currentWeather.weather && currentWeather.weather[0].icon}.png`}}/>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cityText}>{city}</Text>
            <Text style={styles.tempText}>{currentWeather.weather[0] && currentWeather.weather[0].main}</Text>
            <Text style={styles.tempText}>{currentWeather.main && (currentWeather.main.temp - 273.15).toFixed(1)}&deg;C</Text>
          </View>
        </View>


<View style={styles.forecastContainer}>
  <Text style={styles.titleForeCastContainer}>5 Days Forecast</Text>
  <FlatList
      horizontal={true}
      data={morningForecast}
      keyExtractor={(item) => item.dt.toString()}
      renderItem={({item}) => (
          <View style={styles.forecastItem}>
            <Text>{new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}</Text>
            <Image style={styles.foreCastIcon} source={{uri :`http://openweathermap.org/img/wn/${item.weather && item.weather[0].icon}.png`}}/>
            <Text>{(item.main.temp - 273.15).toFixed(1)}&deg;C</Text>
          </View>
      )}
  />
</View>


      </View>
  </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    height: '100%'
  },
  currentWeatherContainer:{
    flexDirection:'row',
    paddingTop:'40%'
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
    fontSize:24
  },
  tempText:{
    fontSize:20
  },
  foreCastIcon:{
    height:80,
    width:80
  },
  forecastContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    height:'22%',
    marginTop:'15%'
  },
  forecastItem: {
    alignItems: 'center',
    paddingHorizontal:20,
    paddingTop:20
  },
  backGroundImage:{
    height:'100%',
    width:'100%'
  },
  titleForeCastContainer:{
    paddingTop:20,
    paddingHorizontal:20,
    fontWeight:'bold'
  }
});
