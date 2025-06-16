import { Tabs, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { recuperarStorage } from '../../services/asyncStorage';

export default function TabLayout() {
    const router = useRouter();
    const [usuario, setUsuario] = useState<any>(null);
    
    useFocusEffect(
            React.useCallback(() => {
                const cargarUsuario = async () => {
                const datos = await recuperarStorage('usuario');
                if (datos) {
                    setUsuario(datos);
                }
                };
                cargarUsuario();
            }, [])
    );
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#8BC34A',
                tabBarInactiveTintColor: '#666666',
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#ddd',
                    height: 60,
                    paddingBottom: 5,
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="(inicio)"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color, size }) => <Ionicons size={24} name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="(favoritos)"
                options={{
                    title: 'Favoritos',
                    tabBarIcon: ({ color, size }) => <Ionicons size={24} name="heart" color={color} />,
                }}
            />
            <Tabs.Screen
                name="(categorias)"
                options={{
                    title: 'Categorías',
                    tabBarIcon: ({ color, size }) => <Ionicons size={24} name="grid" color={color} />,
                }}
            />
            <Tabs.Screen
                name="(mas)"
                options={{
                    title: 'Más',
                    tabBarIcon: ({ color, size }) => <Ionicons size={24} name="ellipsis-horizontal" color={color} />,
                    tabBarButton: usuario ? undefined : () => null, // Oculta el botón si no hay usuario
                }}
            />            
        </Tabs>
    );
}