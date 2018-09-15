import * as React from 'react';
import * as ReactDOM from 'react-dom';

class Main extends React.Component {
    render() {
        return <h1>Hello Wolrd</h1>
    }
}

window.addEventListener('load', () => {
    ReactDOM.render(<Main />, document.body);
});