import React, {Component} from 'react';
import { Text, View, ScrollView, FlatList } from 'react-native';
import { Card, Icon, Input, Rating } from 'react-native-elements';
import { connect } from 'react-redux'; 
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators' // this is like the ones (fetch...) in the MainComponent.js
import { Modal, Button, StyleSheet } from 'react-native'


const mapStateToProps = state => {  
    return  {
        campsites: state.campsites,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = {
    postFavorite: campsiteId => (postFavorite(campsiteId))
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
        <Card title='Comments'>
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}/>
        </Card>
    );
}


function RenderCampsite(props) {
    const { campsite } = props; // it is destruct of props
    if (campsite) {
        return (
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
        console.log(JSON.stringify(this.state));
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
                                        this.handleComment();
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