import React, { PureComponent } from 'react'
import Footer from '../components/Footer/footerContainer'
export default class Layout extends PureComponent {
    render() {
        return (
            <div id="main">
                <div className="header">
                    {this.props.children[0]}
                </div>
                <div className="main-body">
                    {this.props.children[1]}
                </div>
                <Footer></Footer>
            </div>
        )
    }
}
