import React, { useState, useRef, useEffect } from "react";
import routeShop from "./routes";
import MainSection from "components/MainSection";
import DefaultImg from "assets/img/default-img.png";
import MoneyImg from "assets/img/money.png";
import EnergytImg from "assets/img/energy.png";
import CoinIcon from "assets/img/coin-icon.svg";
import { peopleService, shopSetService, shopCardService } from "services/api";
import MobileNav from "components/MobileNav";
import CardShopPopup from "components/CardShopPopup";
import ShopPopupCarousel from "components/ShopPopupCarousel";
import ShirtShopPopup from "components/ShirtShopPopup";
import axios from "../../axios-controller";
import { useSelector } from "react-redux";
const ShopPage = () => {
  const cardBackStyle = useSelector((state) => state.cardBack);
  const tgUserId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || "";
  const isSpecialUser = tgUserId === 7241281378 || tgUserId === 467518658;
  const [activePopup, setActivePopup] = useState(false);
  const [activePopupCarousel, setActivePopupCarousel] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [shopCards, setShopCards] = useState([]);
  const [shopSets, setShopSets] = useState([]);
  const [shirts, setShirts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  useEffect(() => {
    const fetchShopCards = async () => {
      try {
        const response = await shopCardService.getAllShopCards();
        setShopCards(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке карт магазина:", error);
      }
    };
    fetchShopCards();
  }, []);
  useEffect(() => {
    const fetchShirts = async () => {
      try {
        const response = await axios.get("/shirts");
        setShirts(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке рубашек:", error);
      }
    };
    fetchShirts();
  }, []);
  useEffect(() => {
    const fetchShopSets = async () => {
      try {
        const response = await shopSetService.getAllShopSets();
        setShopSets(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке наборов:", error);
      }
    };
    fetchShopSets();
  }, []);
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const policeData = await peopleService.getPolicePhotos();
        const allItems = [
          ...policeData,
          ...shopSets.map((set) => ({
            id: set.id,
            title: set.name,
            price: set.price,
            image: set.image_url || DefaultImg,
          })),
          ...shirts.map((shirt) => ({
            id: shirt.id,
            title: shirt.name,
            price: shirt.price,
            image: shirt.image_url || DefaultImg,
          })),
        ];
        setFilteredItems(allItems);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPhotos();
  }, [shopSets, shirts]);
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    const filtered = [
      ...shopCards,
      ...shopSets.map((set) => ({
        id: set.id,
        title: set.name,
        price: set.price,
        image: set.image_url || DefaultImg,
      })),
      ...shirts.map((shirt) => ({
        id: shirt.id,
        title: shirt.name,
        price: shirt.price,
        image: shirt.image_url || DefaultImg,
      })),
    ].filter((item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );

    setFilteredItems(filtered);
  };
  const handleOpenPopup = (item) => {
    document.documentElement.classList.add("fixed");
    setActivePopup(true);
    setSelectedId(item);
  };
  const handleClosePopup = () => {
    document.documentElement.classList.remove("fixed");
    setActivePopup(false);
  };
  const handleOpenPopupCarousel = () => {
    document.documentElement.classList.add("fixed");
    setActivePopupCarousel(true);
  };
  const handleClosePopupCarousel = () => {
    document.documentElement.classList.remove("fixed");
    setActivePopupCarousel(false);
  };
  const handleBuySet = async (setId) => {
    try {
      const response = await axios.get(`/shop-sets/${setId}`);
      const set = response.data;
      const cardsResponse = await axios.get(`/shop-sets/${setId}/cards`);
      const setCards = cardsResponse.data;
      document.documentElement.classList.add("fixed");
      setActivePopupCarousel(true);
      setSelectedId({
        id: set.id,
        title: set.name,
        description: `Набор из ${setCards.length} карт`,
        price: set.price,
        image: set.image_url
          ? `https://api.zoomayor.io${set.image_url}`
          : DefaultImg,
        cards: setCards,
      });
    } catch (error) {
      console.error("Ошибка при получении информации о наборе:", error);
    }
  };
  return (
    <section className="shop">
      <div className="container">
        <div className="shop-inner">
          <MainSection />
          <div className="shop-block">
            <h2 className="section-content__title shop-block__title">
              Магазин
            </h2>
            {isSpecialUser ? (
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
                <div className="shop-category">
                  <div className="shop-category__item block-style">
                    {shopSets.length > 0 && (
                      <h2 className="section-content__title">Наборы карт</h2>
                    )}
                    <ul
                      className="shop-list f-jcsb"
                      style={{ marginBottom: "24px" }}
                    >
                      {shopSets
                        .filter((set) =>
                          set.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((set) => (
                          <li key={set.id} className="shop-list__item">
                            <div className="shop-list__card">
                              <div
                                className="shop-list__image"
                                onClick={() => handleBuySet(set.id)}
                              >
                                <img
                                  src={
                                    cardBackStyle
                                      ? `https://api.zoomayor.io${cardBackStyle}`
                                      : DefaultImg
                                  }
                                  alt={set.name}
                                  className="shop-card__Img"
                                />
                              </div>
                              <h3 className="shop-list__title">{set.name}</h3>
                              <div className="shop-list__price f-center">
                                <img src={CoinIcon} alt="" />
                                {Math.floor(set.price)}
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                    {shopCards.length > 0 && (
                      <h2 className="section-content__title">Карты</h2>
                    )}
                    <ul
                      className="shop-list f-jcsb"
                      style={{ marginBottom: "24px" }}
                    >
                      {shopCards
                        .filter((card) =>
                          card.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((card) => (
                          <li key={card.id} className="shop-list__item">
                            <div className="shop-list__card">
                              <div
                                className="shop-list__image"
                                onClick={() => handleOpenPopup(card)}
                              >
                                <img
                                  src={`https://api.zoomayor.io${card.image_url}`}
                                  alt={card.name}
                                  className="shop-card__Img"
                                />
                              </div>
                              <div className="shop-list__content">
                                <h3 className="shop-list__title">
                                  {card.name}
                                </h3>
                                <div className="shop-list__price f-center">
                                  <img src={CoinIcon} alt="" />
                                  {Math.floor(card.price)}
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                    {shirts.length > 0 && (
                      <h2 className="section-content__title">Рубашки карт</h2>
                    )}
                    <ul
                      className="shop-list f-jcsb"
                      style={{ marginBottom: "24px" }}
                    >
                      {shirts
                        .filter((shirt) =>
                          shirt.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((shirt) => (
                          <li key={shirt.id} className="shop-list__item">
                            <div className="shop-list__card">
                              <div
                                className="shop-list__image"
                                onClick={() =>
                                  handleOpenPopup({
                                    id: shirt.id,
                                    title: shirt.name,
                                    price: shirt.price,
                                    image: shirt.image_url,
                                    type: "shirt",
                                  })
                                }
                              >
                                <img
                                  src={`https://api.zoomayor.io${shirt.image_url}`}
                                  alt={shirt.name}
                                />
                              </div>
                              <div className="shop-list__content">
                                <h3 className="shop-list__title">
                                  {shirt.name}
                                </h3>
                                <div className="shop-list__price f-center">
                                  <img src={CoinIcon} alt="" />
                                  {Math.floor(shirt.price)}
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div
                className="block-style"
                style={{
                  textAlign: "center",
                  padding: "20px",
                  marginTop: "6px",
                }}
              >
                Скоро
              </div>
            )}
          </div>
        </div>
      </div>
      {activePopup && selectedId?.type === "shirt" ? (
        <ShirtShopPopup
          active={activePopup}
          setActivePopup={setActivePopup}
          handleClosePopup={handleClosePopup}
          selectedPhoto={selectedId}
        />
      ) : (
        activePopup && (
          <CardShopPopup
            active={activePopup}
            setActivePopup={setActivePopup}
            handleClosePopup={handleClosePopup}
            selectedPhoto={selectedId}
          />
        )
      )}
      {activePopupCarousel && (
        <ShopPopupCarousel
          active={activePopupCarousel}
          setActivePopup={setActivePopupCarousel}
          handleClosePopup={handleClosePopupCarousel}
          selectedSet={selectedId}
        />
      )}
      <MobileNav />
    </section>
  );
};
export { routeShop };
export default ShopPage;
