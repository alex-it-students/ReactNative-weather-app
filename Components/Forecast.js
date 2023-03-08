import React from "react";
import {FlatList, Image, Text, View} from "react-native";

const Forecast = (props) => {
    const {forecast, styles,title} = props

    return (
        <View style={styles.forecastContainer}>
            <View style={{flexDirection:'row', paddingTop:20, paddingHorizontal:20, justifyContent:'space-between', alignSelf:'center'}}>
                <Text style={{fontWeight:'bold'}}>5 Days Forecast ({title})</Text>
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
    )
}

export default Forecast