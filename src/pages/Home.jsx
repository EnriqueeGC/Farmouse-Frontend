import React, { Fragment } from 'react';

import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Products from '../components/product-card/product';

const Home = () => {
    return (
        <Fragment>
            <Header />
            <Products/>
            <Footer />
        </Fragment>
    );
};

export default Home;
