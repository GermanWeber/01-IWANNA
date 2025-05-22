import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, ScrollView} from 'react-native'

export default function Post() {
    const router = useRouter();

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View>
                    <TouchableOpacity style={styles.editButton} onPress={() => router.push('/(posts)/crear-post')}>
                        <Ionicons name="add" size={20} color="#fff" />
                        <Text style={styles.editButtonText}>Agregar Publicacion</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        minHeight: "100%",
        backgroundColor: "#fff"
    },
    container: {
        flex: 1,
        padding: 20,
    },
    editButton: {
        backgroundColor: '#8BC34A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,

    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    }
});