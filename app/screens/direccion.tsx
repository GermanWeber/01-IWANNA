import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert,} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef} from 'react-native-google-places-autocomplete';
import { API_GOOGLEMAP } from '@env';
import MapView, { Marker } from 'react-native-maps';
import { guardarStorage, recuperarStorage } from '../../services/asyncStorage';


export default function DireccionScreen() {
    const router = useRouter();

    const [direccion, setDireccion] = useState<InterfaceDireccion | null>(null);
    const [region, setRegion] = useState({
        latitude: -33.4489,
        longitude: -70.6693,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });
    const autoCompleteRef = useRef<GooglePlacesAutocompleteRef | null>(null);
    const [refReady, setRefReady] = useState(false);

    const manejarDireccion = (direccion: InterfaceDireccion) => {
        setDireccion(direccion);
        setRegion({
            latitude: direccion.latitud,
            longitude: direccion.longitud,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });
    };
    
    const guardarDireccion = () =>{
        if (direccion) {
            guardarStorage("direccion", direccion);
            router.back()
        } else {
            Alert.alert(
            "Error",
            "No se ha seleccionado ninguna dirección.",
            [{ text: "OK" }]
        );
        }
    }
    
    useEffect(() => {
        const cargarUsuario = async () => {
            try {
                const datos = await recuperarStorage('direccion');
                if (datos) {
                    setDireccion(datos);
                    setRegion({
                        latitude: datos.latitud,
                        longitude: datos.longitud,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    });
                }
            } catch (error) {
                console.error('Error al cargar usuario:', error);
            }
        };
        cargarUsuario();
    }, []);
    
    useEffect(() => {
        if (autoCompleteRef.current) {
            setRefReady(true);
        }
    }, [autoCompleteRef.current]);

    // Cuando el ref esté listo y tengamos dirección, setear texto en input
    useEffect(() => {
        if (refReady && direccion) {
            setTimeout(() => {
                autoCompleteRef.current?.setAddressText(direccion.descripcion);
            }, 100);
        }
    }, [refReady, direccion]);
    
    return (
    <View style={styles.container}>
        <View>
            <GooglePlacesAutocomplete
                ref={autoCompleteRef}
                placeholder="Escribe tu dirección"
                fetchDetails={true}
                enablePoweredByContainer={false}
                onPress={(data, details = null) => {
                    if (!details) return;

                    const direccion = {
                    descripcion: data.description,
                    latitud: details.geometry.location.lat,
                    longitud: details.geometry.location.lng,
                    };

                    manejarDireccion(direccion);
                }}
                query={{
                    key: API_GOOGLEMAP,
                    language: 'es',
                    components: 'country:cl',
                }}
                styles={autocompleteStyles}
            />
        </View>

        {/* MAPA */}
        <View style={styles.containerMap}>
            <MapView
                style={styles.map}
                region={region}
            >
                <Marker
                coordinate={{ latitude: region.latitude, longitude: region.longitude }}
                />
            </MapView>
        </View>
        
        {/* Botones de Guardar y Cancelar */}
        <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                <Ionicons name="close-circle-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={guardarDireccion}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff"/>
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
    containerMap: {
        flex: 1,
        marginVertical: 50,
    },
    map: {
        flex: 1,
    },
});

const autocompleteStyles = {
    textInputContainer: {
        zIndex: 10,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#4CAF50',
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    listView: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginTop: 10,
        zIndex: 1000,
        elevation: 10,
        position: 'absolute',
        top: 60,
    },
    row: {
        padding: 12,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    description: {
        fontSize: 14,
        color: '#333',
    },

};
