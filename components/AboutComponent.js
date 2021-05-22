import React, { Component } from 'react';
import { Text, ScrollView, FlatList } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';  // change 1 to redux: remove the import from shared/partners, because it is redux now and will get the data from redux instead
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';
import * as Animatable from 'react-native-animatable'; // use this library is easier that the animation built in react native

const mapStateToProps = state => {   // change 2 to redux: add this mapstatetoprops is to get the data from redux
    return  {
        partners: state.partners
    }
}

class Mission extends Component {
  
    render() {
        
    return (
        <Card title = "Our Mission">
            <Text style={{ margin: 10}}>
            We present a curated database of the best campsites in the vast woods and backcountry of the World Wide Web Wilderness. We increase access to adventure for the public while promoting safe and respectful use of resources. The expert wilderness trekkers on our staff personally verify each campsite to make sure that they are up to our standards. We also present a platform for campers to share reviews on campsites they have visited with each other.
            </Text>
        </Card>
    )
    }
}

class About extends Component {

    static navigationOptions = {
        title: 'About Us'
    }

    render() {
        const { navigate } = this.props.navigation;  
        const renderPartner = ({item}) => {
        return (
            <ListItem
                title={item.name}
                subtitle={item.description}
                leftAvatar={{ source: {uri: baseUrl + item.image}}}
            />
        );
    };

    if (this.props.partners.isLoading) {
        return (
            <ScrollView>
               
                    <Mission />
                    <Card
                        title='Community Partners'>
                        <Loading />
                    </Card>
            </ScrollView>
        )
    }
    if (this.props.partners.errMess) {
        return (
            <ScrollView>
                <Animatable.View animation='fadeInDown' duration={2000} delay={1000}> 
                    <Mission />
                    <Card
                        title='Community Partners'>
                        <Text>{this.props.partners.errMess}</Text>
                    </Card>
                </Animatable.View>
            </ScrollView>

        )
    }

    return (
        <ScrollView>
             <Animatable.View animation='fadeInDown' duration={2000} delay={1000}> 
                <Mission />
                <Card 
                title="Community Partners">
                <FlatList
                data={this.props.partners.partners}  // change 3 to redux: change the this.state.partners to this.props.partners.partner. 
                // there are 2 partners here, is because in partners.js under redux folder, we defined partners include isLoading, errMess and partners.
                renderItem={renderPartner}
                keyExtractor={item => item.id.toString()}
                />
                </Card>
            </Animatable.View>
        </ScrollView>
    );
    }
}

export default connect(mapStateToProps)(About);  // change 4 to redux: add connect to make the state from redux will connect to about