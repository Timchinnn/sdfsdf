import React, { useState, useRef, useEffect } from "react";
import routeShop from "./routes";
import MainSection from "components/MainSection";
// import MainCarousel from "components/MainCarousel";

import DefaultImg from "assets/img/default-img.png";
import MoneyImg from "assets/img/money.png";
import EnergytImg from "assets/img/energy.png";
// import CoinIcon from "assets/img/coin-icon.svg";
import { peopleService } from "services/api";

import MobileNav from "components/MobileNav";
import ShopPopup from "components/ShopPopup";
import ShopPopupCarousel from "components/ShopPopupCarousel";

const ShopPage = () => {
  const [activePopup, setActivePopup] = useState(false);
  const [activePopupCarousel, setActivePopupCarousel] = useState(false);
  const [activePopupFilter, setActivePopupFilter] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  console.log(setSelectedId);

  // const [searchTerm, setSearchTerm] = useState("");

  const [items, setItems] = useState([]); // Добавить состояние для оригинального массива

  const [filteredItems, setFilteredItems] = useState([]);
  console.log(filteredItems);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const policeData = await peopleService.getPolicePhotos();
        // Добавляем набор к данным из API
        const allItems = [
          ...policeData,
          {
            id: "set",
            title: "набор",
            price: 456,
            image: DefaultImg,
          },
          {
            id: "energy",
            title: "энергия",
            price: 456,
            image: EnergytImg,
          },
          {
            id: "money",
            title: "монеты",
            price: 456,
            image: MoneyImg,
          },
        ];
        setItems(allItems);
        setFilteredItems(allItems);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPhotos();
  }, []);
  // console.log(setItems);
  // const handleSearch = (e) => {
  //   const searchValue = e.target.value;
  //   setSearchTerm(searchValue);

  //   const filtered = items.filter((item) =>
  //     item.title.toLowerCase().includes(searchValue.toLowerCase())
  //   );
  //   setFilteredItems(filtered);
  // };
  // const handleOpenPopup = (id) => {
  //   document.documentElement.classList.add("fixed");
  //   setActivePopup(true);
  //   console.log(id);
  //   setSelectedId(id);
  // };

  const handleClosePopup = () => {
    document.documentElement.classList.remove("fixed");
    setActivePopup(false);
  };
  // const handleOpenPopupCarousel = (id) => {
  //   document.documentElement.classList.add("fixed");
  //   setActivePopupCarousel(true);
  // };

  const handleClosePopupCarousel = () => {
    document.documentElement.classList.remove("fixed");
    setActivePopupCarousel(false);
  };
  // В начале компонента добавить состояния для фильтра
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");

  // Добавить обработчики изменения полей
  const handlePriceFromChange = (e) => {
    setPriceFrom(e.target.value);
  };

  const handlePriceToChange = (e) => {
    setPriceTo(e.target.value);
  };

  // Добавить функцию фильтрации
  const [filterType, setFilterType] = useState("all"); // 'all', 'sets', 'cards'

  // Модифицировать функцию фильтрации
  const handleFilter = () => {
    const filtered = items.filter((item) => {
      // Сначала фильтруем по цене
      const priceMatches =
        (!priceFrom || item.price >= Number(priceFrom)) &&
        (!priceTo || item.price <= Number(priceTo));

      // Затем фильтруем по типу
      const typeMatches =
        filterType === "all" ||
        (filterType === "sets" && item.title.toLowerCase().includes("набор")) ||
        (filterType === "cards" && !item.title.toLowerCase().includes("набор"));

      return priceMatches && typeMatches;
    });

    setFilteredItems(filtered);
    setActivePopupFilter(false);
  };

  // Добавить функцию сброса
  const handleReset = () => {
    setPriceFrom("");
    setPriceTo("");
    setFilteredItems(items); // Используем оригинальный массив
    setActivePopupFilter(false);
  };
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        document.documentElement.classList.remove("fixed");
        console.log("close");
        setActivePopupFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // const handleOpenFilter = () => {
  //   document.documentElement.classList.add("fixed");
  //   setActivePopupFilter(true);
  // };

  return (
    <section className="shop">
      <div className="container">
        <div className="shop-inner">
          <MainSection />
          <div className="shop-block">
            <h2 className="section-content__title shop-block__title">
              Магазин
            </h2>
            <div
              className="block-style"
              style={{ textAlign: "center", padding: "20px", marginTop: "6px" }}
            >
              Скоро
            </div>
            {/* <div className="shop-block__nav f-center-jcsb">
              <div className="shop-block__search">
                <div className="shop-block__search-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.90918 7.44629C0.90918 3.79395 3.88086 0.822266 7.5332 0.822266C11.1855 0.822266 14.1572 3.79395 14.1572 7.44629C14.1572 8.95703 13.6509 10.3433 12.7959 11.4556L16.855 15.5396C17.0293 15.7139 17.1289 15.9546 17.1289 16.2202C17.1289 16.7764 16.7388 17.1997 16.1743 17.1997C15.9087 17.1997 15.6597 17.1084 15.4688 16.9175L11.3848 12.8252C10.2974 13.6055 8.97754 14.0703 7.5332 14.0703C3.88086 14.0703 0.90918 11.0986 0.90918 7.44629ZM2.32861 7.44629C2.32861 10.3184 4.66113 12.6509 7.5332 12.6509C10.4053 12.6509 12.7378 10.3184 12.7378 7.44629C12.7378 4.57422 10.4053 2.2417 7.5332 2.2417C4.66113 2.2417 2.32861 4.57422 2.32861 7.44629Z"
                      fill="#AAB2BD"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  name="search"
                  value={searchTerm}
                  onChange={handleSearch}
                  required
                />
              </div>
              <div className="shop-block__nav-btn" onClick={handleOpenFilter}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.74975 17.5C8.53708 17.5 8.359 17.4281 8.2155 17.2843C8.07183 17.1406 8 16.9625 8 16.75V12.75C8 12.5375 8.07192 12.3594 8.21575 12.2158C8.35958 12.0719 8.53775 12 8.75025 12C8.96292 12 9.141 12.0719 9.2845 12.2158C9.42817 12.3594 9.5 12.5375 9.5 12.75V14H16.75C16.9625 14 17.1406 14.0719 17.2843 14.2158C17.4281 14.3596 17.5 14.5378 17.5 14.7503C17.5 14.9629 17.4281 15.141 17.2843 15.2845C17.1406 15.4282 16.9625 15.5 16.75 15.5H9.5V16.75C9.5 16.9625 9.42808 17.1406 9.28425 17.2843C9.14042 17.4281 8.96225 17.5 8.74975 17.5ZM0.75 15.5C0.5375 15.5 0.359417 15.4281 0.21575 15.2843C0.0719168 15.1404 0 14.9622 0 14.7498C0 14.5371 0.0719168 14.359 0.21575 14.2155C0.359417 14.0718 0.5375 14 0.75 14H4.75C4.9625 14 5.14058 14.0719 5.28425 14.2158C5.42808 14.3596 5.5 14.5378 5.5 14.7503C5.5 14.9629 5.42808 15.141 5.28425 15.2845C5.14058 15.4282 4.9625 15.5 4.75 15.5H0.75ZM4.74975 11.5C4.53708 11.5 4.359 11.4281 4.2155 11.2843C4.07183 11.1406 4 10.9625 4 10.75V9.5H0.75C0.5375 9.5 0.359417 9.42808 0.21575 9.28425C0.0719168 9.14042 0 8.96225 0 8.74975C0 8.53708 0.0719168 8.359 0.21575 8.2155C0.359417 8.07183 0.5375 8 0.75 8H4V6.75C4 6.5375 4.07192 6.35942 4.21575 6.21575C4.35958 6.07192 4.53775 6 4.75025 6C4.96292 6 5.141 6.07192 5.2845 6.21575C5.42817 6.35942 5.5 6.5375 5.5 6.75V10.75C5.5 10.9625 5.42808 11.1406 5.28425 11.2843C5.14042 11.4281 4.96225 11.5 4.74975 11.5ZM8.75 9.5C8.5375 9.5 8.35942 9.42808 8.21575 9.28425C8.07192 9.14042 8 8.96225 8 8.74975C8 8.53708 8.07192 8.359 8.21575 8.2155C8.35942 8.07183 8.5375 8 8.75 8H16.75C16.9625 8 17.1406 8.07192 17.2843 8.21575C17.4281 8.35958 17.5 8.53775 17.5 8.75025C17.5 8.96292 17.4281 9.141 17.2843 9.2845C17.1406 9.42817 16.9625 9.5 16.75 9.5H8.75ZM12.7498 5.5C12.5371 5.5 12.359 5.42808 12.2155 5.28425C12.0718 5.14058 12 4.9625 12 4.75V0.75C12 0.5375 12.0719 0.359417 12.2158 0.21575C12.3596 0.0719168 12.5378 0 12.7503 0C12.9629 0 13.141 0.0719168 13.2845 0.21575C13.4282 0.359417 13.5 0.5375 13.5 0.75V2H16.75C16.9625 2 17.1406 2.07192 17.2843 2.21575C17.4281 2.35958 17.5 2.53775 17.5 2.75025C17.5 2.96292 17.4281 3.141 17.2843 3.2845C17.1406 3.42817 16.9625 3.5 16.75 3.5H13.5V4.75C13.5 4.9625 13.4281 5.14058 13.2843 5.28425C13.1404 5.42808 12.9622 5.5 12.7498 5.5ZM0.75 3.5C0.5375 3.5 0.359417 3.42808 0.21575 3.28425C0.0719168 3.14042 0 2.96225 0 2.74975C0 2.53708 0.0719168 2.359 0.21575 2.2155C0.359417 2.07183 0.5375 2 0.75 2H8.75C8.9625 2 9.14058 2.07192 9.28425 2.21575C9.42808 2.35958 9.5 2.53775 9.5 2.75025C9.5 2.96292 9.42808 3.141 9.28425 3.2845C9.14058 3.42817 8.9625 3.5 8.75 3.5H0.75Z"
                    fill="#AAB2BD"
                  />
                </svg>
              </div>
            </div>
            <div className="shop-category">
              <div className="shop-category__item block-style">
                <h2 className="section-content__title">Культурные объекты</h2>
                <ul className="shop-list f-jcsb">
                  {filteredItems.map((item) => (
                    <li key={item.id} className="shop-list__item">
                      <div className="shop-list__card">
                        <div
                          className="shop-list__image"
                          onClick={() =>
                            item.title.toLowerCase().includes("набор")
                              ? handleOpenPopupCarousel()
                              : handleOpenPopup(item)
                          }
                        >
                          <img
                            src={
                              item.id === "set" ||
                              item.id === "energy" ||
                              item.id === "money"
                                ? item.image
                                : `${item.image}`
                            }
                            alt=""
                            className="shop-card__Img"
                          />
                        </div>
                        <h3 className="shop-list__title">{item.title}</h3>
                        <div className="shop-list__price f-center">
                          <img src={CoinIcon} alt="" />
                          {item.price}
                        </div>
                      </div>
                    </li>
                  ))}{" "}

                </ul>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <div
        ref={filterRef}
        className={`modal shop-filter ${activePopupFilter && "show"}`}
      >
        <div className="modal-wrapper">
          <div className="modal-filter__type">
            <h3 className="modal-title">Тип</h3>
            <div
              className="modal-filter__buttons"
              style={{
                marginBottom: "15px",
                marginTop: "15px",
              }}
            >
              <button
                className={`modal-btn-choose ${
                  filterType === "all" ? "active" : ""
                }`}
                onClick={() => setFilterType("all")}
              >
                Все
              </button>
              <div>
                <button
                  className={`modal-btn-choose ${
                    filterType === "sets" ? "active" : ""
                  }`}
                  style={{
                    marginBottom: "0",
                    width: "49%",
                  }}
                  onClick={() => setFilterType("sets")}
                >
                  Наборы
                </button>
                <button
                  style={{
                    marginBottom: "0",
                    width: "49%",
                  }}
                  className={`modal-btn-choose ${
                    filterType === "cards" ? "active" : ""
                  }`}
                  onClick={() => setFilterType("cards")}
                >
                  Карты
                </button>
              </div>
            </div>
          </div>
          <h3 className="modal-title">Стоимость карты</h3>
          <div className="modal-range f-center-jcsb">
            <div className="modal-range__item">
              <div className="modal-form__input">
                <input
                  type="number"
                  value={priceFrom}
                  onChange={handlePriceFromChange}
                  placeholder="От"
                />
              </div>
            </div>
            <div className="modal-range__item">
              <div className="modal-form__input">
                <input
                  type="number"
                  value={priceTo}
                  onChange={handlePriceToChange}
                  placeholder="До"
                />
              </div>
            </div>
          </div>
          <div className="modal-nav">
            <button type="button" className="modal-btn" onClick={handleFilter}>
              Показать
            </button>
            <button
              type="button"
              className="modal-btn modal-btn_default"
              onClick={handleReset}
            >
              Сбросить
            </button>
          </div>
        </div>
      </div>
      {activePopup && (
        <ShopPopup
          active={activePopup}
          setActivePopup={setActivePopup}
          handleClosePopup={handleClosePopup}
          selectedPhoto={selectedId}
        />
      )}
      {activePopupCarousel && (
        <ShopPopupCarousel
          active={activePopupCarousel}
          setActivePopup={setActivePopupCarousel}
          handleClosePopup={handleClosePopupCarousel}
        />
      )}
      <MobileNav />
    </section>
  );
};

export { routeShop };

export default ShopPage;
