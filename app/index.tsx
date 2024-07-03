import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchBar } from '@rneui/themed';
import { fetchPublic } from '@/api/fetch';
import { useQuery } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { Card } from '@rneui/base';
import LocationWeatherDetail from '@/components/LocationWeatherDetail';


type WeatherLocationIndex = {
    [key: string]: number;
};
export default function Index() {
    const insets = useSafeAreaInsets();
    const [text, onChangeText] = useState('');
    const [isOverlayVisible, setOverlayVisible] = useState(false);
    const [weatherLocationIndex, setWeatherLocationIndex] = useState<WeatherLocationIndex>({});
    const styles = {
        container: {
            flex: 1,
            paddingTop: insets.top + 15,
            paddingHorizontal: 30,
            backgroundColor: "#d9e9ee",
        } as ViewStyle,
        textInput: {
            backgroundColor: "#ffffff",
            fontSize: 20,
            padding: 10,
        } as ViewStyle,
        text: {
            fontSize: 20,
            borderTopWidth: 10,
            borderBottomWidth: 10,
        } as ViewStyle,
        cardContainer: {
            marginHorizontal: 0,
            borderRadius: 10,
        } as ViewStyle,
        cardWrapper: {
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between"
        } as ViewStyle,
        locationText: {
            fontSize: 20,
            textAlign: "left",
        } as ViewStyle,
        temperatureContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
        } as ViewStyle,
        temperatureSign: {
            fontSize: 30,
        } as ViewStyle,
        temperatureText: {
            fontSize: 50,
        } as ViewStyle
    };

    const [location, setLocation] = useState<Location.LocationObject>();
    const [address, setAddress] = useState<Location.LocationGeocodedAddress>();
    const {
        data: allWeatherData,
        isLoading: isAllWeatherData,
        error: errorAllWeatherData,
        refetch,
    } = useQuery({
        queryKey: [`https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=tc
`, "/", "get"],
        queryFn: async ({ queryKey }) =>
            await fetchPublic(queryKey[0], queryKey[1], queryKey[2])
    });

    const reverseGeocode = async () => {
        if (location?.coords.longitude !== undefined && location?.coords.latitude !== undefined) {
            const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
                longitude: location?.coords.longitude,
                latitude: location?.coords.latitude
            })
            console.log("ReverseGeocoded:");
            console.log(reverseGeocodedAddress);
            if (reverseGeocodedAddress[0] != null) {
                setAddress(reverseGeocodedAddress[0]);
            }
        }
    }

    useEffect(() => {
        const getPermissions = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Please grant location permissions");
                return;
            }
            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
            console.log("location: ");
            console.log(currentLocation);
        }
        getPermissions();
    }, []);
    useEffect(() => {
        reverseGeocode();
    }, [location]);

    useEffect(() => {
        if (allWeatherData) {
            let newWeatherLocationIndex: { [key: string]: number } = {};
            {
                allWeatherData?.temperature.data.map((temperatureData: TemperatureData, index: number) => {
                    newWeatherLocationIndex[temperatureData.place] = index;
                })
            }
            setWeatherLocationIndex(newWeatherLocationIndex);
            console.log("newWeatherLocationIndex: ");
            console.log(newWeatherLocationIndex);
        }
    }, [allWeatherData, location])
    return (
        <View style={styles.container}>
            <Text style={styles.text}>香港各區氣溫</Text>
            <SearchBar
                placeholder='搜索地區'
                onChangeText={onChangeText}
                value={text}
                lightTheme={true}
                round={true}
                containerStyle={{
                    padding: 0,
                    backgroundColor: "#d9e9ee",
                    borderBottomColor: 'transparent',
                    borderTopColor: 'transparent',
                }}
                inputContainerStyle={{
                    backgroundColor: "#ffffff",
                }}
            />
            <ScrollView>
                <Pressable
                    onPress={() => {
                        console.log("pressed")
                        setOverlayVisible(true)
                    }}
                >
                    <View>
                        <Card wrapperStyle={styles.cardWrapper} containerStyle={styles.cardContainer}>
                            <View>
                                <Text>
                                    {"我的位置"}
                                </Text>
                                <Text style={styles.locationText}>
                                    {
                                        (address?.city) ? address?.city : "Loading"
                                    }
                                </Text>
                            </View>
                            {
                                address?.city && weatherLocationIndex[address?.city] !== undefined && allWeatherData !== null ? (
                                    <View style={styles.temperatureContainer}>
                                        <Text style={styles.temperatureText}>
                                            {allWeatherData.temperature.data[weatherLocationIndex[address?.city]].value}
                                        </Text>
                                        <Text style={styles.temperatureSign}>
                                            ° {allWeatherData.temperature.data[weatherLocationIndex[address?.city]].unit}
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={styles.temperatureContainer}>
                                        <Text style={styles.temperatureText}>
                                            {allWeatherData?.temperature.data[1].value}
                                        </Text>
                                        <Text style={styles.temperatureSign}>
                                            °{allWeatherData?.temperature.data[1].unit}
                                        </Text>
                                    </View>)
                            }
                        </Card>
                    </View>
                </Pressable>


                <View>
                    {allWeatherData?.temperature.data.map((temperatureData: TemperatureData, index: number) => {

                        if (temperatureData.place === address?.city) {
                            return null
                        }
                        if (text !== "" && !temperatureData.place.includes(text)) {
                            return null
                        }
                        return (
                            <Card key={index} wrapperStyle={styles.cardWrapper} containerStyle={styles.cardContainer}>
                                <View>
                                    <Text style={styles.locationText}>
                                        {temperatureData.place}
                                    </Text>
                                </View>
                                <View style={styles.temperatureContainer}>
                                    <Text style={styles.temperatureText}>
                                        {temperatureData.value}
                                    </Text>
                                    <Text style={styles.temperatureSign}>
                                        °{temperatureData.unit}
                                    </Text>
                                </View>
                            </Card>
                        );
                    })}
                </View>
            </ScrollView>
            {isOverlayVisible && (
                <LocationWeatherDetail isVisible={isOverlayVisible} onCloseBottomSheet={() => setOverlayVisible(false)} />
            )}
        </View >
    );
}

