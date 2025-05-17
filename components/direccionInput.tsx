import 'react-native-get-random-values';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { API_GOOGLEMAP } from '@env';

interface DireccionInputProps {
onDireccionSeleccionada: (direccion: {
    descripcion: string;
    latitud: number;
    longitud: number;
}) => void;
}

const DireccionInput: React.FC<DireccionInputProps> = ({ onDireccionSeleccionada }) => {
return (
    <View style={styles.container}>
        <GooglePlacesAutocomplete
            placeholder="Escribe tu dirección"
            fetchDetails={true}
            onPress={(data, details = null) => {
                if (!details) return;
                const direccion = {
                descripcion: data.description,
                latitud: details.geometry.location.lat,
                longitud: details.geometry.location.lng,
                };
                onDireccionSeleccionada(direccion);
            }}
            query={{
                key: API_GOOGLEMAP,
                language: 'es',
                components: 'country:cl',
            }}
            styles={{
                textInputContainer: {
                width: '100%',
                },
                textInput: {
                height: 44,
                fontSize: 16,
                },
            }}
            />
    </View>
);
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    paddingTop: 10,
},
});

export default DireccionInput;