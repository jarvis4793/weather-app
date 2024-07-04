import { BottomSheet, Card, ListItem } from "@rneui/base";
import { Button, Icon, Overlay } from "@rneui/themed";
import { useState } from "react";
import { ImageBackground, Pressable, ViewStyle } from "react-native";
import { Alert, Modal, StyleSheet, View, Text } from "react-native";

type LocationWeatherDetailProps = {
    isVisible: boolean;
    onCloseBottomSheet: () => void;
    currentLocationWeatherData: CurrentLocationWeatherData;
}

export default function LocationWeatherDetail({ isVisible, onCloseBottomSheet, currentLocationWeatherData }: LocationWeatherDetailProps) {
    return (
        <BottomSheet isVisible={isVisible} onBackdropPress={onCloseBottomSheet} containerStyle={styles.bottomSheet} >
            <View>
                <ImageBackground source={require('../assets/images/valentin-muller-bWtd1ZyEy6w-unsplash.jpeg')} resizeMode="cover" style={styles.image}>
                    <Text style={styles.text}>{currentLocationWeatherData.name}</Text>
                    <Card wrapperStyle={styles.cardWrapper} containerStyle={styles.cardContainer}>
                        <View>
                            <Text style={styles.locationText}>
                                現時氣溫
                            </Text>
                        </View>
                        <View style={styles.temperatureContainer}>
                            <Text style={styles.temperatureText}>
                                {currentLocationWeatherData.temperatureData.value}
                            </Text>
                            <Text style={styles.temperatureSign}>
                                °{currentLocationWeatherData.temperatureData.unit}
                            </Text>
                        </View>
                    </Card>
                    <Card wrapperStyle={styles.cardWrapper} containerStyle={styles.cardContainer}>
                        <View>
                            <Text style={styles.locationText}>
                                降雨機率
                            </Text>
                        </View>
                        <View style={styles.temperatureContainer}>
                            <Text style={styles.temperatureText}>
                                {currentLocationWeatherData.humidityData.value}
                            </Text>
                            <Text style={styles.temperatureSign}>
                                %
                            </Text>

                        </View>
                    </Card>
                </ImageBackground>
            </View>
        </BottomSheet >
    );
};

const styles = StyleSheet.create({
    textInput: {
        backgroundColor: "#ffffff",
        fontSize: 20,
        padding: 10,
    },
    text: {
        fontSize: 30,
        borderTopWidth: 10,
        borderBottomWidth: 10,
        color: "white",
        fontWeight: "bold",
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 2,
        marginHorizontal: 20,

    },
    cardContainer: {
        marginHorizontal: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    cardWrapper: {
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between"
    },
    locationText: {
        fontSize: 20,
        textAlign: "left",
    },
    temperatureContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    temperatureSign: {
        fontSize: 30,
    },
    temperatureText: {
        fontSize: 50,
    },
    bottomSheet: {
        // paddingHorizontal: 30,
        // paddingBottom: 30,
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        borderRadius: 15,
        overflow: 'hidden',
        padding: 15
    }
});