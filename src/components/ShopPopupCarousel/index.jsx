import React, { useState } from "react";
import ReactFlipCard from "reactjs-flip-card";
import DefaultImg from "assets/img/default-card.png";
import "./styles.scss";
// Если у вас уже есть объект стилей для обратной стороны карточки, можно его импортировать.
// Здесь приведён пример с простым объектом.
const cardBackStyles = {
  default: { image: DefaultImg },
  // можно добавить style1, style2 и т.д.
};
const ShopPopupCarousel = ({
  active,
  setActivePopup,
  handleClosePopup,
  cards,
  handleOpenPopup,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const getStyles = (index) => {
    const total = cards && cards.length ? cards.length : 0;
    if (total === 0) return {};
    const currentIndex = activeSlide % total;
    const prevIndex = (activeSlide - 1 + total) % total;
    const nextIndex = (activeSlide + 1) % total;
    if (index === currentIndex) {
      return {
        opacity: 1,
        transform: "translateX(0) translateZ(0px) rotateY(0deg)",
        zIndex: 10,
      };
    } else if (index === prevIndex) {
      return {
        opacity: 1,
        transform:
          window.innerWidth < 529
            ? "translateX(-160px) translateZ(-400px) rotateY(60deg)"
            : "translateX(-200px) translateZ(-500px) rotateY(60deg)",
        zIndex: 9,
      };
    } else if (index === nextIndex) {
      return {
        opacity: 1,
        transform:
          window.innerWidth < 529
            ? "translateX(160px) translateZ(-400px) rotateY(-60deg)"
            : "translateX(200px) translateZ(-500px) rotateY(-60deg)",
        zIndex: 9,
      };
    } else {
      return {
        opacity: 0,
        transform:
          window.innerWidth < 529
            ? "translateX(320px) translateZ(-500px) rotateY(-60deg)"
            : "translateX(440px) translateZ(-600px) rotateY(-60deg)",
        zIndex: 7,
      };
    }
  };
  const prevSlide = () => {
    setActiveSlide(
      (prev) => (prev - 1 + (cards?.length || 1)) % (cards?.length || 1)
    );
  };
  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % (cards?.length || 1));
  };
  return (
    <div className={`shop-popup ${active ? "show" : ""}`}>
      <div className="shop-popup__wrapper">
        <button
          type="button"
          className="shop-popup__close"
          onClick={handleClosePopup}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            viewBox="0 0 512 512"
          >
            <path
              d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
              fill="#AAB2BD"
            />
          </svg>
        </button>
        <div className="shop-popup__inner" style={{ overflowX: "hidden" }}>
          <div className="main-nav__play" onClick={prevSlide}>
            <img
              src="path/to/prevIcon.png"
              alt="Назад"
              style={{ width: "30px" }}
            />
          </div>
          <div className="slideC">
            {cards && cards.length > 0 ? (
              cards.map((item, i) => (
                <div
                  key={item.id}
                  className={`slide ${activeSlide === i ? "active" : ""}`}
                  style={getStyles(i)}
                >
                  <ReactFlipCard
                    flipTrigger={"onClick"}
                    className="main-slider__card"
                    onClick={() => handleOpenPopup(item)}
                    frontComponent={
                      <div className="main-slider__image">
                        <img src={cardBackStyles.default.image} alt="" />
                      </div>
                    }
                    backComponent={
                      <div className="main-slider__image">
                        <img src={item.image || DefaultImg} alt={item.title} />
                      </div>
                    }
                  />
                </div>
              ))
            ) : (
              <div>Нет карточек для отображения</div>
            )}
          </div>
          <div className="main-nav__play" onClick={nextSlide}>
            <img
              src="path/to/nextIcon.png"
              alt="Вперед"
              style={{ width: "30px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShopPopupCarousel;
