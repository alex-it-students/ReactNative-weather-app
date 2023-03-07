import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ImageBackground,
  Pressable
} from 'react-native';
import React, {useState, useEffect}
  from "react";
import * as Location from 'expo-location';
import CurrentWeather
  from "./Components/CurrentWeather";

const API_KEY = "a1b37adc02b1b507b4f930f80d69524a"

export default function App() {

  // state pour stocker la localisation
  const [location, setLocation] = useState({latitude:'', longitude:''});
  const [currentWeather, setCurrentWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [forecastTime, setForeCastTime] = useState({'Morning': '09:00:00','Noon': '12:00:00','Evening': '21:00:00'});

  useEffect(() => {
    // on déclare la méthode pour récupérer les autorisations
    const getPermissions = async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
/*        console.log('Permission denied');*/
        return;
      }

      // on fetch les coordonnées et on les set dans le useState location
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude});
    };

    //on appelle la méthode
    getPermissions()
        .then(() => console.log("permission granted"))
      .then(()=> console.log(location))
        .catch(error => console.log(error));
  }, [])


  useEffect( ()=>{
    if (location) {

      //on récupère la météo actuelle
      const getCurrentWeather = async () => {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
/*        console.log(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric`)*/
        data &&
        await setCurrentWeather(data);
      }

      // on récupère les prévisions météo sur une heure précise
      const getForecast = async () => {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        const filteredData = data.list.filter(item => item.dt_txt.includes(forecastTime.Noon));
        filteredData &&
        console.log(filteredData)
        await setForecast(filteredData);
      }

      getCurrentWeather().then().catch();

      getForecast(forecastTime.Morning).then(response => console.log(response)).catch(error=>console.log(error));

    }
  }, [location])


  return (
<ImageBackground style={styles.backGroundImage} source={require('./assets/weather-app_wp.jpg')} resizeMode={"cover"}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        {currentWeather.main && currentWeather.weather[0] && (
            <CurrentWeather
                icon={{uri: `https://openweathermap.org/img/wn/${currentWeather.weather && currentWeather.weather[0].icon}@4x.png`}}
                city={currentWeather.name}
                weather={currentWeather.weather[0].main}
                temperature={(currentWeather.main.temp).toFixed(1)}
                styles={styles}
            />
        )}

        {/*<View
            style={styles.currentWeatherContainer}>
          <View
              style={styles.iconContainer}>
            <Image
                style={styles.icon}
                source={{uri: `https://openweathermap.org/img/wn/${currentWeather.weather && currentWeather.weather[0].icon}@4x.png`}}/>
          </View>
          <View
              style={styles.textContainer}>
            {currentWeather.main && (
                <View>
                  <Text
                      style={styles.cityText}>{currentWeather.name}</Text>
                  <Text
                      style={styles.tempText}>{currentWeather.weather[0].main}</Text>
                  <Text
                      style={styles.tempText}>{(currentWeather.main.temp).toFixed(1)}&deg;C</Text>
                </View>
            )}
          </View>
        </View>*/}

<View style={styles.forecastContainer}>
  <View style={{flexDirection:'row', paddingTop:30, paddingHorizontal:20, justifyContent:'space-between'}}>
    <Text style={{fontWeight:'bold'}}>5 Days Forecast </Text>
    <View style={{flexDirection:'row'}}>
      <Pressable style={{paddingHorizontal:5}} ><Text>Morning</Text></Pressable>
      <Pressable style={{paddingHorizontal:5}} ><Text>Noon</Text></Pressable>
      <Pressable style={{paddingHorizontal:5}} ><Text>Evening</Text></Pressable>
    </View>
  </View>

  <FlatList
      horizontal={true}
      data={forecast}
      keyExtractor={(item) => item.dt.toString()}
      renderItem={({item}) => (
          <View style={styles.forecastItem}>
            <Text>{new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'short', day:'2-digit' })}</Text>
            <Text>{new Date(item.dt_txt).getHours()}:00</Text>
            <Image style={styles.foreCastIcon} source={{uri :`http://openweathermap.org/img/wn/${item.weather && item.weather[0].icon}@4x.png`}}/>
            <Text>{(item.main.temp ).toFixed(1)}&deg;C</Text>
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
    height:'25%',
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
