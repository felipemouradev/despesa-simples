import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import HeaderDs from './header-ds';

import {
    Container,
    Content,
    Button,
    List,
    ListItem,
    Text,
    Left,
    Right
} from 'native-base';

import {
    StyleSheet,
} from 'react-native';

class App extends Component {

    static navigationOptions = {
        header: null,
    };

    getListMonth = () => {
        const {navigate} = this.props.navigation;
        let {years, currentYear} = this.props.cashFlow;

        let onPress = (month) => navigate('Month', {month: moment().startOf('year').add(month, 'month')});
        let renderMonths = [];
        const calcMonth = (month) => _.reduce(years[currentYear][month], (result, operation)=>parseInt(result) + parseInt(operation.value), 0);

        _.times(12, (n) => {
            let currentMonth = moment().startOf('year').add(n, 'month');
            renderMonths.push(
                <ListItem key={n} onPress={() => onPress(n)}>
                    <Left>
                        <Text>{currentMonth.format("MMMM")}</Text>
                    </Left>
                    <Right>
                        <Text>R$ {calcMonth(currentMonth.format("MM"))}</Text>
                    </Right>
                </ListItem>
            );
            }
        );
        return renderMonths;
    };

    render() {
        const {navigate} = this.props.navigation;
        return (
            <Container>
                <HeaderDs/>
                <Text style={styles.welcome}>
                    Bem vindo {this.props.user.email}
                </Text>
                <Content>
                    <List>
                        {this.getListMonth()}
                    </List>
                </Content>
                <Button
                    title="Do Login"
                    onPress={() => navigate('Login', {property1: 'MOVED'})}
                />
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        config: state.config,
        user: state.user,
        cashFlow: state.cashFlow
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8E44AD',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: '#000'
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

export default connect(mapStateToProps, {})(App);


