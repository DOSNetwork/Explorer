import React from 'react'
import { Switch, Route, matchPath } from "react-router-dom";
import SearchInput from '../../components/SearchInput'
import './style.scss';
import { EventsList } from './events'
import { GroupDetail } from './group'
import { RequestDetail } from './request'
import { AddressDetail } from './address'
class Search extends React.Component {
    handleSearch = (text) => {
        let { currentPageIndex, pageSize } = this.props.searchResult
        this.props.explorerSearch(text, pageSize, currentPageIndex, this.props.history)
    }
    componentDidMount() {
        let searchText = ''
        let match = matchPath(this.props.location.pathname, {
            path: "/explorer/:type/:id",
            exact: true,
            strict: false
        })
        if (match) {
            let { id } = match.params;
            searchText = id
        }
        this.handleSearch(searchText)
    }
    render() {
        return (<>
            <SearchInput onSearch={this.handleSearch}></SearchInput>
            <Switch>
                <Route exact path="/explorer/" component={() => (
                    <EventsList {...this.props.searchResult}></EventsList>
                )} />
                <Route exact path="/explorer/group/:groupId" component={() => (
                    <GroupDetail {...this.props.searchResult}></GroupDetail>
                )} />
                <Route exact path="/explorer/request/:requestId" component={() => (
                    <RequestDetail {...this.props.searchResult}></RequestDetail>
                )} />

                <Route exact path="/explorer/address/:requestId" component={() => (
                    <AddressDetail {...this.props.searchResult}></AddressDetail>
                )} />
            </Switch>
        </>)
    }
}
export default Search;
