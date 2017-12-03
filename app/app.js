import React, { Component } from 'react'
import Header from './components/header'
import Logo from './components/logo'
let duration = null
class App extends Component {
    render() {
        console.log(this.props.children)
        return (
            <div className="container">
                <Logo></Logo>
                {this.props.children}
                {/* {React.cloneElement(this.props.children, this.state)} */}
            </div>
        )
    }
}
export default App;