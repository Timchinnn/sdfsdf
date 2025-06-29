import React, { useState, useEffect } from "react";
import ReactFlipCard from "reactjs-flip-card";
import { useSelector } from "react-redux";
import DefaultImg from "assets/img/default-card.png";
import Style1CardBack from "assets/img/card1.png";
import Style2CardBack from "assets/img/card2.png";
import DefaultImg2 from "assets/img/42106291.png";
import DefaultImg3 from "assets/img/4210629.png";
import "./styles.scss";
const cardBackStyles = {
  default: { image: DefaultImg },
  style1: { image: Style1CardBack },
  style2: { image: Style2CardBack },
};
const MainCarouselSet = ({ getActiveSlide, handleOpenPopup, selectedSet }) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isSwipeLocked, setIsSwipeLocked] = useState(false);
  const minSwipeDistance = 50;
  const imageQuality = useSelector((state) => state.imageQuality);
  const responseTime = useSelector((state) => state.responseTime);
  const cardBackStyle = useSelector((state) => state.cardBack);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const [cards, setCards] = useState([]);
  useEffect(() => {
    if (selectedSet && selectedSet.cards) {
      setCards(selectedSet.cards);
    }
  }, [selectedSet]);
  const onTouchStart = (e) => {
    if (isSwipeLocked) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => {
    if (isSwipeLocked) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || isSwipeLocked) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };
  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + cards.length) % cards.length);
  };
  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % cards.length);
  };
  const getStyles = (index) => {
    const currentIndex = activeSlide % cards.length;
    const prevIndex = (activeSlide - 1 + cards.length) % cards.length;
    const nextIndex = (activeSlide + 1) % cards.length;
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
  const getImageUrl = (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== "string") return imageUrl;
    if (
      imageUrl === DefaultImg ||
      imageUrl === Style1CardBack ||
      imageUrl === Style2CardBack
    )
      return imageUrl;
    if (imageUrl.startsWith("http")) return imageUrl;
    // Проверяем настройки качества изображений
    if (imageQuality === "high") {
      // Всегда высокое качество
      return `https://api.zoomayor.io${imageUrl}`;
    } else if (imageQuality === "low") {
      // Всегда низкое качество
      const hasExtension = /\.[^.]+$/.test(imageUrl);
      return `https://api.zoomayor.io${
        hasExtension
          ? imageUrl.replace(/(\.[^.]+)$/, "bad$1")
          : imageUrl + "bad.webp"
      }`;
    } else {
      // Автоматический режим - зависит от времени ответа
      if (responseTime > 300) {
        const hasExtension = /\.[^.]+$/.test(imageUrl);
        return `https://api.zoomayor.io${
          hasExtension
            ? imageUrl.replace(/(\.[^.]+)$/, "bad$1")
            : imageUrl + "bad.webp"
        }`;
      } else {
        return `https://api.zoomayor.io${imageUrl}`;
      }
    }
  };
  const handleImageClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
    const selectedCard = cards[index];
    handleOpenPopup(selectedCard);
  };
  return (
    <div className="main-control">
      <div className="main-control__bg">
        <svg
          width="375"
          height="529"
          viewBox="0 0 375 529"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.24" filter="url(#filter0_f_63_9375)">
            <circle
              cx="188.04"
              cy="264.312"
              r="124.272"
              transform="rotate(92.6861 188.04 264.312)"
              fill="#71B21D"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_63_9375"
              x="-76.2341"
              y="0.037075"
              width="528.549"
              height="528.549"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="70"
                result="effect1_foregroundBlur_63_9375"
              />
            </filter>
          </defs>
        </svg>
      </div>
      <div className="main-carousel-set">
        <div
          className="main-carousel"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="main-nav__play" onClick={prevSlide}>
            <img
              src={DefaultImg2}
              alt=""
              style={{
                width: "30px",
                "@media (max-width: 529px)": {
                  width: "20px",
                },
              }}
            />
          </div>
          <div className="slideC">
            {cards.map((item, i) => (
              <React.Fragment key={item.id}>
                <div
                  className={`slide ${activeSlide === i ? "active" : ""} ${
                    activeIndex === i ? "open" : ""
                  }`}
                  style={{
                    ...getStyles(i),
                    "@media (max-width: 529px)": {
                      width: "160px",
                      height: "280px",
                    },
                  }}
                >
                  <ReactFlipCard
                    flipTrigger={"onClick"}
                    className="main-slider__card"
                    onClick={() => handleImageClick(i)}
                    frontComponent={
                      <div className="main-slider__image">
                        <img
                          src={getImageUrl(
                            cardBackStyle
                              ? cardBackStyle.startsWith("/img")
                                ? cardBackStyle
                                : cardBackStyles[cardBackStyle]?.image ||
                                  cardBackStyles.default.image
                              : cardBackStyles.default.image
                          )}
                          alt=""
                          style={{
                            "@media (max-width: 529px)": {
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            },
                          }}
                        />
                      </div>
                    }
                    backComponent={
                      <div className="main-slider__image">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.title || ""}
                          style={{
                            "@media (max-width: 529px)": {
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            },
                          }}
                        />
                      </div>
                    }
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
          <div className="main-nav__play" onClick={nextSlide}>
            <img
              src={DefaultImg3}
              alt=""
              style={{
                width: "30px",
                "@media (max-width: 529px)": {
                  width: "20px",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default MainCarouselSet;
