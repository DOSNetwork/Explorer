import React from 'react'
import { Switch, Route, matchPath } from "react-router-dom";
import SearchInput from '../../components/SearchInput'
import './style.scss';
import { EventsList } from './events'
import { GroupDetail } from './group'
import { RandomDetail } from './random'
import { UrlDetail } from './url'
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
                    <EventsList {...this.props.searchResult} explorerSearch={this.props.explorerSearch}
                        history={this.props.history}></EventsList>
                )} />
                <Route exact path="/explorer/group/:groupId" component={() => (
                    <GroupDetail {...this.props.searchResult}></GroupDetail>
                )} />
                <Route exact path="/explorer/random/:requestId" component={() => (
                    <RandomDetail {...this.props.searchResult}></RandomDetail>
                )} />

                <Route exact path="/explorer/address/:addressId" component={() => (
                    <AddressDetail {...this.props.searchResult}></AddressDetail>
                )} />

                <Route exact path="/explorer/url/:requestId" component={() => (
                    <UrlDetail {...this.props.searchResult}></UrlDetail>
                )} />
            </Switch>
        </>)
    }
}
export default Search;
