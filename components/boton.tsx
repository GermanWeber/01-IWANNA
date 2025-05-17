import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from 'react-native';

type Props = {
    titulo: string;
    onPress: (event: GestureResponderEvent) => void;
    ancho?: number | `${number}%`;
    deshabilitado?: boolean;
};

const Boton: React.FC<Props> = ({ titulo, onPress, ancho = '100%', deshabilitado = false }) => {
    return (
        <TouchableOpacity
            style={[styles.boton, { width: ancho }, deshabilitado && styles.deshabilitado]}
            onPress={onPress}
            disabled={deshabilitado}
        >
            <Text style={styles.texto}>{titulo}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    boton: {
        backgroundColor: '#8BC34A',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 45,
        alignItems: 'center',
        marginVertical: 8,
    },
    texto: {
        color: '#424242',
        fontSize: 16,
        fontWeight: '600',
    },
    deshabilitado: {
        backgroundColor: '#A3D9A5',
        opacity: 0.6,
    },
});

export default Boton;