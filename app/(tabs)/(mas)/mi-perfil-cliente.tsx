import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { RatingStars } from '../../../components/rating-stars';

const imgPerfil = require('../../../assets/images/perfil.png');

export default function MiPerfilCliente() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Sección de Perfil */}
          <View style={styles.profileHeader}>
            <Image
              source={imgPerfil}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Juan González</Text>
              <View style={styles.ratingContainer}>
                <RatingStars rating={4.8} showValue />
              </View>
              <View style={styles.memberSince}>
                <Ionicons name="calendar-outline" size={16} color="#8BC34A" />
                <Text style={styles.memberSinceText}>Miembro desde 2023</Text>
              </View>
            </View>
          </View>

          {/* Botón de Contratar Servicio */}
          <TouchableOpacity 
            style={styles.contractButton}
            onPress={() => router.push('/(tabs)/(servicios)')}
          >
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
            <Text style={styles.contractButtonText}>Contratar Nuevo Servicio</Text>
          </TouchableOpacity>

          {/* Sección de Datos Personales */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-circle-outline" size={24} color="#8BC34A" />
              <Text style={styles.sectionTitle}>Datos Personales</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Edad:</Text>
              <Text style={styles.infoValue}>28 años</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Ubicación:</Text>
              <Text style={styles.infoValue}>Santiago, Chile</Text>
            </View>
          </View>

          {/* Sección de Servicios Activos */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time-outline" size={24} color="#8BC34A" />
              <Text style={styles.sectionTitle}>Servicios Activos</Text>
            </View>
            <View style={styles.serviceList}>
              <TouchableOpacity style={styles.serviceItem}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceTitle}>Servicio de Parrillada</Text>
                  <Text style={styles.serviceDate}>15 de Marzo, 2024</Text>
                  <Text style={styles.serviceStatus}>En progreso</Text>
                </View>
                <View style={styles.serviceWorker}>
                  <Image
                    source={imgPerfil}
                    style={styles.workerImage}
                  />
                  <Text style={styles.workerName}>Manuel Perez</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.serviceItem}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceTitle}>Reparación de Plomería</Text>
                  <Text style={styles.serviceDate}>20 de Marzo, 2024</Text>
                  <Text style={styles.serviceStatus}>Programado</Text>
                </View>
                <View style={styles.serviceWorker}>
                  <Image
                    source={imgPerfil}
                    style={styles.workerImage}
                  />
                  <Text style={styles.workerName}>Carlos López</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sección de Historial de Servicios */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list-outline" size={24} color="#8BC34A" />
              <Text style={styles.sectionTitle}>Historial de Servicios</Text>
            </View>
            <View style={styles.serviceList}>
              <TouchableOpacity style={styles.serviceItem}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceTitle}>Limpieza de Hogar</Text>
                  <Text style={styles.serviceDate}>10 de Marzo, 2024</Text>
                  <Text style={[styles.serviceStatus, styles.completedStatus]}>Completado</Text>
                </View>
                <View style={styles.serviceWorker}>
                  <Image
                    source={imgPerfil}
                    style={styles.workerImage}
                  />
                  <Text style={styles.workerName}>Ana Martínez</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.serviceItem}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceTitle}>Instalación Eléctrica</Text>
                  <Text style={styles.serviceDate}>5 de Marzo, 2024</Text>
                  <Text style={[styles.serviceStatus, styles.completedStatus]}>Completado</Text>
                </View>
                <View style={styles.serviceWorker}>
                  <Image
                    source={imgPerfil}
                    style={styles.workerImage}
                  />
                  <Text style={styles.workerName}>Roberto Silva</Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/(mas)/historial-servicios')}
            >
              <Text style={styles.viewAllText}>Ver todo el historial</Text>
              <Ionicons name="chevron-forward" size={20} color="#8BC34A" />
            </TouchableOpacity>
          </View>

          {/* Sección de Actividad */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="stats-chart-outline" size={24} color="#8BC34A" />
              <Text style={styles.sectionTitle}>Mi Actividad</Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>25</Text>
                <Text style={styles.statLabel}>Contrataciones</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Favoritos</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>8</Text>
                <Text style={styles.statLabel}>Reseñas</Text>
              </View>
            </View>
          </View>

          {/* Sección de Contacto */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="call-outline" size={24} color="#8BC34A" />
              <Text style={styles.sectionTitle}>Contacto</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={20} color="#666" />
              <Text style={styles.infoValue}>juan.gonzalez@gmail.com</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={20} color="#666" />
              <Text style={styles.infoValue}>+56 9 1234 5678</Text>
            </View>
          </View>

          {/* Botón de Editar Perfil */}
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#8BC34A',
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  ratingContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  memberSince: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  memberSinceText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  section: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  serviceList: {
    gap: 15,
  },
  serviceItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  serviceDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  serviceStatus: {
    fontSize: 14,
    color: '#FFA000',
    fontWeight: '500',
  },
  completedStatus: {
    color: '#4CAF50',
  },
  serviceWorker: {
    alignItems: 'center',
    marginLeft: 15,
  },
  workerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 5,
  },
  workerName: {
    fontSize: 12,
    color: '#666',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    padding: 10,
  },
  viewAllText: {
    color: '#8BC34A',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 5,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
    width: 100,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8BC34A',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  editButton: {
    backgroundColor: '#8BC34A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  contractButton: {
    backgroundColor: '#00BCD4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contractButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
