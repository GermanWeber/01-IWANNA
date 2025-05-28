
import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";


const CancelLayout = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="close-circle-outline" size={64} color="#FF0000" />
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Ups</Text>
            <Text style={{ fontSize: 16, textAlign: 'center' }}>Algo salio mal, intentalo de nuevo.</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/(mas)/(mi-plan)/planes')}>
                <Text>Volver atras</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CancelLayout;