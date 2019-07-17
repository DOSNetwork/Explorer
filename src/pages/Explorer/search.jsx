import React from 'react'
import { Switch, Route } from "react-router-dom";
import SearchInput from '../../components/SearchInput'
import './style.scss';
import { EventsList } from './events'

class Search extends React.Component {
    handleSearch = (text) => {
        let { currentPageIndex, pageSize } = this.props.searchResult
        this.props.explorerSearch(text, pageSize, currentPageIndex, this.props.history)
    }
    render() {
        return (<>
            <SearchInput onSearch={this.handleSearch}></SearchInput>
            <Switch>
                <Route exact path="/explorer/" component={() => (
                    <EventsList {...this.props.searchResult}></EventsList>
                )} />
                <Route exact path="/explorer/rq/:requestId" component={() => (
                    'request'
                )} />
            </Switch>
        </>)
    }
}
export default Search;
