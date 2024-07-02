import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchBar } from '@rneui/themed';

export default function Index() {
    const insets = useSafeAreaInsets();
    const [text, onChangeText] = useState('');
    const styles = {
        container: {
            flex: 1,
            paddingTop: insets.top + 15,
            paddingHorizontal: 15,
            backgroundColor: "#dae8ef",
        },
        textInput: {
            backgroundColor: "#ffffff",
            fontSize: 20,
            padding: 10,
        },
        text: {
            fontSize: 20,
        }
    };
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
                    backgroundColor: "#dae8ef",
                    borderBottomColor: 'transparent',
                    borderTopColor: 'transparent',
                }}
            />
        </View >
    );
}

