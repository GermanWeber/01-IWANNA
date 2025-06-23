import { Stack } from 'expo-router';
import HeaderPrincipal from '../../../../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PerfilLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="mi-perfil"
                options={{
                header: (props) => (
                    <HeaderPrincipal/>
                ),
                }}
            />
            <Stack.Screen
                name="editar-perfil"
                options={{
                header: (props) => (
                    <HeaderPrincipal/>
                ),
                }}
            />
        </Stack>
    );
}