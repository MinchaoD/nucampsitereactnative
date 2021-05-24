import React, {Component} from 'react';
import { Text, View, ScrollView, FlatList, Alert, PanResponder } from 'react-native';
import { Card, Icon, Input, Rating } from 'react-native-elements';
import { connect } from 'react-redux'; 
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators' // this is like the ones (fetch...) in the MainComponent.js
import { Modal, Button, StyleSheet } from 'react-native'
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {  
    return  {
        campsites: state.campsites,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = {
    postFavorite: campsiteId => (postFavorite(campsiteId)),
    postComment: (campsiteId, rating, author, text) => (postComment(campsiteId, rating, author, text))
}

function RenderComments({comments}) {
    const renderCommentItem = ({item}) => {
        return (
            <View style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.text}</Text>
                <Rating
                    readonly
                    startingValue={item.rating}
                    imageSize={10}
                    style={{alignItems:'flex-start', paddingVertical:'5%'}}
                />
                <Text style={{fontSize: 12}}>{`--${item.author}, ${item.date}`}</Text>
            </View>
                
        )
    };
    return (
        <Animatable.View animation='fadeInUp' duration={2000} delay={1000}> 
            <Card title='Comments'>
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}/>
   
            </Card>
        </Animatable.View>
    );
}


function RenderCampsite(props) {
    const { campsite } = props; // it is destruct of props

    const view = React.createRef(); //Refs are commonly assigned to an instance property when a component is constructed so they can be referenced throughout the component.
    // here use createRef to connect the rubberband animation to the component

    const recognizeComment = ({dx}) => (dx > 200) ? true : false;  // dx >200 means from left to right, if > 200, then true
    const recognizeDrag = ({dx}) => (dx < -200) ? true: false;  //recognizeDrag here can be any name. dx is pan/swipe horizontally, if<-200, means from right to left. if dy means vertically pan.
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,

        onPanResponderGrant: () => {  // added this line of code is to do between Panresponderstart and Panresponderend
            view.current.rubberBand(1000) // rubberBand is a built in animation
            .then(endState => console.log(endState.finished ?  'finished' : 'cancelled')) // here is just to show we can add any other function if we need, this console.log is not necessary just an example
            // when the rubberBand animation is finished, it will console.log 'finished'
        },

        onPanResponderEnd: (e, gestureState) => {  // gestureState here is the actual number for dx when doing the pan, like -300, which is <-200, then it trigger the Alert.
            // e here is no use, but we have to have it so we can use the 2nd parameter gestureState
            console.log('pan responder end', gestureState);
            if (recognizeDrag(gestureState)) {
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add' + campsite.name +' to favorites?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                            onPress: () => console.log('Cancel Pressed')
                        },
                        {
                            text: 'OK',
                            onPress: () => props.favorite ? console.log('Already set as a favorite') : props.markFavorite()
                        }
                    ],
                    { cancelable: false }
                )
            }
            else if (recognizeComment(gestureState)){ // if recognizeComment which is from left to right and > 200, then open up the modal
                props.onShowModal()
            }

            return true; // it seems if no this line of code, it will work too.
        }
    })

    if (campsite) {
        return (  // below add {...panResponder.panHandlers} is to connect the panResponder from above to this component, so beside press on heart icon directly to make it 
            // favorite, this pan method is another way to add favorite here
            <Animatable.View 
                animation='fadeInDown' 
                duration={2000} 
                delay={1000} 
                ref={view} // here is to connect the ref for rubberband animation, it will apply on all the pans, including the ones are not dx <-200
                {...panResponder.panHandlers}>   

                <Card 
                    featuredTitle = {campsite.name}
                    image = {{uri: baseUrl + campsite.image}}>
                    <Text style={{margin: 10}}> 
                    {/* here style is like css */}
                        {campsite.description}
                    </Text>
                    <View style={styles.cardRow}>
                        <Icon
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            raised
                            reverse
                            onPress={() => props.favorite ? console.log('Already set as a favorite') : props.markFavorite()} />
                        <Icon
                            name='pencil'
                            type='font-awesome'
                            color='#5637DD'
                            raised
                            reverse
                            onPress={() => props.onShowModal()} />
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    return <View />
}

class CampsiteInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            favorite: false,
            showModal: false,
            rating: 5,
            author: '',
            text: ''
           }
        };
    

    toggleModal() {
        this.setState({showModal: !this.state.showModal})
    }

    handleComment(campsiteId) { 
        console.log(JSON.stringify(this.state)),
        this.props.postComment(campsiteId, this.state.rating, this.state.author, this.state.text),
        this.toggleModal()

    }

    resetForm() {
        this.setState({  
            favorite: false,
            showModal: false,
            rating: 5,
            author: '',
            text: '',
        })
    }

    markFavorite(campsiteId){
        this.props.postFavorite(campsiteId);
    }

    static navigationOptions = {
        title: 'Campsite Information'  // this will show on the screen header
    }

    render() {
        const campsiteId = this.props.navigation.getParam('campsiteId');
        const campsite = this.props.campsites.campsites.filter(campsite => campsite.id === campsiteId) [0];
        const comments = this.props.comments.comments.filter(comment => comment.campsiteId === campsiteId)
        return (
                <ScrollView>
                    <RenderCampsite campsite={campsite}
                        favorite={this.props.favorites.includes(campsiteId)}  // this will return a boolean, true or false, to react with line 59.
                        markFavorite={() => this.markFavorite(campsiteId)}
                        onShowModal={() => this.toggleModal()} />
                    <RenderComments comments={comments} />
                    <Modal 
                    animationType= {'slide'}  
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => this.toggleModal()}>
                        <View style={styles.modal}>
                            <Rating
                                showRating
                                startingValue = {this.state.rating}
                                imageSize={40}
                                onFinishRating={(rating) => {this.setState({rating: rating})}}
                                style={{paddingVertical: 10}} />
                            <Input  //value below has to be this.state...
                                placeholder='Author'
                                leftIcon = {{type: 'font-awesome', name: 'user-o'}}
                                leftIconContainerStyle = {{paddingRight:10}}
                                onChangeText= {(text) => {this.setState({author: text})}}
                                value= {this.state.author} />  
                            <Input 
                                placeholder='Comment'
                                leftIcon = {{type: 'font-awesome', name: 'comment-o'}}
                                leftIconContainerStyle = {{paddingRight:10}}
                                onChangeText= {text => this.setState({text: text})}
                                value= {this.state.text} />  
                            <View style={{marginBottom:20}}>
                                <Button 
                                    onPress = {() => {   
                                        this.handleComment(campsiteId);
                                        this.resetForm();
                                    }}
                                    color = '#5637DD'
                                    title = 'SUBMIT' />
                            </View>
                            <View>
                                <Button 
                                    onPress = {() => {
                                        this.toggleModal();
                                        this.resetForm();
                                    }}
                                    color = '#808080'
                                    title = 'CANCEL' />
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    cardRow: {
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20},
    modal: {
        justifyContent: 'center',
        margin: 20
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);
// the purpose of putting favorite in redux is to save the favorited campsiteId to state and stored. 