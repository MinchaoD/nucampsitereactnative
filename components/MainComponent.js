import React, { Component } from 'react';
import Directory from './DirectoryComponent';
import CampsiteInfo from './CampsiteInfoComponent';
import { View, Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

const DirectoryNavigator = createStackNavigator(
    {
        Directory: { screen: Directory },
        CampsiteInfo: { screen: CampsiteInfo }  //these 2 are the components will be available for stacknavigator
    },
    {
        initialRouteName: 'Directory',  // this is to set the default screen is Directory
        defaultNavigationOptions: {  
            headerStyle: {  //this is to set up the styles for Header
                backgroundColor: '#5637DD'  // this the header background color
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: '#fff' // this is the header title text color
            }
        }
    },
)

const AppNavigator = createAppContainer(DirectoryNavigator);  // this is connect the top component with the navigator, so that like back, forward can work, etc

class Main extends Component { 
    
    render() {
        return (
            <View style={{flex: 1,  // the below code is if platform is ios, then the top padding is 0, otherwise is the statusbarheight, it is not required but good to have.
                          paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight}}> 
                <AppNavigator /> 
            </View> 
        )
    }
}

export default Main;