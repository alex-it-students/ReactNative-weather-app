import {
    StatusBar
} from 'expo-status-bar';
import {
    StyleSheet,
    View,
    ImageBackground,
    Text,
    TouchableOpacity
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
    const [morningForecast, setMorningForecast] = useState([]);
    const [noonForecast, setNoonForecast] = useState([]);
    const [eveningForecast, setEveningForecast] = useState([]);
    const [forecastTime, setForecastTime] = useState("Morning");

    const handleForecastToggle = (forecastTime) => {
        setForecastTime(forecastTime);
    };

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
            .then(location && ((location) => console.log(location)))
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
                const morningData = data.list && data.list.filter(item => item.dt_txt.includes('09:00:00'));
                const noonData = data.list && data.list.filter(item => item.dt_txt.includes('12:00:00'));
                const eveningData = data.list && data.list.filter(item => item.dt_txt.includes('21:00:00'));
                data &&
                await setMorningForecast(morningData);
                await setNoonForecast(noonData);
                await setEveningForecast(eveningData);
            }

            getCurrentWeather().then(() => console.log("current weather fetched")).catch((error) => console.log(error));
            getForecast().then(() => console.log("forecast fetched")).catch((error) => console.log(error));

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

                <View
                    style={{paddingTop: '15%'}}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            height: 30,
                            backgroundColor: 'rgba(255, 255, 255, 0.55)',
                            padding: 5,
                            borderRadius: 10
                        }}>
                        <TouchableOpacity
                            title="Morning"
                            onPress={() => handleForecastToggle("Morning")}>
                            <Text
                                style={styles.menuContainer}>Morning</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            title="Noon"
                            onPress={() => handleForecastToggle("Noon")}>
                            <Text
                                style={styles.menuContainer}>Noon</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            title="Evening"
                            onPress={() => handleForecastToggle("Evening")}>
                            <Text
                                style={styles.menuContainer}>Evening</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {forecastTime === "Morning" && (
                    <Forecast
                        forecast={morningForecast}
                        styles={styles}
                        title={forecastTime}/>
                )}

                {forecastTime === "Noon" && (
                    <Forecast
                        forecast={noonForecast}
                        styles={styles}
                        title={forecastTime}/>
                )}
                {forecastTime === "Evening" && (
                    <Forecast
                        forecast={eveningForecast}
                        styles={styles}
                        title={forecastTime}/>
                )}
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
        marginTop: 15
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
    },
    menuContainer: {
        paddingHorizontal: 5,
        fontWeight: 'bold'
    }
});
