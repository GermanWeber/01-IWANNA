import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { recuperarStorage } from '../../../../services/asyncStorage';
import { useState } from 'react';




export default function MiPlan() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [datosStripe, setDatosStripe] = useState<any>(null);

useEffect( () => {

    const loadStripeData = async () => {
      try {
        const datosStripeStr = await recuperarStorage('stripeData');
        if (datosStripeStr) {
          console.log('Datos de Stripe recuperados:', datosStripeStr);
          // Actualiza el estado con los datos recuperados
          setDatosStripe(datosStripeStr);
        }
      } catch (error) {
        console.error('Error al recuperar datos de Stripe:', error);
      }
    };
    
    loadStripeData();
  }, []);



    return (
        <View style={styles.container}>
            <View style={[styles.card]}>
                <View style={styles.cardHeader}>
                    <Text style={styles.planName}>{datosStripe?.planName}</Text>
                </View>
                
                <View style={styles.advantages}>
                    <Text style={styles.price}>{datosStripe?.price}/mes</Text>
                    
                    <Text style={styles.advantage}>• Acceso a contenido premium</Text>
                    <Text style={styles.advantage}>• Sin anuncios</Text> 
                    <Text style={styles.advantage}>• Soporte 24/7</Text>
                    <Text style={styles.advantage}>Proximo pago: {datosStripe?.billing_cycle_anchor_formatted}</Text>
                       
                   
                </View>
            </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/(mas)/(mi-plan)/planes')}>
            <Text style={styles.buttonText}>Cambiar de plan</Text>
        </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
        flex: 1
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderColor: 'black',
        borderWidth: 1,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 }
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        borderTopStartRadius: 8,
        borderTopEndRadius: 8,
        backgroundColor: 'yellow',
        borderBottomWidth: 4,
        borderColor: 'black',
        padding: 15,
    },
    planName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
    },
    advantages: {
        padding: 15,
    },
    advantage: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        
    }
});