import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import HeaderDs from './header-ds';
import {setCashFlow, copyMonthCashFlow} from './../actions';
import {
    Container,
    Content,
    Button,
    List,
    ListItem,
    Text,
    Toast,
    H3,
    Icon,
    Right,
    Left
} from 'native-base';
import Overlay from 'react-native-modal-overlay';
import t from 'tcomb-form-native';
import templates from 'tcomb-form-templates-bootstrap';
import shortid from 'shortid';
import {
    StyleSheet,
    View,
    ScrollView
} from 'react-native';

const Form = t.form.Form;
t.form.Form.templates = templates;

const Operation = t.struct({
    description: t.String,
    value: t.String,
    day: t.Date
});


class Month extends Component {

    constructor() {
        super();
        this.state = {
            formModalOperations: {},
            formModalCopy: {},
            total: 0,
            toastState: false,
            modalVisibleOperation: false,
            modalVisibleCopy: false,
            operation: null,
            copyMonth: []
        }
    }

    static navigationOptions = {
        header: null,
    };

    setModalVisible = (visible, op, modal) => {
        this.setState({[modal]: visible, operation: op});
    };

    onConfirmOperation = () => {
        const {params} = this.props.navigation.state;
        const value = this.refs.formModalOperations.getValue();
        if (value) {
            let objectSave = _.pick(value, ['value', 'description', 'day']);
            objectSave.value = eval(this.state.operation === "add" ? objectSave.value : "-" + objectSave.value);
            console.log("objectSave: ", objectSave, ">>>", shortid());
            this.props.setCashFlow(
                _.merge(objectSave, {id: shortid()}),
                moment(params.month).format("GGGG"),
                moment(params.month).format("MM"),
            );
        }
        this.setModalVisible(false, null, 'modalVisibleOperation');
    };

    operationsModal = () => {
        let myFormatFunction = (format, date) => {
            return moment(date).format(format);
        };

        const options = {
            fields: {
                day: {
                    label: 'Dia',
                    mode: 'date',
                    config: {
                        format: (date) => myFormatFunction("YYYY-MM-DD", date)
                    }
                },
                description: {
                    label: 'Descrição'
                },
                value: {
                    label: 'Valor R$'
                },

            }
        };
        return (
            <Overlay visible={this.state.modalVisibleOperation}
                     onClose={() => this.setModalVisible(false, null, 'modalVisibleOperation')}
                     closeOnTouchOutside
                     animationType="zoomIn"
                     containerStyle={{backgroundColor: 'rgba(37, 8, 10, 0.78)',}}
                     childrenWrapperStyle={{backgroundColor: '#eee', alignItems: 'stretch'}}
                     animationDuration={500}>

                <Form type={Operation} ref="formModalOperations" options={options}/>

                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginBottom: 50}}>
                    <Button onPress={() => this.onConfirmOperation()} rounded light>
                        <Icon name='ios-add-outline'/>
                    </Button>
                    <Button onPress={() => this.setModalVisible(false, null, 'modalVisibleOperation')} rounded light>
                        <Icon name='ios-close-outline'/>
                    </Button>
                </View>
            </Overlay>
        );
    };

    setMonthsToCopy = () => {
        let value = this.refs.formModalCopy.getValue();
        this.setState({
            copyMonth: [...this.state.copyMonth, _.pick(value, 'to')]
        });
        console.log("copyMonth: ", this.state.copyMonth);
        console.log("value: ", value);
    };

    removeMonthToCopy = (toRemove) => {
        let copy = _.remove(this.state.copyMonth, (c) => c.to === toRemove);
        this.setState({
            copyMonth: copy
        });
    };

    onConfirmCopy = () => {
        const {params} = this.props.navigation.state;
        this.props.copyMonthCashFlow(this.state.copyMonth, moment(params.month).format("MM"));
        this.setModalVisible(false, null, 'modalVisibleCopy');
        this.setState({copyMonth: []});
    };

    copyModal = () => {
        const {params} = this.props.navigation.state;
        let monthModel = {};
        const currentMonth = (n) => moment().startOf('year').add(n, 'month');
        _.times(12, (n) => currentMonth(n).format("MM") !== moment(params.month).format("MM") ?
            monthModel[currentMonth(n).format("MM")] = currentMonth(n).format("MMMM") : null);

        console.log("monthModel: ", monthModel);

        const Months = t.enums(monthModel, 'Months');

        const Copy = t.struct({
            to: Months,
        });

        const options = {
            fields: {
                to: {
                    label: 'Copiar para: '
                },
                from: {
                    hidden: true
                }
            }
        };

        const removeMonth = () => this.removeMonthToCopy();

        const getMonth = (n) => moment().startOf('year').add(parseInt(this.state.copyMonth[n].to) - 1, 'month');

        return (
            <Overlay visible={this.state.modalVisibleCopy}
                     onClose={() => this.setModalVisible(false, null, 'modalVisibleCopy')}
                     closeOnTouchOutside
                     animationType="zoomIn"
                     containerStyle={{backgroundColor: 'rgba(37, 8, 10, 0.78)',}}
                     childrenWrapperStyle={{backgroundColor: '#eee', alignItems: 'stretch'}}
                     animationDuration={500}>
                <Form type={Copy} ref="formModalCopy" options={options}/>
                <Button onPress={() => this.setMonthsToCopy()} rounded light>
                    <Icon name='ios-add-outline'/>
                </Button>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    {_.times(this.state.copyMonth.length, (n) =>
                        <ListItem key={n}>
                            <Left>
                                <Text key={n}>{getMonth(n).format("MMM")}</Text>
                            </Left>
                            <Right>
                                <Right>
                                    <Icon onPress={() => removeMonth(getMonth(n).format("MM"))}
                                          name="ios-remove-circle-outline"/>
                                </Right>
                            </Right>
                        </ListItem>
                    )
                    }
                </ScrollView>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginBottom: 50}}>
                    <Button onPress={() => this.onConfirmCopy()}>
                        <Text>COPIAR</Text>
                    </Button>
                </View>
            </Overlay>
        );
    };

    getCreditsAndDebits = () => {
        let {years, currentYear} = this.props.cashFlow;
        const {params} = this.props.navigation.state;
        const currentMonth = moment(params.month).format("MM");
        const toastDetail = (text) => Toast.show({text: text, position: 'bottom', buttonText: 'Okay'});

        let renderCreditsAndDebits = [];
        _.forEach(years[currentYear][currentMonth], (operation, idx) => {
                renderCreditsAndDebits.push(<ListItem onPress={() => toastDetail(operation.description)} key={idx}>
                    <Text>R$ {operation.value}</Text>
                </ListItem>);
            }
        );
        return renderCreditsAndDebits;
    };

    render() {
        const {navigate} = this.props.navigation;
        const {params} = this.props.navigation.state;

        return (
            <Container>
                <HeaderDs/>
                <Content>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'baseline', padding: 15}}>
                        <H3 style={{marginTop: 13, marginRight: 15}}>{moment(params.month).format("MMMM")}</H3>
                        <Button onPress={() => navigate('Home', {property1: 'MOVED'})} rounded light>
                            <Icon name='ios-arrow-back-outline'/>
                        </Button>

                        <Button onPress={() => this.setModalVisible(true, "add", 'modalVisibleOperation')} rounded
                                light>
                            <Icon name='ios-add-outline'/>
                        </Button>
                        <Button onPress={() => this.setModalVisible(true, "subtract", 'modalVisibleOperation')} rounded
                                light>
                            <Icon name='ios-remove-outline'/>
                        </Button>
                        <Button onPress={() => this.setModalVisible(true, null, 'modalVisibleCopy')} rounded light>
                            <Icon name='ios-copy-outline'/>
                        </Button>
                    </View>
                    <View>{this.operationsModal()}</View>
                    <View>{this.copyModal()}</View>
                    <List>
                        {this.getCreditsAndDebits()}
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
        cashFlow: state.cashFlow
    };
}

const styles = StyleSheet.create({
    contentContainer: {
        paddingVertical: 20
    }
});

export default connect(mapStateToProps, {setCashFlow, copyMonthCashFlow})(Month);


