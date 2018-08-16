import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import {setUser} from './../actions';

import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Button,
} from 'react-native';

import t from 'tcomb-form-native';
import templates from 'tcomb-form-templates-bootstrap';

const Form = t.form.Form;
t.form.Form.templates = templates;

const User = t.struct({
    email: t.String,
    password: t.String,
});

class Login extends Component {
    constructor() {
        super();
        this.state = {
            form: {}
        }
    }
    static navigationOptions = {
        header: null,
    };

    onSubmit = () => {
        const value = this.refs.form.getValue();
        if (value) {
            const objectSave = _.pick(value, ['email','password']);
            console.log("value: ",value);
            console.log("objectSave: ",objectSave);
            this.props.setUser(objectSave.email);
            this.props.navigation.navigate('Home', {userData: objectSave });
        }
    };

    render() {

        const options = {
            fields: {
                password: {
                    password: true,
                    secureTextEntry: true
                }
            }
        };

        return (
            <View style={styles.container}>
                <Text style={styles.header}>Despesa Simples</Text>
                <Form type={User} ref="form" options={options}/>
                <Button style={styles.button} title="Login" onPress={this.onSubmit}/>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        config: state.config,
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 25,
        marginRight: 25,
        marginTop: 50,
    },
    header: {
        marginBottom: 50,
        alignItems: 'center',
        fontSize: 28
    },
    button: {
        flex: 1,
        justifyContent: 'center',
    }
});

export default connect(mapStateToProps, {setUser})(Login);


