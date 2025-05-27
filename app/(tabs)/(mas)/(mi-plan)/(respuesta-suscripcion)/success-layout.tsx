
import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";


const SuccessLayout = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="checkmark-circle-outline" size={64} color="#8BC34A" />
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Gracias por tu suscripción</Text>
            <Text style={{ fontSize: 16, textAlign: 'center' }}>Has adquirido un plan de suscripción exitosamente.</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/(mas)/(mi-plan)/planes')}>
                <Text>Volver atras</Text>
            </TouchableOpacity>
        </View>
    );
};

export default SuccessLayout;
