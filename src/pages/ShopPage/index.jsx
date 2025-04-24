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
              {window.Telegram?.WebApp?.initDataUnsafe?.user?.id ===
                467518658 ||
              window.Telegram?.WebApp?.initDataUnsafe?.user?.id ===
                123456789 ? (
                <>
                  <div className="shop-block__nav f-center-jcsb">
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
                  </div>
                  {/* Rest of your shop content */}
                </>
              ) : (
                "Скоро"
              )}
            </div>
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
