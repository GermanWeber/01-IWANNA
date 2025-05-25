
import { API_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';



export interface Product {
  id: string;
  name: string;
  price: string;
  priceId: string;
  description?: string;
  default_price: number;
  created: number;
  updated: number;
  active: boolean;
  object: string;
  type: string;

}


export interface CheckoutSession {
  url: string;
}



//traer los productos (suscripciones)
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}payment/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al cargar los productos');
    }
    
    const products = await response.json();
    console.log('Productos recibidos:', products);
    
    // Transformar los productos de Stripe para nuestro formato
    return products.map((product: any) => ({
      id: product.id,
      name: product.name,
      price: product.price, // ya viene formateado
      priceId: product.priceId,
      description: product.description,
      active: product.active,
      type: product.type,
    }));
  } catch (error) {
    console.error('Error en fetchProducts:', error);
    throw error;
  }
};

//traer los precios
export const fetchPrices = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}payment/prices`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al cargar los precios');
    }
    
    const prices = await response.json();
    console.log('Precios recibidos:', prices);
    
    // Transformar los precios de Stripe para nuestro formato
    return prices.map((price: any) => ({
      id: price.id,
      name: price.name,
      price: price.price, // ya viene formateado
      priceId: price.priceId,
      description: price.description,
      active: price.active,
      type: price.type,
    }));
  } catch (error) {
    console.error('Error en fetchPrices:', error);
    throw error;
  }
};


//crear usuario en strape
export const crearUsuarioStripe = async (userId: string, email: string, nombre: string) => {
  try {
    console.log('Enviando datos a Stripe...', {
        email: email,
        nombre: nombre,
        userId: userId
    });

    const responseStripe = await fetch(`${API_URL}payment/create-customer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: userId,
            email: email,
            nombre: nombre
        })
    });

    if (!responseStripe.ok) {
        throw new Error('Error al crear el cliente en Stripe');
    }

} catch (error) {
    console.error('Error en la creación del cliente Stripe:', error);
    
}
};


//verficar suscripcion por id
export const getSubscriptionInfo = async (Id: string) => {
  try {
    const response = await fetch(`${API_URL}payment/subscription/${Id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
      },
    });

    const responseText = await response.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse JSON response:', responseText);
      throw new Error(`Invalid JSON response from server: ${response.status} ${response.statusText}`);
    }

    console.log('Datos de suscripción:', data);
    
    if (data.subscribed) {
      const expiryDate = new Date(data.current_period_end * 1000);
      const formattedDate = expiryDate.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      return {
        ...data,
        formattedExpiryDate: formattedDate,
        isActive: data.status === 'active' || data.status === 'trialing',
        
      };
    }
    
    // When not subscribed, return both status and customerId
    return { 
      subscribed: false, 
      ...data
    };
  } catch (error) {
    console.error('Error al obtener la información de suscripción:', error);
    throw error;
  }
};

//crear la sesión de pago
export const iniciarCheckout = async (priceId: string, customerId: string, setLoading: (loading: boolean) => void) => {
  setLoading(true);
  try {
    console.log('Iniciando checkout con priceId:', priceId, 'customerId:', customerId);

    const response = await fetch(`${API_URL}payment/create-checkout-session`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ priceId, customerId }), // Cambiado de userId a customerId
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.error || 'Error en la respuesta del servidor');
    }

    if (!responseData?.url) {
      console.error('Respuesta inesperada del servidor:', responseData);
      throw new Error('La respuesta no contiene la URL de checkout');
    }

    console.log('URL de checkout obtenida:', responseData.url);
    return responseData.url;

  } catch (error) {
    console.error('Error en iniciarCheckout:', error);
    throw error instanceof Error ? error : new Error('Error desconocido al iniciar el pago');
  } finally {
    setLoading(false);
  }
};





