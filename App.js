import React, {Component} from 'react';
import {Provider} from 'react-redux';
import store from './store';
import {Root} from "native-base";

import Home from './components/home';
import Login from './components/login';
import Month from './components/month';
import {
    StackNavigator,
} from 'react-navigation';

console.disableYellowBox = true;

const Navigator = StackNavigator({
    Login: {screen: Login},
    Home: {screen: Home},
    Month: {screen: Month},
});

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Root>
                    <Navigator/>
                </Root>
            </Provider>
        );
    }
}


export default App;