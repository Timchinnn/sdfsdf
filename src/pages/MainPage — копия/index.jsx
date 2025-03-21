import React, {useState, useRef, useEffect} from "react";
import routeMain from "./routes";
import MainSection from "components/MainSection";
import MobileNav from "components/MobileNav";

import DefaultImg from 'assets/img/default-card.png';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

// Import Swiper modules
import { EffectCoverflow } from 'swiper/modules';
import ShopPopup from "components/ShopPopup";
import MainCarousel from "components/MainCarousel";

const MainPage = () => {

    const [activeShopPopup, setActiveShopPopup] = useState(false);

    const swiperRef = useRef(null);
    // const swiperRef = useRef(null);

    // // Начальное время и позиция для определения скорости свайпа
    // let touchStartTime = 0;
    // let touchStartPosition = 0;
  
    // const handleTouchStart = (e) => {
    //   touchStartTime = new Date().getTime();
    //   touchStartPosition = e.touches[0].clientX;
    // };
  
    // const handleTouchEnd = (e) => {
    //   const touchEndTime = new Date().getTime();
    //   const touchEndPosition = e.changedTouches[0].clientX;
  
    //   const timeDiff = touchEndTime - touchStartTime;
    //   const positionDiff = touchEndPosition - touchStartPosition;
    //   const swipeSpeed = Math.abs(positionDiff / timeDiff);
  
    //   // Увеличиваем количество слайдов для прокрутки в зависимости от скорости свайпа
    //   if (swiperRef.current) {
    //     if (swipeSpeed > 0.5) {
    //       swiperRef.current.swiper.slideNext(Math.floor(swipeSpeed * 2));
    //     }
    //   }
    // };

    const handleSlideChange = () => {
        if (swiperRef.current) {
          console.log("Current active index:", swiperRef.current.swiper.activeIndex);
        }
      };

      const goToNextSlide = () => {
        if (swiperRef.current) {
          swiperRef.current.slideNext(); // переключение на следующий слайд
        }
      };

    const handleOpenPopup = () => {
        setTimeout(function() {
            document.documentElement.classList.add('fixed');
            setActiveShopPopup(true);
        }, 1000)
    }

    const handleClosePopup = () => {
        document.documentElement.classList.remove('fixed');
        setActiveShopPopup(false);
    }

    return(
        <section className="main">
            <div className="container">
                <div className="friends-inner">
                    <MainSection />
                    <div className="main-game">
                        <MainCarousel getActiveSlide={3} handleOpenPopup={handleOpenPopup} />
                        
                     
                        {/* <div className="main-slider">
                            <Swiper
                                onSwiper={(swiper) => (swiperRef.current = swiper)} 
                                modules={[EffectCoverflow]}
                                effect="coverflow"
                                loop={true}
                                centeredSlides={true}
                                slidesPerView="auto"
                                coverflowEffect={{
                                    rotate: 0,
                                    stretch: 100,
                                    depth: 200,
                                    modifier: 0.5,
                                    slideShadows: false,
                                }}
                                
                                >
                                <SwiperSlide>
                                    <div className="main-slider__item">
                                        <div className="main-slider__card" onClick={handleOpenPopup}>
                                            <p className="main-slider__image">
                                                <img src={DefaultImg} alt="" />
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="main-slider__item">
                                        <div className="main-slider__card" onClick={handleOpenPopup}>
                                            <p className="main-slider__image">
                                                <img src={DefaultImg} alt="" />
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="main-slider__item">
                                        <div className="main-slider__card" onClick={handleOpenPopup}>
                                            <p className="main-slider__image">
                                                <img src={DefaultImg} alt="" />
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="main-slider__item">
                                        <div className="main-slider__card" onClick={handleOpenPopup}>
                                            <p className="main-slider__image">
                                                <img src={DefaultImg} alt="" />
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="main-slider__item">
                                        <div className="main-slider__card" onClick={handleOpenPopup}>
                                            <p className="main-slider__image">
                                                <img src={DefaultImg} alt="" />
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="main-slider__item">
                                        <div className="main-slider__card" onClick={handleOpenPopup}>
                                            <p className="main-slider__image">
                                                <img src={DefaultImg} alt="" />
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="main-slider__item">
                                        <div className="main-slider__card" onClick={handleOpenPopup}>
                                            <p className="main-slider__image">
                                                <img src={DefaultImg} alt="" />
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="main-slider__item">
                                        <div className="main-slider__card" onClick={handleOpenPopup}>
                                            <p className="main-slider__image">
                                                <img src={DefaultImg} alt="" />
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="main-slider__item">
                                        <div className="main-slider__card" onClick={handleOpenPopup}>
                                            <p className="main-slider__image">
                                                <img src={DefaultImg} alt="" />
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="main-slider__item">
                                        <div className="main-slider__card" onClick={handleOpenPopup}>
                                            <p className="main-slider__image">
                                                <img src={DefaultImg} alt="" />
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="main-slider__item">
                                        <div className="main-slider__card" onClick={handleOpenPopup}>
                                            <p className="main-slider__image">
                                                <img src={DefaultImg} alt="" />
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            </Swiper>
                        </div> */}
                        
                    </div>
                </div>
            </div>
            <ShopPopup active={activeShopPopup} main={true} setActivePopup={setActiveShopPopup} handleClosePopup={handleClosePopup} />
            <MobileNav />
        </section>
    )
};

export {routeMain};

export default MainPage;