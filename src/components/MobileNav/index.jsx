import React from "react";
import "./styles.scss";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import { routeMain } from "pages/MainPage";
import { routeCity } from "pages/CityPage";
import { routeFriends } from "pages/FriendsPage";
import { routeShop } from "pages/ShopPage";
import { routePeople } from "pages/PeoplePage";

// Импортируем как React компоненты
import { ReactComponent as GameDefaultWhite } from "assets/img/game-default.svg";
import { ReactComponent as GameActiveWhite } from "assets/img/game-active.svg";
import { ReactComponent as GameDefaultDark } from "assets/img/game-default-dark.svg";
import { ReactComponent as GameActiveDark } from "assets/img/game-active-dark.svg";
import { ReactComponent as CityDefaultWhite } from "assets/img/city-default.svg";
import { ReactComponent as CityActiveWhite } from "assets/img/city-active.svg";
import { ReactComponent as CityDefaultDark } from "assets/img/city-default-dark.svg";
import { ReactComponent as CityActiveDark } from "assets/img/city-active-dark.svg";
import { ReactComponent as PeopleDefaultWhite } from "assets/img/people-default.svg";
import { ReactComponent as PeopleActiveWhite } from "assets/img/people-active.svg";
import { ReactComponent as PeopleDefaultDark } from "assets/img/people-default-dark.svg";
import { ReactComponent as PeopleActiveDark } from "assets/img/people-active-dark.svg";
import { ReactComponent as FriendsDefaultWhite } from "assets/img/friends-default.svg";
import { ReactComponent as FriendsActiveWhite } from "assets/img/friends-active.svg";
import { ReactComponent as FriendsDefaultDark } from "assets/img/friends-default-dark.svg";
import { ReactComponent as FriendsActiveDark } from "assets/img/friends-active-dark.svg";
import { ReactComponent as ShopDefaultWhite } from "assets/img/shop-default.svg";
import { ReactComponent as ShopActiveWhite } from "assets/img/shop-active.svg";
import { ReactComponent as ShopDefaultDark } from "assets/img/shop-default-dark.svg";
import { ReactComponent as ShopActiveDark } from "assets/img/shop-active-dark.svg";

const MobileNav = () => {
  return (
    <div className="mobile-nav">
      <ul className="mobile-menu f-center-jcsb">
        <li className="mobile-menu__item">
          <NavLink
            to={routeMain()}
            className="mobile-menu__card"
            activeClassName={"active"}
          >
            <div className="mobile-menu__icon f-center-center">
              <div className="mobile-menu__icon_white">
                <GameDefaultWhite className="mobile-menu__icon_white-default" />
                <GameActiveWhite
                  alt=""
                  className="mobile-menu__icon_white-active"
                />
              </div>
              <div className="mobile-menu__icon_dark">
                <GameDefaultDark className="mobile-menu__icon_dark-default" />
                <GameActiveDark
                  alt=""
                  className="mobile-menu__icon_dark-active"
                />
              </div>
            </div>
            <p className="mobile-menu__title">Игра</p>
          </NavLink>
        </li>
        <li className="mobile-menu__item">
          <NavLink to={routeCity()} className="mobile-menu__card">
            <div className="mobile-menu__icon f-center-center">
              <div className="mobile-menu__icon f-center-center">
                <div className="mobile-menu__icon_white">
                  <CityDefaultWhite className="mobile-menu__icon_white-default" />
                  <CityActiveWhite className="mobile-menu__icon_white-active" />
                </div>
                <div className="mobile-menu__icon_dark">
                  <CityDefaultDark className="mobile-menu__icon_dark-default" />
                  <CityActiveDark className="mobile-menu__icon_dark-active" />
                </div>
              </div>
            </div>
            <p className="mobile-menu__title">Город</p>
          </NavLink>
        </li>
        <li className="mobile-menu__item">
          <NavLink to={routePeople()} className="mobile-menu__card">
            <div className="mobile-menu__icon f-center-center">
              <div className="mobile-menu__icon_white">
                <PeopleDefaultWhite className="mobile-menu__icon_white-default" />
                <PeopleActiveWhite className="mobile-menu__icon_white-active" />
              </div>
              <div className="mobile-menu__icon_dark">
                <PeopleDefaultDark className="mobile-menu__icon_dark-default" />
                <PeopleActiveDark className="mobile-menu__icon_dark-active" />
              </div>
            </div>
            <p className="mobile-menu__title">Жители</p>
          </NavLink>
        </li>
        <li className="mobile-menu__item">
          <NavLink to={routeFriends()} className="mobile-menu__card">
            <div className="mobile-menu__icon f-center-center">
              <div className="mobile-menu__icon_white">
                <FriendsDefaultWhite className="mobile-menu__icon_white-default" />
                <FriendsActiveWhite className="mobile-menu__icon_white-active" />
              </div>
              <div className="mobile-menu__icon_dark">
                <FriendsDefaultDark className="mobile-menu__icon_dark-default" />
                <FriendsActiveDark className="mobile-menu__icon_dark-active" />
              </div>
            </div>
            <p className="mobile-menu__title">Друзья</p>
          </NavLink>
        </li>
        <li className="mobile-menu__item">
          <NavLink to={routeShop()} className="mobile-menu__card">
            <div className="mobile-menu__icon f-center-center">
              <div className="mobile-menu__icon_white">
                <ShopDefaultWhite className="mobile-menu__icon_white-default" />
                <ShopActiveWhite className="mobile-menu__icon_white-active" />
              </div>
              <div className="mobile-menu__icon_dark">
                <ShopDefaultDark className="mobile-menu__icon_dark-default" />
                <ShopActiveDark className="mobile-menu__icon_dark-active" />
              </div>
            </div>
            <p className="mobile-menu__title">Магазин</p>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default MobileNav;
