import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useCallback, useEffect } from "react";
import { FlatList, RefreshControl, View, Text, ActivityIndicator, StatusBar } from "react-native";
import Post from "../../../components/post";
import { obtenerPostsByUser } from "../../../services/postService";
import { useState } from "react";
import { PostType } from "../../../types/post";
import { useFocusEffect } from "expo-router";
import { StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { ViewToken } from "react-native";

export default function RootLayout() {

    const { id_usuario } = useLocalSearchParams();
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [visibleItem, setVisibleItem] = useState<number | null>(null);

        const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
            if (viewableItems.length > 0) {
                // Obtener el ID del primer ítem visible
                const visibleId = viewableItems[0].item?.id;
                setVisibleItem(visibleId);
            }
        }).current; 
        
        const viewabilityConfig = useRef({
            itemVisiblePercentThreshold: 50, // El 50% del ítem debe ser visible
            minimumViewTime: 300, // Tiempo mínimo que debe estar visible en ms
            
        }).current; 
        
        const viewabilityConfigCallbackPairs = useRef([
            { viewabilityConfig, onViewableItemsChanged }
        ]).current;

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        obtenerPostsByUser(Number(id_usuario));
        setRefreshing(false);
    }, []);


    useEffect(() => {
        const cargarPosts = async () => {
            setLoading(true);
            try {
                const posts = await obtenerPostsByUser(Number(id_usuario));
                setPosts(posts);
            } catch (error) {
                console.error('Error al cargar posts:', error);
                return null;
            } finally {
                setLoading(false);
            }
        };
        cargarPosts();
    }, [id_usuario]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text>Cargando publicaciones...</Text>
            </View>
        );
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            <FlatList
                data={posts}
                keyExtractor={(item) => `post-${item.id}`}
                renderItem={({ item }) => {
                    return <Post datos={item} />;
                }}
                initialNumToRender={5}
                viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 50,
                    waitForInteraction: true,
                }}
                maxToRenderPerBatch={5}
                updateCellsBatchingPeriod={50}
                windowSize={7}
                removeClippedSubviews={true}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                    <Text>No hay publicaciones disponibles</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
