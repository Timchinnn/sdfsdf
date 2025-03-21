import React from "react";
import routeSets from "./routes";
import MainSection from "components/MainSection";

// import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";

// import DefaultImg from "assets/img/default-img.png";
// import CoinIcon from "assets/img/coin-icon.svg";
// import StarIcon from "assets/img/star-icon.svg";

import MobileNav from "components/MobileNav";

const SetsPage = () => {
  //   const [openAccordion, setOpenAccordion] = useState(null);

  //   const handleAccordionClick = (id) => {
  //     // Открываем выбранный аккордеон, а остальные закрываем
  //     setOpenAccordion(openAccordion === id ? null : id);
  //   };

  return (
    <section className="sets">
      <div className="container">
        <div className="tasks-inner">
          <MainSection />
          <div
            className="block-style"
            style={{ textAlign: "center", padding: "20px", marginTop: "6px" }}
          >
            Скоро
          </div>
          {/* <ul className="city-list">
                        <li className="city-list__item block-style">
                            <div className={`city-list__title f-jcsb ${openAccordion === 1 ? 'active' : ''}`} onClick={()=> handleAccordionClick(1)}>
                                <div className="sets-offer">
                                    Сет «Культура»
                                    <ul className="friends-params f-center">
                                        <li className="friends-params__item f-center">
                                            <img src={StarIcon} alt="" />
                                            500 EXP
                                        </li>
                                        <li className="friends-params__item f-center">
                                            <img src={CoinIcon} alt="" />
                                            2000
                                        </li>
                                    </ul>
                                </div>
                                <div className="city-list__more f-center">
                                    <div className="city-list__count">
                                        5 из 12
                                    </div>
                                    <div className="city-list__arrow">
                                        <svg width="15" height="9" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14.6592 1.56103L8.23438 8.13525C8.08496 8.29297 7.88574 8.38428 7.66992 8.38428C7.4624 8.38428 7.25488 8.29297 7.11377 8.13525L0.688966 1.56103C0.547853 1.42822 0.464845 1.2373 0.464845 1.02148C0.464845 0.589842 0.788575 0.266112 1.22022 0.266112C1.42774 0.266112 1.62695 0.340819 1.75977 0.481932L7.66992 6.5249L13.5884 0.481933C13.7129 0.34082 13.9121 0.266113 14.1279 0.266113C14.5596 0.266113 14.8833 0.589844 14.8833 1.02148C14.8833 1.2373 14.8003 1.42822 14.6592 1.56103Z" fill="#AAB2BD"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="city-list__content" style={{
                                maxHeight: openAccordion === 1 ? '500px' : '0px', paddingTop: openAccordion === 1 ? '24px' : '0px',
                                paddingBottom: openAccordion === 1 ? '10px' : '0px', 
                            }}>
                                <div className="city-slider">
                                    <Swiper
                                        spaceBetween={8}
                                        slidesPerView={'auto'}
                                        
                                        >
                                        <SwiperSlide>
                                            <div className="city-slider__item">
                                                <div className="city-slider__card">
                                                    <p className="city-slider__image">
                                                        <img src={DefaultImg} alt="" />
                                                    </p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="city-slider__item">
                                                <div className="city-slider__card">
                                                    <p className="city-slider__image">
                                                        <img src={DefaultImg} alt="" />
                                                    </p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="city-slider__item">
                                                <div className="city-slider__card">
                                                    <p className="city-slider__image">
                                                        <img src={DefaultImg} alt="" />
                                                    </p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="city-slider__item">
                                                <div className="city-slider__card">
                                                    <p className="city-slider__image">
                                                        <img src={DefaultImg} alt="" />
                                                    </p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="city-slider__item">
                                                <div className="city-slider__card">
                                                    <p className="city-slider__image">
                                                        <img src={DefaultImg} alt="" />
                                                    </p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="city-slider__item">
                                                <div className="city-slider__card">
                                                    <p className="city-slider__image">
                                                        <img src={DefaultImg} alt="" />
                                                    </p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="city-slider__item">
                                                <div className="city-slider__card">
                                                    <p className="city-slider__image">
                                                        <img src={DefaultImg} alt="" />
                                                    </p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="city-slider__item">
                                                <div className="city-slider__card">
                                                    <p className="city-slider__image">
                                                        <img src={DefaultImg} alt="" />
                                                    </p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                                                            <SwiperSlide>
                                            <div className="city-slider__item">
                                                <div className="city-slider__card">
                                                    <p className="city-slider__image">
                                                        <img src={DefaultImg} alt="" />
                                                    </p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    </Swiper>
                                </div>
                            </div>
                        </li>
                        <li className="city-list__item block-style">
                            <div className={`city-list__title f-jcsb ${openAccordion === 2 ? 'active' : ''}`} onClick={()=> handleAccordionClick(2)}>
                                <div className="sets-offer">
                                Сет «Экономика»
                                    <ul className="friends-params f-center">
                                        <li className="friends-params__item f-center">
                                            <img src={StarIcon} alt="" />
                                            500 EXP
                                        </li>
                                        <li className="friends-params__item f-center">
                                            <img src={CoinIcon} alt="" />
                                            2000
                                        </li>
                                    </ul>
                                </div>
                                <div className="city-list__more f-center">
                                    <div className="city-list__count">
                                        5 из 12
                                    </div>
                                    <div className="city-list__arrow">
                                        <svg width="15" height="9" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14.6592 1.56103L8.23438 8.13525C8.08496 8.29297 7.88574 8.38428 7.66992 8.38428C7.4624 8.38428 7.25488 8.29297 7.11377 8.13525L0.688966 1.56103C0.547853 1.42822 0.464845 1.2373 0.464845 1.02148C0.464845 0.589842 0.788575 0.266112 1.22022 0.266112C1.42774 0.266112 1.62695 0.340819 1.75977 0.481932L7.66992 6.5249L13.5884 0.481933C13.7129 0.34082 13.9121 0.266113 14.1279 0.266113C14.5596 0.266113 14.8833 0.589844 14.8833 1.02148C14.8833 1.2373 14.8003 1.42822 14.6592 1.56103Z" fill="#AAB2BD"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="city-list__content" style={{
                                maxHeight: openAccordion === 2 ? '500px' : '0px', paddingTop: openAccordion === 2 ? '24px' : '0px',
                                paddingBottom: openAccordion === 2 ? '10px' : '0px', 
                            }}>
                                <div className="city-slider">
                                    <Swiper
                                        spaceBetween={8}
                                        slidesPerView={'auto'}
                                        
                                        >
                                        <SwiperSlide>
                                            <div className="city-slider__item">
                                                <div className="city-slider__card">
                                                    <p className="city-slider__image">
                                                        <img src={DefaultImg} alt="" />
                                                    </p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="city-slider__item">
                                                <div className="city-slider__card">
                                                    <p className="city-slider__image">
                                                        <img src={DefaultImg} alt="" />
                                                    </p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="city-slider__item">
                                                <div className="city-slider__card">
                                                    <p className="city-slider__image">
                                                        <img src={DefaultImg} alt="" />
                                                    </p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="city-slider__item">
                                                <div className="city-slider__card">
                                                    <p className="city-slider__image">
                                                        <img src={DefaultImg} alt="" />
                                                    </p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="city-slider__item">
                                                <div className="city-slider__card">
                                                    <p className="city-slider__image">
                                                        <img src={DefaultImg} alt="" />
                                                    </p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="city-slider__item">
                                                <div className="city-slider__card">
                                                    <p className="city-slider__image">
                                                        <img src={DefaultImg} alt="" />
                                                    </p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="city-slider__item">
                                                <div className="city-slider__card">
                                                    <p className="city-slider__image">
                                                        <img src={DefaultImg} alt="" />
                                                    </p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="city-slider__item">
                                                <div className="city-slider__card">
                                                    <p className="city-slider__image">
                                                        <img src={DefaultImg} alt="" />
                                                    </p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="city-slider__item">
                                                <div className="city-slider__card">
                                                    <p className="city-slider__image">
                                                        <img src={DefaultImg} alt="" />
                                                    </p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="city-slider__item">
                                                <div className="city-slider__card">
                                                    <p className="city-slider__image">
                                                        <img src={DefaultImg} alt="" />
                                                    </p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    </Swiper>
                                </div>
                            </div>
                        </li>
                    </ul> */}
        </div>
      </div>
      <MobileNav />
    </section>
  );
};

export { routeSets };

export default SetsPage;
