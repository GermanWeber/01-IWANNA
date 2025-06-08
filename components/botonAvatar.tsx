import React from 'react';
import { TouchableOpacity, Text, View, Image, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BUCKET_URL } from '@env';

type Props = {
    textoBoton?: string;
    textoProfesion?: string;
    colorTexto?: string;
    colorTextoProfesion?: string;
    bgColor?: string;
    onPress: () => void;
    iconoDerecha?: any;
    colorIconoDerecha?: string;
    avatar?: any;
    id_auth?: number;
};

const BotonAvatar: React.FC<Props> = ({
    textoBoton,
    textoProfesion,
    colorTexto = '#2C3E50',
    colorTextoProfesion = '#7F8C8D',
    bgColor = '#FFFFFF',
    onPress,
    iconoDerecha = 'chevron-forward',
    colorIconoDerecha = '#00BCD4',
    avatar = require('../assets/images/perfil.png'),
    id_auth
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.boton, { backgroundColor: bgColor }]}
            onPress={onPress}
        >
            <View style={styles.contenidoBoton}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: `${BUCKET_URL}foto-perfil/${avatar}` }}
                        style={styles.avatar}
                        resizeMode="cover"
                    />
                    <View style={styles.textContainer}>
                        <Text style={[styles.nombre, { color: colorTexto }]} numberOfLines={1}>
                            {textoBoton}
                            {/*logo de verificado */}
                            {id_auth === 2 && (
                                <Ionicons name="checkmark-circle" size={20} color="#1d9bf0" />
                            )}
                        </Text>
                        {textoProfesion && (
                            <Text 
                                style={[styles.profesion, { color: colorTextoProfesion }]} 
                                numberOfLines={1}
                            >
                                {textoProfesion}
                            </Text>
                        )}
                    </View>
                </View>
                <Ionicons 
                    name={iconoDerecha} 
                    size={20} 
                    color={colorIconoDerecha} 
                    style={styles.icono} 
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    boton: {
        marginVertical: 8,
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#EDF2F7',
    },
    contenidoBoton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        backgroundColor: '#F7FAFC',
    },
    textContainer: {
        
        marginLeft: 16,
        flex: 1,
        marginRight: 8,
    },
    nombre: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    profesion: {
        fontSize: 14,
        fontWeight: '400',
        opacity: 0.8,
    },
    icono: {
        alignSelf: 'center',
    },
});

export default BotonAvatar;