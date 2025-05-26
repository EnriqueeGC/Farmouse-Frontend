import React, { Fragment } from 'react';

import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Products from '../components/product-card/product';
import FloatingButton from './FloatingButton';
import Slider from '../components/slider/Slider';
import VideoPromocional from './video';
import NuestrasMarcas from './NuestrasMarcas';

const Home = () => {
    return (
        <Fragment>
            <Header />
            <Slider />
            <Products/>
            <NuestrasMarcas/>
            <VideoPromocional/>
            <Footer />
            <FloatingButton />
        </Fragment>
    );
};

export default Home;
