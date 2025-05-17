import { Stack } from 'expo-router';
import HeaderPrincipal from '../../../../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PerfilLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="auth2-info"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="auth2-form"
                options={{
                header: (props) => (
                    <HeaderPrincipal titulo="AUTENTICACIÓN" bgColor="#FFFFFF"/>
                ),
                }}
            />
        </Stack>
    );
}