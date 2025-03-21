import React from "react";
import routeTasks from "./routes";
import MainSection from "components/MainSection";

import DefaultImg from 'assets/img/default-img.png';
import CoinIcon from 'assets/img/coin-icon.svg';
import StarIcon from 'assets/img/star-icon.svg';

import MobileNav from "components/MobileNav";

const TasksPage = () => {

    return(
        <section className="tasks">
            <div className="container">
                <div className="tasks-inner">
                    <MainSection />
                    <div className="tasks-block">
                        <div className="tasks-head">
                            <div className="section-content">
                                <h2 className="section-content__title">
                                    Награды за задания
                                </h2>
                            </div>
                        </div>
                        <ul className="tasks-list">
                            <li className="tasks-list__item">
                                <div className="tasks-list__card block-style">
                                    <div className="tasks-list__wrap f-center">
                                        <div className="tasks-list__image">
                                            <img src={DefaultImg} alt="" />
                                        </div>
                                        <div className="tasks-list__content">
                                            <h3 className="tasks-list__title">
                                                Подписаться на телеграм
канал ZOO MAYOR
                                            </h3>
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
                                    </div>
                                    <button type="button" className="tasks-list__btn">
                                        Начать
                                    </button>
                                </div>
                            </li>
                            <li className="tasks-list__item">
                                <div className="tasks-list__card block-style">
                                    <div className="tasks-list__wrap f-center">
                                        <div className="tasks-list__image">
                                            <img src={DefaultImg} alt="" />
                                        </div>
                                        <div className="tasks-list__content">
                                            <h3 className="tasks-list__title">
                                                Подписаться на телеграм
канал ZOO MAYOR
                                            </h3>
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
                                    </div>
                                    <button type="button" className="tasks-list__btn tasks-list__btn_done">
                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.65112 14.4541C5.2605 14.4541 4.97144 14.29 4.698 13.9541L0.651123 8.8916C0.455811 8.64941 0.369873 8.42285 0.369873 8.18848C0.369873 7.64941 0.768311 7.25879 1.31519 7.25879C1.65894 7.25879 1.89331 7.38379 2.11987 7.68848L5.61987 12.1807L12.4089 1.39941C12.6433 1.03223 12.8699 0.899414 13.2527 0.899414C13.7996 0.899414 14.1746 1.27441 14.1746 1.81348C14.1746 2.02441 14.1121 2.24316 13.948 2.49316L6.60425 13.9463C6.37769 14.2822 6.06519 14.4541 5.65112 14.4541Z" fill="#F5F7FA"/>
                                        </svg>
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <MobileNav />
        </section>
    )
};

export {routeTasks};

export default TasksPage;