import { useEffect, useState } from 'react';
import { ImageBackground, Pressable, ScrollView, Text, TextInput, View, ViewStyle } from 'react-native';
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
            flex: 1,
            marginHorizontal: 0,
            borderRadius: 15,
            padding: 0,
            overflow: 'hidden',
        } as ViewStyle,
        cardContent: {
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
            color: "white",
            fontWeight: "bold",
            textShadowColor: 'black',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 2,
        } as ViewStyle,
        locationTitle: {
            fontSize: 15,
            textAlign: "left",
            color: "white",
            fontWeight: "bold",
            textShadowColor: 'black',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 2,
        } as ViewStyle,
        remarksText: {
            fontSize: 10,
            textAlign: "left",
            color: "white",
            fontWeight: "bold",
            textShadowColor: 'black',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 2,
        } as ViewStyle,
        temperatureContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
        } as ViewStyle,
        temperatureSign: {
            fontSize: 30,
            color: "white",
            textShadowColor: 'black',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 2,
        } as ViewStyle,
        temperatureText: {
            fontSize: 50,
            color: "white",
            textShadowColor: 'black',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 2,
        } as ViewStyle,
        image: {
            flex: 1,
            justifyContent: 'center',
            borderRadius: 15,
            overflow: 'hidden',
            padding: 15
        } as ViewStyle,
    };
    const [location, setLocation] = useState<Location.LocationObject>();
    const [address, setAddress] = useState<Location.LocationGeocodedAddress>();
    const [currentLocationWeatherData, setCurrentLocationWeatherData] = useState<CurrentLocationWeatherData>();
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
            if (address?.city && newWeatherLocationIndex[address.city]) {
                let newCurrentLocationWeatherData: CurrentLocationWeatherData = {
                    name: address.city,
                    temperatureData: allWeatherData.temperature.data[newWeatherLocationIndex[address.city]],
                    humidityData: allWeatherData.humidity.data[0]
                }
                setCurrentLocationWeatherData(newCurrentLocationWeatherData)
            } else if (address?.city) {
                let newCurrentLocationWeatherData: CurrentLocationWeatherData = {
                    name: address.city,
                    temperatureData: allWeatherData.temperature.data[1],
                    humidityData: allWeatherData.humidity.data[0]
                }
                setCurrentLocationWeatherData(newCurrentLocationWeatherData)
            }
        }
    }, [allWeatherData, address])
    const imageList = [require('../assets/images/noaa-UJsUJr3cgEM-unsplash.jpeg'),
    require('../assets/images/neda-astani-KWTkd7mHqKE-unsplash.jpeg'),
    require('../assets/images/kenrick-mills-1h2Pg97SXfA-unsplash.jpg'),
    require('../assets/images/valentin-muller-bWtd1ZyEy6w-unsplash.jpeg')]
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
                        setOverlayVisible(true)
                    }}
                >
                    <View>
                        <Card wrapperStyle={styles.cardWrapper} containerStyle={styles.cardContainer}>
                            <ImageBackground source={imageList[3]} resizeMode="cover" style={styles.image}>
                                <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: "row", justifyContent: "space-between" }} >
                                    <View>
                                        <Text style={styles.locationTitle}>
                                            我的位置
                                        </Text>
                                        <Text style={styles.locationText}>
                                            {
                                                (address?.city) ? address?.city : "Loading"
                                            }
                                        </Text>
                                    </View>
                                    {
                                        address?.city && currentLocationWeatherData !== undefined ? (
                                            <View style={styles.temperatureContainer}>
                                                <Text style={styles.temperatureText}>
                                                    {currentLocationWeatherData.temperatureData.value}
                                                </Text>
                                                <Text style={styles.temperatureSign}>
                                                    °{currentLocationWeatherData.temperatureData.unit}
                                                </Text>
                                            </View>
                                        ) : null
                                    }
                                </View>
                                <Text style={styles.remarksText}>
                                    {
                                        address?.city && weatherLocationIndex[address?.city] ? null :
                                            ("該區沒有測量站，取香港天文台紀錄作平均值")
                                    }
                                </Text>
                            </ImageBackground>
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
                                <ImageBackground source={imageList[index % 4]} resizeMode="cover" style={styles.image}>
                                    <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: "row", justifyContent: "space-between" }} >
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
                                    </View>
                                </ImageBackground>
                            </Card>
                        );
                    })}
                </View>
            </ScrollView>
            {
                isOverlayVisible && currentLocationWeatherData !== undefined ? (
                    <LocationWeatherDetail isVisible={isOverlayVisible} onCloseBottomSheet={() => setOverlayVisible(false)} currentLocationWeatherData={currentLocationWeatherData} />
                ) : null
            }
        </View >
    );
}

