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
                    <HeaderPrincipal titulo="MI PERFIL" bgColor="#FFFFFF"/>
                ),
                }}
            />
            <Stack.Screen
                name="editar-perfil"
                options={{
                header: (props) => (
                    <HeaderPrincipal titulo="EDITAR PERFIL" bgColor="#FFFFFF"/>
                ),
                }}
            />
            <Stack.Screen
                name="[idUsuario]"
                options={{
                header: (props) => (
                    <HeaderPrincipal titulo="ALO" bgColor="#FFFFFF"/>
                ),
                }}
            />
        </Stack>
    );
}