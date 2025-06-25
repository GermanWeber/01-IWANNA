import React from 'react';
import { TouchableOpacity, TouchableHighlight, Text, View, Image, StyleSheet, GestureResponderEvent, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


type Props = {
  textoBoton?: string;
  colorTexto?: string;
  textoBotonSub?: string;
  colorTextoSub?: string;
  bgColor?: string;
  onPress: (event: GestureResponderEvent) => void;
  iconoDerecha?: any;
  colorIconoDerecha?: string;
  iconoIzquierda?: any;
  colorIconoIzquierda?: string;
  disabled?: boolean;
};

const BotonCategorias: React.FC<Props> = ({
  textoBoton,
  colorTexto = '#212529',
  onPress,
  bgColor = '#FFFFFF',
  iconoDerecha = 'chevron-forward',
  colorIconoDerecha = '#6C757D',
  iconoIzquierda,
  colorIconoIzquierda = '#007AFF',
  colorTextoSub = '#6C757D',
  textoBotonSub,
  disabled = false,
}) => {
  return (

    <TouchableHighlight
      style={[styles.boton, { backgroundColor: bgColor }]}
      underlayColor={'#ddd'}
      onPress={onPress}
    >
      <View style={styles.contenidoBoton}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Ionicons style={{ alignSelf: 'center', display: 'flex', fontWeight: '800' }} size={30} name={iconoIzquierda} color={colorIconoIzquierda}></Ionicons>

          <View style={{ gap: 2, justifyContent: 'center', maxWidth: '75%' }}>
            <Text style={{ fontWeight: '800', color: colorTexto }}>{textoBoton}</Text>
            {textoBotonSub && (
              <Text style={{
                fontWeight: '400',
                color: colorTextoSub,
                flexWrap: 'wrap',
                overflow: 'hidden',
                width: '80%',
              }}>{textoBotonSub}</Text>
            )}

          </View>

        </View>
        <Ionicons name={iconoDerecha} size={30} color={colorIconoDerecha} style={[styles.icono, { alignSelf: 'center', display: 'flex', fontWeight: '800' }]} />
      </View>
    </TouchableHighlight>
  );
}


const styles = StyleSheet.create({
  boton: {
    marginHorizontal: 16,
    marginVertical: 6,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  contenidoBoton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contenidoIzquierdo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  textoPrincipal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 2,
    lineHeight: 22,
  },
  textoSecundario: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6C757D',
    lineHeight: 18,
    flexWrap: 'wrap',
  },
  iconoDerecho: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  icono: {
    marginRight: 8,
    opacity: 0.8,
  },
});

export default BotonCategorias;    