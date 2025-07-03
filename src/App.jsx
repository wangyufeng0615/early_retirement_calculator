import React from 'react';
import Header from './Header.jsx';
import RetirementCalculator from './RetirementCalculator.jsx';

const App = () => {
    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <RetirementCalculator />
            </main>
        </div>
    );
};

export default App;
