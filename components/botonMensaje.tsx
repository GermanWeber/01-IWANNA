import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View, Image } from 'react-native';

type Props = {
    textoBoton?: string;
    textoProfesion?: string;
    fecha?: string;
    colorTexto?: string;
    colorTextoProfesion?: string;
    bgColor?: string;
    onPress: () => void;
    avatar?: any;
};

const BotonAvatar: React.FC<Props> = ({ 
    textoBoton, 
    colorTexto = '#333', 
    onPress,
    bgColor = '#FFFFFF', 
    avatar, 
    textoProfesion, 
    colorTextoProfesion = '#666',  
    fecha 
}) => {
    return (
        <TouchableHighlight
            style={[styles.boton, { backgroundColor: bgColor }]}
            underlayColor={'#f0f0f0'}
            onPress={onPress}
        >
            <View style={styles.contenidoBoton}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={avatar}
                        style={styles.avatar}
                        defaultSource={require('./../assets/images/perfil.png')}
                    />
                </View>
                
                <View style={styles.textContainer}>
                    <View style={styles.textHeader}>
                        <Text style={[styles.nombre, { color: colorTexto }]} numberOfLines={1}>
                            {textoBoton}
                        </Text>
                        {fecha && (
                            <Text style={styles.fecha}>{fecha}</Text>
                        )}
                    </View>
                    
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
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    boton: {
        marginVertical: 8,
        marginHorizontal: 16,
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    contenidoBoton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#f0f0f0',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    textHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    nombre: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    profesion: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    fecha: {
        fontSize: 12,
        color: '#999',
        marginLeft: 8,
    }
});

export default BotonAvatar;