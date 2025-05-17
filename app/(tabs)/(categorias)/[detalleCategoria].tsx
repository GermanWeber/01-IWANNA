import React from 'react';
import { StyleSheet, View, SafeAreaView, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DetalleCategoriaPosts from './(categoriaDetalle)/CategoriasPost';
import DetalleCategoriaTrabajadores from './(categoriaDetalle)/CategoriasTrabajadores';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';

const Tab = createMaterialTopTabNavigator();

export default function DetalleCategorias() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, '[detalleCategoria]'>>();

  const route = useRoute();
  const { categoria, id } = route.params as { categoria: string, id: string };


  return ( 

        
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{categoria}</Text>
      </View>

      <View style={{ flex: 1 }}>
        
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
            tabBarIndicatorStyle: { backgroundColor: '#8BC34A' },
            tabBarActiveTintColor: '#84AE46',
            tabBarInactiveTintColor: '#333',
            tabBarStyle: {
              backgroundColor: '#fff',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 1,
              borderBottomColor: '#ddd',
            },
          }}
        >
          
          <Tab.Screen name="Posts" component={DetalleCategoriaPosts} />
          <Tab.Screen name="Trabajadores" component={DetalleCategoriaTrabajadores} />
        </Tab.Navigator>
   
      </View>
    </SafeAreaView>
  ); 
}


const styles = StyleSheet.create({
  titleContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});
