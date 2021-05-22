import React, {Component} from 'react';
import { View, Text, FlatList } from 'react-native';
import { Tile } from 'react-native-elements';
import { connect } from 'react-redux'; 
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent'
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {  
    return  {
        campsites: state.campsites,
    }
}

class Directory extends Component {
    static navigationOptions = {  //this is to set the method on the class itself instead of on the object
        title: 'Directory'  // // this will show on the screen header
    }

    render(){
        const { navigate } = this.props.navigation;  //this.props.navigation is very useful, has goback, navigate, getParam, etc, here we only need navigate
        const renderDirectoryItem = ({item}) => {
        return (
            <Animatable.View animation='fadeInRightBig' duration={2000}> 
                <Tile  // use Tile here instead of ListItem, it is just another way to do
                    title={item.name}
                    caption={item.description}
                    featured
                    onPress={() => navigate('CampsiteInfo', {campsiteId: item.id})}  //this has 2 parameters, the first
                    // is the name of the navigation screen will go to, the 2nd parameter is optional, it sets when the 
                    //campsiteId is this listed item id.
                    imageSrc={{uri: baseUrl + item.image}}
                />
            </Animatable.View>
        );
    };

    if (this.props.campsites.isLoading) {
        return <Loading />

    }
    if (this.props.campsites.errMess) {
        return (
            <View>
                <Text> {this.props.campsites.errMess} </Text>
            </View>
        )
    }
    
    return (
        <FlatList
            data={this.props.campsites.campsites}
            renderItem={renderDirectoryItem}
            keyExtractor={item => item.id.toString()}
        />
    );
}
}

export default connect(mapStateToProps)(Directory);