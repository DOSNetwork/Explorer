import React from 'react'
import { Switch, Route, matchPath } from "react-router-dom";
import SearchInput from '../../components/SearchInput'
import ScrollTop from '../../components/ScrollTop'
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
            <ScrollTop></ScrollTop>
            <Switch>
                <Route exact path="/explorer/" component={() => (
                    <EventsList {...this.props.searchResult} explorerSearch={this.props.explorerSearch}
                        history={this.props.history}></EventsList>
                )} />
                <Route exact path="/explorer/group/:groupId" component={() => (
                    <div className="search-result--wrapper">
                        <GroupDetail {...this.props.searchResult}></GroupDetail>
                    </div>
                )} />
                <Route exact path="/explorer/random/:requestId" component={() => (
                    <div className="search-result--wrapper">
                        <RandomDetail {...this.props.searchResult}></RandomDetail>
                    </div>
                )} />

                <Route exact path="/explorer/address/:addressId" component={() => (
                    <div className="search-result--wrapper">
                        <AddressDetail {...this.props.searchResult}></AddressDetail>
                    </div>
                )} />

                <Route exact path="/explorer/url/:requestId" component={() => (
                    <div className="search-result--wrapper">
                        <UrlDetail {...this.props.searchResult}></UrlDetail>
                    </div>
                )} />
            </Switch>
        </>)
    }
}
export default Search;
