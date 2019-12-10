import React, { Component } from 'react'
import { Icon, Button, Input, AutoComplete } from 'antd';
import { injectIntl } from 'react-intl'
import './style.scss';
import { withRouter } from "react-router";
class SearchInput extends Component {
    state = {
        currentText: '',
        dataSource: ["LogRegisteredNewPendingNode",
            "LogUnRegisteredNewPendingNode",
            "LogGrouping",
            "LogPublicKeySuggested",
            "LogPublicKeyAccepted",
            "LogGroupDissolve",
            "LogUpdateRandom",
            "LogUrl",
            "LogRequestUserRandom",
            "LogValidationResult",
            "LogCallbackTriggeredFor",
            "GuardianReward",
            "LogMessage"]
    }
    // componentDidMount() {
    //     this.props.onSearch(this.state.currentText)
    // }
    searching = () => {
        this.props.onSearch(this.state.currentText)
    }
    handleSearch = value => {
        this.setState({
            // dataSource: dataSource.filter(txt => (txt.indexOf(value) > -1)),
            currentText: value
        })
    }
    handleKeyPress = ev => {
        let key = ev.charCode;
        if (key === 13) {
            this.searching()
        }
    }
    render() {
        const { dataSource } = this.state
        let { formatMessage: f } = this.props.intl;
        return (
            <div className="search-input--wrapper">
                <AutoComplete
                    className="search-input"
                    size="large"
                    style={{ width: '100%' }}
                    dataSource={dataSource}
                    onSearch={this.handleSearch}
                    onSelect={this.handleSearch}
                    placeholder={f({ id: 'Tooltip.Search.placeholder' })}
                    backfill={true}
                    filterOption={(inputValue, option) =>
                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                >
                    <Input
                        suffix={
                            <Button
                                className="search-btn"
                                style={{ marginRight: -12 }}
                                size="large"
                                type="primary"
                                onClick={this.searching}
                            >
                                <Icon style={{ fontSize: 27 }} type="search" />{f({ id: 'Form.Button.Search' })}
                            </Button>
                        }
                        onKeyPress={this.handleKeyPress}
                    />
                </AutoComplete>
            </div>
        )
    }
}


export default withRouter(injectIntl(SearchInput));
