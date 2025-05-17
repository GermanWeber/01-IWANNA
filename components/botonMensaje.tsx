import React from 'react';
import { TouchableOpacity, TouchableHighlight, Text, View, Image, StyleSheet, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';



type Props = {
    textoBoton?: string;
    textoProfesion?: string;
    colorTexto?: string;
    colorTextoProfesion?: string;
    bgColor?: string;
    numeroMensaje?: number;
 
    onPress: () => void;
    avatar?: any;
};

const BotonAvatar: React.FC<Props> = ({ textoBoton, colorTexto, onPress,
                                            bgColor, numeroMensaje, 
                                            avatar, textoProfesion, colorTextoProfesion 
    }) => {
    return (

    <TouchableHighlight
      style={[styles.boton, { backgroundColor: bgColor }]}
      underlayColor={'#ddd'}
      onPress={onPress}
    >
      <View style={styles.contenidoBoton}>
          <View  style={{ flexDirection: 'row', gap:10 }}>
          <Image
              source={avatar}
              style={{
                width: 60,
                height: 60,
                borderRadius: 80,
                marginVertical: 5,
                borderColor: '#00BCD4',
                borderWidth: 5,                
              }}
            />
            <View style={{ marginLeft: 10, justifyContent: 'center', gap: 5}}>
              <Text style={{ fontWeight: '800', color: colorTexto }}>{textoBoton}</Text>
              <Text style={{ fontWeight: '300', color: colorTextoProfesion }}>{textoProfesion}</Text>
            </View>
          </View>
          <Text style={styles.numeroMensaje}>{numeroMensaje}</Text>
      </View>
    </TouchableHighlight>
        );
    }


    const styles = StyleSheet.create({
    boton: {
        marginVertical: 10,
        marginHorizontal: 10,
        padding: 20,
        borderRadius: 50,
        boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
        
        
      },
      contenidoBoton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      numeroMensaje: {
        marginRight: 8,
        alignSelf: 'center',
        justifyContent: 'center',
        fontSize: 20,
        backgroundColor: '#84AE46',
        borderRadius: 50,
        paddingHorizontal: 15,
        paddingVertical: 5,
        
      },
    });

export default BotonAvatar;    