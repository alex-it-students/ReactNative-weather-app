import React
    from "react";
import {
    Image,
    Text,
    View
} from "react-native";

const CurrentWeather = (props) => {
    const {
        city,
        temperature,
        weather,
        icon,
        styles
    } = props;

    return (
        <View
            style={styles.currentWeatherContainer}>
            <View
                style={styles.iconContainer}>
                <Image
                    style={styles.icon}
                    source={icon}/>
            </View>
            <View
                style={styles.textContainer}>
                <View>
                    <Text
                        style={styles.cityText}>{city}</Text>
                    <Text
                        style={styles.tempText}>{weather}</Text>
                    <Text
                        style={styles.tempText}>{temperature}&deg;C</Text>
                </View>
            </View>
        </View>
    )
}
export default CurrentWeather;