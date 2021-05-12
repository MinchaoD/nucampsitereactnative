import React, {Component} from 'react';
import { FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { CAMPSITES} from '../shared/campsites';

class Directory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            campsites: CAMPSITES
        };
    }

    static navigationOptions = {  //this is to set the method on the class itself instead of on the object
        title: 'Directory'  // // this will show on the screen header
    }

    render(){
        const { navigate } = this.props.navigation;  //this.props.navigation is very useful, has goback, navigate, getParam, etc, here we only need navigate
        const renderDirectoryItem = ({item}) => {
        return (
            <ListItem
                title={item.name}
                subtitle={item.description}
                onPress={() => navigate('CampsiteInfo', {campsiteId: item.id})}  //this has 2 parameters, the first
                // is the name of the navigation screen will go to, the 2nd parameter is optional, it sets when the 
                //campsiteId is this listed item id.
                leftAvatar={{ source: require('./images/react-lake.jpg')}}
            />
        );
    };
    
    return (
        <FlatList
            data={this.state.campsites}
            renderItem={renderDirectoryItem}
            keyExtractor={item => item.id.toString()}
        />
    );
}
}

export default Directory;