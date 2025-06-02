import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { recuperarStorage } from '../../../../services/asyncStorage';
import { Ionicons } from '@expo/vector-icons';




export default function MiPlan() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [datosStripe, setDatosStripe] = useState<any>(null);

    useEffect(() => {
        const loadStripeData = async () => {
            try {
                const datosStripeStr = await recuperarStorage('stripeData');
                if (datosStripeStr) {
                    console.log('Datos de Stripe recuperados:', datosStripeStr);
                    setDatosStripe(datosStripeStr);
                }
            } catch (error) {
                console.error('Error al recuperar datos de Stripe:', error);
            }
        };
        
        loadStripeData();
    }, []);

    return (
        
            <ScrollView>
            <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Tu Plan Actual</Text>
                <Text style={styles.headerSubtitle}>Administra tu suscripción en cualquier momento</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.planBadge}>
                        <Text style={styles.planBadgeText}>ACTIVO</Text>
                    </View>
                    <Text style={styles.planName}>{datosStripe?.planName || 'Plan Premium'}</Text>
                    <Text style={styles.planPrice}>{datosStripe?.price || '$9.99'}<Text style={styles.planPeriod}>/mes</Text></Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.advantages}>
                    <View style={styles.advantageItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#8BC34A" />
                        <Text style={styles.advantageText}>Postea todo lo que quieras</Text>
                    </View>
                    <View style={styles.advantageItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#8BC34A" />
                        <Text style={styles.advantageText}>Sin anuncios</Text>
                    </View>
                    <View style={styles.advantageItem}>
                        <Ionicons name="checkmark-circle" size={20} color="#8BC34A" />
                        <Text style={styles.advantageText}>Soporte prioritario 24/7</Text>
                    </View>
                    <View style={styles.advantageItem}>
                        <Ionicons name="calendar" size={20} color="#666" />
                        <Text style={styles.nextBilling}>
                            Próximo pago: <Text style={styles.boldText}>{datosStripe?.billing_cycle_anchor_formatted || '--/--/----'}</Text>
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('https://billing.stripe.com/p/login/test_28E28tbjZaxK3us0nKaZi00')}
                >
                    <Text style={styles.buttonText}>Gestionar suscripción</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" style={styles.buttonIcon} />
                </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={20} color="#2196F3" />
                <Text style={styles.infoText}>
                    Puedes cancelar o modificar tu plan en cualquier momento desde el portal de gestión de suscripciones.
                </Text>
            </View>
        </View>
        </ScrollView>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
        padding: 20,
    },
    header: {
        marginBottom: 24,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#2c3e50',
        marginBottom: 8,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 15,
        color: '#7f8c8d',
        textAlign: 'center',
        lineHeight: 22,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 0,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#2c3e50',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        marginBottom: 20,
    },
    cardHeader: {
        backgroundColor: '#f8f9fa',
        padding: 25,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
    },
    planBadge: {
        backgroundColor: '#e3f9e5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 15,
    },
    planBadgeText: {
        color: '#2ecc71',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    planName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: 5,
    },
    planPrice: {
        fontSize: 36,
        fontWeight: '800',
        color: '#27ae60',
    },
    planPeriod: {
        fontSize: 16,
        color: '#7f8c8d',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#ecf0f1',
        marginVertical: 0,
    },
    advantages: {
        padding: 25,
        paddingBottom: 15,
    },
    advantageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },
    advantageText: {
        marginLeft: 15,
        fontSize: 15,
        color: '#34495e',
        flex: 1,
    },
    nextBilling: {
        marginLeft: 15,
        fontSize: 14,
        color: '#7f8c8d',
    },
    boldText: {
        fontWeight: '600',
        color: '#2c3e50',
    },
    button: {
        backgroundColor: '#2ecc71',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginHorizontal: 25,
        marginBottom: 25,
        marginTop: 10,
        elevation: 3,
        shadowColor: '#2ecc71',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    buttonIcon: {
        marginLeft: 10,
    },
    infoBox: {
        backgroundColor: '#f0f7ff',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    infoText: {
        flex: 1,
        marginLeft: 12,
        color: '#2980b9',
        fontSize: 14,
        lineHeight: 20,
    }
});