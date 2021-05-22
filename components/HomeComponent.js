import React, { Component } from 'react';
import { View, Text, Animated } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux'; 
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';


const mapStateToProps = state => {   
      return  {
        campsites: state.campsites,
        promotions: state.promotions,
        partners: state.partners
    }
}

function RenderItem(props) {  //change (item) to (props), and then destruct props to item, the reason is that we have isLoading and errMess this time, should use props
    const {item} = props;
    if (props.isLoading) {
        return <Loading />

    }
    if (props.errMess) {
        return (
            <View>
                <Text>{props.errMess}</Text>
            </View>
        )
    }

    if (item) {  //if no line 17, the destruct code, it is also ok, change this line to if(props.item) and also below should change from item. to props.item.
        return (
            <Card
                featuredTitle={item.name}
                image={{uri: baseUrl + item.image}}
            >
                <Text style={{margin: 10}}>
                    {item.description}
                </Text>
            </Card>
        );
    }
    return <View />;
}

class Home extends Component {

    constructor (props) {
        super (props);
        this.state = {
            scaleValue: new Animated.Value(0)  //here scalevalue can be any name. Typically initialized with new Animated.Value(0);
        };
    }

    animate() {  //here animate can be any name
        Animated.timing(
            this.state.scaleValue,
            {
                toValue: 1,
                duration: 1500,  //This will animate animatedValue from 0 to 100% over the course of 1.5 seconds.
                useNativeDriver: true
            }
        ).start()
    }
  
    componentDidMount() {
        this.animate();
    }

    static navigationOptions = {
        title: 'Home'
    }

    render() {
        return (
            <Animated.ScrollView style={{transform: [{scale: this.state.scaleValue}]}}>
                <RenderItem 
                    item={this.props.campsites.campsites.filter(campsite => campsite.featured)[0]}
                    isLoading={this.props.campsites.isLoading}
                    errMess={this.props.campsites.errMess}
                />
                <RenderItem 
                    item={this.props.promotions.promotions.filter(promotion => promotion.featured)[0]}
                    isLoading={this.props.promotions.isLoading}
                    errMess={this.props.promotions.errMess}
                />
                <RenderItem 
                    item={this.props.partners.partners.filter(partner => partner.featured)[0]}
                    isLoading={this.props.partners.isLoading}
                    errMess={this.props.partners.errMess}
                />
            </Animated.ScrollView>
        );
    }
}

export default connect(mapStateToProps)(Home);