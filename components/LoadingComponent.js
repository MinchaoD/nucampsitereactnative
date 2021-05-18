import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

function Loading() {
    return (
        <View style = {styles.loadingView}> 
            <ActivityIndicator size = 'large' color = '#563DD' />  
            <Text style={styles.loadingText}> Loading ...</Text>
        </View> // the ActivityIndicator is to show the rotating circle when loading
    );
}

const styles = StyleSheet.create(
    {
        loadingView: {
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1
        },
        loadingText: {
            color: '#5637DD',
            fontSize: 14,
            fontWeight: 'bold'
        }
    }
)

export default Loading;