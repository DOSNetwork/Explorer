import React, { Component } from 'react'
import { Icon, Button, Input, AutoComplete } from 'antd';
import './style.scss';
const { Option } = AutoComplete;
const dataSource = [
    'delegate', 'requsest Random', 'trigger Callback'
];

export default class SearchInput extends Component {
    state = {
        dataSource: dataSource,
        currentText: ''
    }
    searching = () => {
        this.props.onSearch(this.state.currentText)
    }
    handleSearch = value => {
        this.setState({
            dataSource: dataSource.filter(txt => (txt.indexOf(value) > -1)),
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
        const options = dataSource
            .map(txt => (
                <Option key={txt} value={txt}>
                    {txt}
                </Option>
            ))
        return (
            <div className="search-input--wrapper">
                <AutoComplete
                    className="search-input"
                    size="large"
                    style={{ width: '100%' }}
                    dataSource={options}
                    onSearch={this.handleSearch}
                    placeholder="Search by Event, RequestId, GroupId and Address"
                    backfill={true}
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
                                <Icon style={{ fontSize: 27 }} type="search" />Search
                            </Button>
                        }
                        onKeyPress={this.handleKeyPress}
                    />
                </AutoComplete>
            </div>
        )
    }
}
