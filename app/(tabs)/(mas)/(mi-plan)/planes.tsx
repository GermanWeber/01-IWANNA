import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, Text, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../navigation/types';
import { fetchProducts, iniciarCheckout, Product } from '../../../../services/paymentService';
import { recuperarStorage } from '../../../../services/asyncStorage';

export default function Planes() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [usuario, setUsuario] = useState<any>(null);

  const handleCheckout = async (priceId: string, userId: string) => {
    try {
      const url = await iniciarCheckout(priceId, userId, setLoading);
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

    const cargarUsuario = async () => {
      try {
        setLoading(true);
        const usuario = await recuperarStorage('usuario');
        setUsuario(usuario) ;
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Error al cargar el usuario');
      } finally {
        setLoading(false);
      }
    };
    cargarUsuario();
    loadProducts();
  }, []);

  if (checkoutUrl) {
    return (
      <WebView
        source={{ uri: checkoutUrl }}
        onNavigationStateChange={handleWebViewNavigation}
        
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {products.length > 0 ? (
            products.map((product, index) => (
              <View key={index} style={styles.productCard}>
                <View style={styles.productHeader}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>{product.price}</Text>
                </View>
                <View style={styles.productDetails}>
                  <Text style={styles.productDescription}>{product.description}</Text>
                  <Text style={styles.productInfo}>
                    Tipo: {product.type}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.selectButton} 
                  onPress={() => handleCheckout(product.priceId, usuario?.id)}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? "Procesando..." : "Seleccionar plan"}
                  </Text>
                </TouchableOpacity>

              </View>
            ))
          ) : (
            <Text style={styles.noProducts}>No hay planes disponibles</Text>
          )}
        </>
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({


    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f5f5f5',
    },
    productCard: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 20,
      marginBottom: 20,
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
    },
    productHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 15,
    },
    productName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
    },
    productPrice: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#007AFF',
    },
    productDetails: {
      marginBottom: 20,
    },
    productDescription: {
      fontSize: 16,
      color: '#666',
      marginBottom: 10,
    },
    productInfo: {
      fontSize: 14,
      color: '#666',
      marginBottom: 5,
    },
    selectButton: {
      backgroundColor: '#007AFF',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    noProducts: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
    },
  });