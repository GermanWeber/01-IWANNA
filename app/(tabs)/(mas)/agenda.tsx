import { View, StyleSheet, ScrollView, Text } from 'react-native';


export default function Agenda() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text>agenda</Text>
                
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
    },
});