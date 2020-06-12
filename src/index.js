import React, {useState} from 'react';
import {render} from 'react-dom';

import './style.scss';

const App = () => {
    const [title, setTitle] = useState('Hello, Webpack');

    return (
        <h1 onClick={() => setTitle(title + '!')}>{title}</h1>
    );
};

render(<App/>, document.getElementById('root'));