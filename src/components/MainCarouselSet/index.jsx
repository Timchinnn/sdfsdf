import React, { useState, useEffect } from "react";
import ReactFlipCard from "reactjs-flip-card";
// import styles from 'styles.'

// import Avatar from 'assets/img/avatar.png';
// import CardsIcon from 'assets/img/cards-icon.png';
// import TaskIcon from 'assets/img/task-icon.png';
// import BonusIcon from 'assets/img/bonus-icon.png';
// import TimeIcon from 'assets/img/time-icon.svg';
// import MoneyIcon from 'assets/img/money-icon.svg';
// import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
// import { routeTasks } from "pages/TasksPage";
// import { routeSets } from "pages/SetsPage";
// import { routeBonus } from "pages/BonusPage";
// import SettingsPopup from "components/SettingsPopup";
import { peopleService } from "services/api";
import { useSelector } from "react-redux";
import DefaultImg from "assets/img/default-card.png";
import Style1CardBack from "assets/img/card1.png";
import Style2CardBack from "assets/img/card2.png";
// import DefaultImg1 from "assets/img/4210629.png";
import DefaultImg2 from "assets/img/42106291.png";
import DefaultImg3 from "assets/img/4210629.png";
import "./styles.scss";

// Отсутствует определение cardBackStyles
const cardBackStyles = {
  default: { image: DefaultImg },
  style1: { image: Style1CardBack },
  style2: { image: Style2CardBack },
};
// import ProdImg from "assets/img/prod-img.png";
const data = [
  { id: 1, bgColor: "#F54748", title: "Slide 1" },
  { id: 2, bgColor: "#7952B3", title: "Slide 2" },
  { id: 3, bgColor: "#1597BB", title: "Slide 3" },
];
const MainCarouselSet = ({ getActiveSlide, handleOpenPopup }) => {
  const cardBackStyle = useSelector((state) => state.cardBack);
  console.log(cardBackStyle);

  const [openedCards] = useState({});

  const [activeSlide, setActiveSlide] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + data.length) % data.length);
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % data.length);
  };

  // const prevSlide = () => {
  //   setActiveSlide((prev) => (prev - 1 + data.length) % data.length);
  // };

  const getStyles = (index) => {
    const currentIndex = activeSlide % data.length;
    const prevIndex = (activeSlide - 1 + data.length) % data.length;
    const nextIndex = (activeSlide + 1) % data.length;

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

  const [photos, setPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState({});

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const policeData = await peopleService.getPolicePhotos();
        setPhotos(policeData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPhotos();
  }, []);
  useEffect(() => {
    if (photos.length > 0) {
      const newSelectedPhotos = data.reduce((acc, item) => {
        acc[item.id] = photos[Math.floor(Math.random() * photos.length)];
        return acc;
      }, {});
      setSelectedPhotos(newSelectedPhotos);
    }
  }, [photos]);
  const handleImageClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
    // console.log(selectedPhotos[index].title);
    const selectedCard = selectedPhotos[data[index].id];
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
        <div className="main-carousel">
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
            {data.map((item, i) => (
              <React.Fragment key={item.i}>
                <div
                  className={`slide ${
                    activeSlide === item.id - 1 ? "active" : ""
                  } ${activeIndex === i ? "open" : ""}`}
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
                          src={`${
                            cardBackStyles[cardBackStyle || "default"].image
                          }`}
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
                          src={`${
                            openedCards[i]?.image ||
                            selectedPhotos[item.id]?.image
                          }`}
                          alt={selectedPhotos[item.id]?.title || ""}
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
      <div className="main-nav f-center-jcsb">
        <div className="main-nav__offer f-center">
          <div className="main-nav__icon">
            <svg
              width="14"
              height="21"
              viewBox="0 0 14 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.416992 11.7002C0.416992 11.4893 0.504883 11.3047 0.663086 11.1113L8.86328 0.951172C9.49609 0.168945 10.4893 0.678711 10.1289 1.63672L7.44824 8.84375H12.5459C12.9326 8.84375 13.2139 9.10742 13.2139 9.47656C13.2139 9.67871 13.1348 9.86328 12.9766 10.0654L4.76758 20.2256C4.13477 20.999 3.1416 20.4893 3.50195 19.5312L6.18262 12.333H1.08496C0.698242 12.333 0.416992 12.0605 0.416992 11.7002Z"
                fill="#FFD321"
              />
            </svg>
          </div>
          <div className="main-nav__progress">
            <div className="main-nav__progress-bar"></div>
          </div>
          <div className="main-nav__clock f-center">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.28516 14.126C3.38867 14.126 0.223633 10.9609 0.223633 7.06445C0.223633 3.16797 3.38867 0.00292969 7.28516 0.00292969C11.1816 0.00292969 14.3467 3.16797 14.3467 7.06445C14.3467 10.9609 11.1816 14.126 7.28516 14.126ZM7.28516 12.7314C10.4229 12.7314 12.959 10.2021 12.959 7.06445C12.959 3.92676 10.4229 1.39062 7.28516 1.39062C4.14746 1.39062 1.61133 3.92676 1.61133 7.06445C1.61133 10.2021 4.14746 12.7314 7.28516 12.7314ZM3.82617 7.91211C3.51855 7.91211 3.28613 7.67285 3.28613 7.37207C3.28613 7.06445 3.51855 6.83203 3.82617 6.83203H6.73828V2.8877C6.73828 2.58691 6.97754 2.34766 7.27832 2.34766C7.58594 2.34766 7.8252 2.58691 7.8252 2.8877V7.37207C7.8252 7.67285 7.58594 7.91211 7.27832 7.91211H3.82617Z"
                fill="#AAB2BD"
              />
            </svg>
            56:23:55
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCarouselSet;
