import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-get-random-values';
import HeaderPrincipal from '../../../../components/Header';

export default function RootLayout() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <Stack>
                <Stack.Screen 
                    name="post" 
                    options={{
                        header: (props) => (
                            <HeaderPrincipal/>
                        ),
                }}/>
                <Stack.Screen 
                    name="crear-post" 
                    options={{
                        header: (props) => (
                            <HeaderPrincipal/>
                        ),
                }}/>
            </Stack>
        </SafeAreaView>
    );
}