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
        transform: "translateX(-200px) translateZ(-500px) rotateY(60deg)",
        zIndex: 9,
      };
    } else if (index === nextIndex) {
      return {
        opacity: 1,
        transform: "translateX(200px) translateZ(-500px) rotateY(-60deg)",
        zIndex: 9,
      };
    } else {
      return {
        opacity: 0,
        transform: "translateX(440px) translateZ(-600px) rotateY(-60deg)",
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
      <div className="main-carousel">
        <div className="main-nav__play" onClick={prevSlide}>
          <img
            src={DefaultImg2}
            alt=""
            style={{
              width: "40px",
            }}
          />
          {/* <svg
            width="24"
            height="14"
            viewBox="0 0 24 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Используем тот же path, но с transform="rotate(180)" для кнопки "назад" */}
          {/* <path
              transform="rotate(180, 12, 7)"
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M19.583 3.04905C17.683 2.16705 15.0029 1.60004 12 1.60004C8.99712 1.60004 6.31706 2.16702 4.41702 3.04905C2.45202 3.96105 1.6 5.06205 1.6 5.99996C1.6 6.93787 2.45199 8.03895 4.41702 8.95087C5.79302 9.58987 7.57914 10.0639 9.6 10.2759V9.59988C9.6 9.27589 9.795 8.98489 10.094 8.86089C10.393 8.73689 10.737 8.80589 10.966 9.03389L12.566 10.6339C12.878 10.9469 12.878 11.4529 12.566 11.7659L10.966 13.3659C10.737 13.5939 10.393 13.6629 10.094 13.5389C9.795 13.4149 9.6 13.1239 9.6 12.7999V11.8839C7.363 11.6649 5.34298 11.1449 3.744 10.4029C1.65601 9.43288 0 7.9339 0 5.99995C0 4.066 1.65601 2.56699 3.744 1.59701C5.89801 0.597018 8.81792 0 12 0C15.1821 0 18.102 0.596992 20.256 1.59701C22.344 2.56701 24 4.066 24 5.99995C24 7.54496 22.931 8.8139 21.487 9.73396C20.02 10.669 18.0069 11.356 15.7239 11.716C15.2879 11.785 14.8779 11.486 14.8099 11.05C14.7409 10.614 15.0389 10.204 15.4759 10.135C17.613 9.79896 19.3989 9.16698 20.6269 8.38497C21.8779 7.58797 22.3999 6.74197 22.3999 5.99997C22.3999 5.06197 21.548 3.96097 19.583 3.04905Z"
              fill="#AAB2BD"
            /> */}
          {/* </svg> */}
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
                      />
                    </div>
                  }
                ></ReactFlipCard>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="main-nav__play" onClick={nextSlide}>
          <img
            src={`${
              cardBackStyles[cardBackStyle || "default"]?.image ||
              cardBackStyles.default.image
            }`}
            alt="Card back style"
          />
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
