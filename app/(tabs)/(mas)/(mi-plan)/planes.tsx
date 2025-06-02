import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, Text, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../../../navigation/types';
import { fetchProducts, iniciarCheckout, Product } from '../../../../services/paymentService';
import { recuperarStorage } from '../../../../services/asyncStorage';

const { width } = Dimensions.get('window');

// Mapeo de productos de Stripe a la estructura de la UI
const mapStripeProductToPlan = (product: any) => {
  const isAnual = product.name.toLowerCase().includes('anual');
  const isGratis = product.name.toLowerCase().includes('gratis');
  
  return {
    id: product.id,
    nombre: product.name,
    precio: product.price.split(' ')[0], // Extrae solo el monto
    periodo: isGratis ? '' : isAnual ? 'al año' : 'al mes',
    descripcion: product.description,
    caracteristicas: [
      'Publicación ilimitada de trabajos',
      'Mejor visibilidad en búsquedas',
      isAnual ? 'Ahorro del 20%' : 'Flexibilidad mensual',
      'Soporte prioritario',
      'Estadísticas detalladas'
    ],
    popular: !isAnual, // El plan mensual es el popular
    color: isAnual ? '#4a90e2' : '#2ecc71', // Azul para anual, verde para mensual
    icon: isAnual ? 'calendar-outline' : 'star-outline',
    priceId: product.priceId,
    esGratis: isGratis
  };
};

export default function Planes() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [usuario, setUsuario] = useState<any>(null);
  const [datosStripe, setDatosStripe] = useState<any>(null);

  const handleCheckout = async (priceId: string, userId: string) => {
    console.log('priceId', priceId);
    console.log('userId', userId);
    console.log('usuario', usuario.id);
    
    try {
      const url = await iniciarCheckout(priceId, userId, usuario.id, setLoading);
      setCheckoutUrl(url);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al iniciar el pago');
    } finally {
      setLoading(false);
    }
  };

  const handleWebViewNavigation = (event: any) => {
    const { url } = event.nativeEvent;
    // Verifica si es una URL de éxito o cancelación
    if (url.includes('success') || url.includes('cancel')) {
      setCheckoutUrl(null);
    }
  };

  useEffect(() => {

    const loadUsuario = async () => {
      try {
        const usuario = await recuperarStorage('usuario');
        if (usuario) {
          console.log('Usuario cargado:', usuario);
          // Actualiza el estado con los datos del usuario
          setUsuario(usuario);
        }
      } catch (error) {
        console.error('Error al cargar el usuario:', error);
      }
    };
    
    const loadProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts();
        setProducts(products);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

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
    loadUsuario();
    loadProducts();
  }, []);

  const renderPlanCard = (plan: any) => {
    const isPopular = plan.popular;
    const isFree = plan.esGratis;
    
    return (
      <View key={plan.id} style={[
        styles.planCard,
        isPopular && styles.popularPlan,
        { borderColor: plan.color }
      ]}>
        {isPopular && (
          <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
            <Text style={styles.popularBadgeText}>POPULAR</Text>
          </View>
        )}
        
        <View style={styles.planHeader}>
          <View style={[styles.iconContainer, { backgroundColor: `${plan.color}20` }]}>
            <Ionicons name={plan.icon} size={32} color={plan.color} />
          </View>
          <Text style={[styles.planName, { color: plan.color }]}>{plan.nombre}</Text>
          <Text style={styles.planPrice}>
            {plan.precio}
            {plan.periodo && <Text style={styles.planPeriod}> {plan.periodo}</Text>}
          </Text>
          <Text style={styles.planDescription}>{plan.descripcion}</Text>
        </View>
        
        <View style={styles.featuresContainer}>
          {plan.caracteristicas.map((caracteristica: string, index: number) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={18} color={plan.color} />
              <Text style={styles.featureText}>{caracteristica}</Text>
            </View>
          ))}
        </View>
        
        <TouchableOpacity 
          style={[styles.selectButton, { backgroundColor: plan.color }]}
          onPress={() => {
            if (isFree) {
             
            } else {
              handleCheckout(plan?.priceId, datosStripe?.customerId);
            }
          }}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Procesando...' : isFree ? 'Seleccionar Gratis' : 'Elegir Plan'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  // Mapear los productos de Stripe a la estructura de la UI
  const planes = products.length > 0 
    ? products.map(mapStripeProductToPlan) 
    : [];

  if (checkoutUrl) {
    return (
      <WebView
        source={{ uri: checkoutUrl }}
        onNavigationStateChange={handleWebViewNavigation}
        
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Elige el plan perfecto</Text>
          <Text style={styles.subtitle}>Selecciona el plan que mejor se adapte a tus necesidades</Text>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2ecc71" />
            <Text style={styles.loadingText}>Cargando planes...</Text>
          </View>
        ) : (
          <View style={styles.plansContainer}>
            {planes.map((plan: any) => renderPlanCard(plan))}
          </View>
        )}
        
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={24} color="#3498db" />
          <Text style={styles.infoText}>
            ¿Necesitas ayuda para elegir? Contáctanos para asesorarte sobre el plan ideal para ti.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  plansContainer: {
    marginBottom: 30,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    borderWidth: 2,
    position: 'relative',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  popularPlan: {
    borderWidth: 2,
    marginTop: 10,
  },
  popularBadge: {
    position: 'absolute',
    top: 10,
    right: -30,
    paddingHorizontal: 40,
    paddingVertical: 5,
    transform: [{ rotate: '45deg' }],
  },
  popularBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  planHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 5,
    color: '#2c3e50',
  },
  planPeriod: {
    fontSize: 16,
    fontWeight: '500',
    color: '#7f8c8d',
  },
  planDescription: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 5,
  },
  featuresContainer: {
    marginBottom: 25,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#34495e',
    flex: 1,
  },
  selectButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#7f8c8d',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f7ff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    color: '#2980b9',
    fontSize: 14,
    lineHeight: 20,
  },
});