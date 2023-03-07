import React
    from "react";
import {
    FlatList,
    Image,
    Pressable,
    Text,
    View
} from "react-native";



const Forecast = (props) => {
    const {
        forecast,
        styles
    } = props

    return (
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
    )
}

export default Forecast