import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity,} from 'react-native';
import DireccionInput from '../../../../components/direccionInput';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
export default function DireccionScreen() {
const router = useRouter();

const manejarDireccion = (direccion: {
    descripcion: string;
    latitud: number;
    longitud: number;
}) => {
    // Podrías enviar esta info de vuelta por un contexto, un store, o deep linking
    console.log('Dirección seleccionada:', direccion);
    router.back(); // volver al perfil
};

return (
    <View style={styles.container}>
        <DireccionInput onDireccionSeleccionada={manejarDireccion} />
        {/* Botones de Guardar y Cancelar */}
        <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => router.push('/(perfil_usuario)/mi-perfil')}>
            <Ionicons name="close-circle-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
        </View>
    </View>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8BC34A',
        padding: 15,
        borderRadius: 10,
        justifyContent: 'center',
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E53935',
        padding: 15,
        borderRadius: 10,
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});
