import React from 'react'
import { Switch, Route } from "react-router-dom";
import SearchInput from '../../components/SearchInput'
import './style.scss';
import { EventsList } from './events'

export default function Search(props) {
    let { currentPageIndex, pageSize } = props
    function handleSearch(text) {
        props.explorerSearch(text, pageSize, currentPageIndex)
    }
    return (<>
        <SearchInput onSearch={handleSearch}></SearchInput>
        <Switch>
            <Route exact path="/explorer/" component={() => (
                <EventsList {...props}></EventsList>
            )} />
        </Switch>
    </>)
}
