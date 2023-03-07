import {
    StatusBar
} from 'expo-status-bar';
import {
    StyleSheet,
    View,
    ImageBackground,
} from 'react-native';
import React, {
    useState,
    useEffect
} from "react";
import * as Location
    from 'expo-location';
import CurrentWeather
    from "./Components/CurrentWeather";
import Forecast
    from "./Components/Forecast";

const API_KEY = "a1b37adc02b1b507b4f930f80d69524a"

export default function App() {

    // state pour stocker la localisation
    const [location, setLocation] = useState({
        latitude: '',
        longitude: ''
    });
    const [currentWeather, setCurrentWeather] = useState({});
    const [forecast, setForecast] = useState([]);
    const [forecastTime, setForeCastTime] = useState({
        'Morning': '09:00:00',
        'Noon': '12:00:00',
        'Evening': '21:00:00'
    });

    useEffect(() => {
        // on déclare la méthode pour récupérer les autorisations
        const getPermissions = async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission denied');
                return;
            }

            // on fetch les coordonnées et on les set dans le useState location
            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude
            });
        };

        //on appelle la méthode
        getPermissions()
            .then(() => console.log("permission granted"))
            .then(location && (() => console.log(location)))
            .catch(error => console.log(error));
    }, [])

    useEffect(() => {
        if (location) {

            //on récupère la météo actuelle
            const getCurrentWeather = async () => {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric`);
                const data = await response.json();
                data &&
                await setCurrentWeather(data);
            }

            // on récupère les prévisions météo sur une heure précise
            const getForecast = async () => {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric`);
                const data = await response.json();
                const filteredData = data.list && data.list.filter(item => item.dt_txt.includes(forecastTime.Noon));
                filteredData &&
                console.log(filteredData)
                await setForecast(filteredData);
            }

            getCurrentWeather().then().catch();
            getForecast().then().catch();

        }
    }, [location])

    return (
        <ImageBackground
            style={styles.backGroundImage}
            source={require('./assets/weather-app_wp.jpg')}
            resizeMode={"cover"}>
            <View
                style={styles.container}>
                <StatusBar
                    style="auto"/>
                {currentWeather.main && currentWeather.weather[0] && (
                    <CurrentWeather
                        icon={{uri: `https://openweathermap.org/img/wn/${currentWeather.weather && currentWeather.weather[0].icon}@4x.png`}}
                        city={currentWeather.name}
                        weather={currentWeather.weather[0].main}
                        temperature={(currentWeather.main.temp).toFixed(1)}
                        styles={styles}
                    />
                )}
                <Forecast
                    forecast={forecast}
                    styles={styles}/>
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
    currentWeatherContainer: {
        flexDirection: 'row',
        paddingTop: '45%'
    },
    iconContainer: {},
    icon: {
        height: 160,
        width: 160
    },
    textContainer: {
        justifyContent: 'center',
    },
    cityText: {
        fontSize: 24
    },
    tempText: {
        fontSize: 20
    },
    foreCastIcon: {
        height: 80,
        width: 80
    },
    forecastContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.55)',
        height: '25%',
        marginTop: '20%'
    },
    forecastItem: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20
    },
    backGroundImage: {
        height: '100%',
        width: '100%'
    },
    titleForeCastContainer: {
        paddingTop: 20,
        paddingHorizontal: 20,
        fontWeight: 'bold'
    }
});
