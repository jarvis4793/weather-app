import { Button, Icon, Overlay } from "@rneui/themed";
import { useState } from "react";
import { Pressable } from "react-native";
import { Alert, Modal, StyleSheet, View, Text } from "react-native";

type LocationWeatherDetailProps = {
    isVisible: boolean;
    onCloseOverlay: () => void;
}

export default function LocationWeatherDetail({ isVisible, onCloseOverlay }: LocationWeatherDetailProps) {
    return (<Overlay isVisible={isVisible} onBackdropPress={onCloseOverlay}>
        <Text style={styles.textPrimary}>Hello!</Text>
        <Text style={styles.textSecondary}>
            Welcome to React Native Elements
        </Text>
        <Button
            icon={
                <Icon
                    name="wrench"
                    type="font-awesome"
                    color="white"
                    size={25}
                    iconStyle={{ marginRight: 10 }}
                />
            }
            title="Start Building"
            onPress={onCloseOverlay}
        />
    </Overlay>
    );
};

const styles = StyleSheet.create({
    button: {
        margin: 10,
    },
    textPrimary: {
        marginVertical: 20,
        textAlign: 'center',
        fontSize: 20,
    },
    textSecondary: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 17,
    },
});