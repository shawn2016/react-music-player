import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Hello from './components/hello'
render(
    <AppContainer>
        <Hello></Hello>
    </AppContainer>,
    document.getElementById('root')
)
// Webpack Hot Module Replacement API
if (module.hot) {
    module.hot.accept('./components/hello', () => {
        const NewRoot = require('./components/hello').default;
        render(
            <AppContainer>
                <NewRoot />
            </AppContainer>,
            document.getElementById('root')
        );
    })
}