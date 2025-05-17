import React, { useState } from 'react';
import { Text, View, SafeAreaView, ScrollView, StyleSheet} from 'react-native'
import { List } from 'react-native-paper';



export default function Preguntas() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>

          <View style={styles.container}>

            
          <List.Accordion style={styles.acordion}
                title="Pregunta 1"
                titleStyle={{fontSize: 16, fontWeight: 'bold'}}>
                    
                <List.Item 
                    style={styles.itemAcordeon}
                    titleStyle={{fontSize: 16}}
                    title="lorem ipsum dolor sit amet consectetur adipisicing elit lorem ipsum dolor sit amet consectetur adipisicing elit"
                    titleNumberOfLines={0}
                    />
            </List.Accordion>
            <List.Accordion style={styles.acordion}
                title="Pregunta 2"
                titleStyle={{fontSize: 16, fontWeight: 'bold'}}>
                <List.Item 
                    style={styles.itemAcordeon}
                    title="lorem ipsum dolor sit amet consectetur adipisicing elit lorem ipsum dolor sit amet consectetur adipisicing elit"
                    titleNumberOfLines={0}
                    />
            </List.Accordion>
            <List.Accordion style={styles.acordion}
                title="Pregunta 3"
                titleStyle={{fontSize: 16, fontWeight: 'bold'}}>
                <List.Item
                    style={styles.itemAcordeon}
                    title="lorem ipsum dolor sit amet consectetur adipisicing elit lorem ipsum dolor sit amet consectetur adipisicing elit"
                    titleNumberOfLines={0}
                    />
            </List.Accordion>
          
          
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  }
 
    
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
      },
      scrollContainer: {
        paddingBottom: 20,
      },
      acordion:{
        borderRadius: 10,
        backgroundColor: '#84AE46',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#689f38',
        elevation: 2,
      },
      itemAcordeon:{
        backgroundColor: '#eaf7db',
        borderRadius: 8,
        padding: 10,
      },
  });
