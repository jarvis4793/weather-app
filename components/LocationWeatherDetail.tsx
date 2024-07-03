import { BottomSheet, ListItem } from "@rneui/base";
import { Button, Icon, Overlay } from "@rneui/themed";
import { useState } from "react";
import { Pressable } from "react-native";
import { Alert, Modal, StyleSheet, View, Text } from "react-native";

type LocationWeatherDetailProps = {
    isVisible: boolean;
    onCloseBottomSheet: () => void;
}

export default function LocationWeatherDetail({ isVisible, onCloseBottomSheet }: LocationWeatherDetailProps) {
    const list = [
        { title: 'List Item 1' },
        { title: 'List Item 2' },
        {
            title: 'Cancel',
            containerStyle: { backgroundColor: 'red' },
            titleStyle: { color: 'white' },
            onPress: onCloseBottomSheet,
        },
    ];
    return (
        <BottomSheet isVisible={isVisible} onBackdropPress={onCloseBottomSheet}>
            {list.map((l, i) => (
                <ListItem
                    key={i}
                    containerStyle={l.containerStyle}
                    onPress={l.onPress}
                >
                    <ListItem.Content>
                        <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            ))}
        </BottomSheet>
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