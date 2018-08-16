import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Header,
    Title,
    Button,
    Left,
    Right,
    Body,
    Icon,
} from 'native-base';


class HeaderDs extends Component {

    render() {
        return (

            <Header>
                <Body>
                <Title>{this.props.config.appName}</Title>
                </Body>
                <Right/>
            </Header>
        );
    }
}

function mapStateToProps(state) {
    return {
        config: state.config,
    };
}

export default connect(mapStateToProps, {})(HeaderDs);


