import React, { useState, useEffect } from "react";
import ReactFlipCard from "reactjs-flip-card";
import { userInitService } from "services/api";
import { cardsService } from "services/api";
import { userCardsService } from "services/api";
import { useSelector } from "react-redux";
import DefaultImg from "assets/img/default-card.png";
import Style1CardBack from "assets/img/card1.png";
import Style2CardBack from "assets/img/card2.png";
// Отсутствует определение cardBackStyles
const cardBackStyles = {
  default: { image: DefaultImg },
  style1: { image: Style1CardBack },
  style2: { image: Style2CardBack },
};

const data = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  bgColor: "#F54748",
  title: `Slide ${i + 1}`,
}));
const MainCarousel = ({
  getActiveSlide,
  handleOpenPopup,
  shouldUpdate,
  onUpdateComplete,
}) => {
  const [isButtonLocked, setIsButtonLocked] = useState(false);
  const [nextOpenTime, setNextOpenTime] = useState({});
  const [remainingTime, setRemainingTime] = useState({});
  const [openedCards, setOpenedCards] = useState({});
  const cardBackStyle = useSelector((state) => state.cardBack);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isSwipeLocked, setIsSwipeLocked] = useState(false);
  // Minimum distance required for swipe
  const minSwipeDistance = 50;
  // const [responseTime, setResponseTime] = useState(null);
  // useEffect(() => {
  //   const measureResponseTime = async () => {
  //     const startTime = performance.now();
  //     try {
  //       const response = await fetch("https://api.zoomayor.io/api/cards");
  //       const endTime = performance.now();
  //       const time = endTime - startTime;
  //       setResponseTime(time);
  //       alert(`Время ответа сервера: ${Math.round(time)}мс`);
  //     } catch (error) {
  //       console.error("Ошибка при измерении времени ответа:", error);
  //     }
  //   };

  //   measureResponseTime();
  // }, []);
  const getCardBackImage = () => {
    // Measure response time to determine connection speed
    const startTime = performance.now();

    // If cardBackStyle is missing, return default image
    if (!cardBackStyle) return cardBackStyles.default.image;
    // If cardBackStyle is a full URL
    if (typeof cardBackStyle === "string" && cardBackStyle.startsWith("/img")) {
      const baseUrl = `https://api.zoomayor.io${cardBackStyle}`;
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      // console.log(responseTime);
      // console.log(responseTime);
      // Add _bad suffix for slow connections (>400ms)
      if (responseTime < 2000) {
        // Check if path has extension
        const hasExtension = /\.[^.]+$/.test(baseUrl);
        // console.log(baseUrl);
        return hasExtension
          ? baseUrl.replace(/(\.[^.]+)$/, "bad$1")
          : baseUrl + "bad";
      }
      return baseUrl;
    }
    // If cardBackStyle is a key in cardBackStyles
    if (cardBackStyles[cardBackStyle] && cardBackStyles[cardBackStyle].image) {
      return cardBackStyles[cardBackStyle].image;
    }
    // Default case
    return cardBackStyles.default.image;
  };
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
      setActiveSlide((prev) => (prev - 1 + data.length) % data.length);
    }
  };
  // console.log(cardBackStyle);
  const [photos, setPhotos] = useState([]); // Добавить состояние для хранения всех фото
  const [selectedPhotos, setSelectedPhotos] = useState({}); // Объект для хранения фото для каждой карточки
  const [energy, setEnergy] = useState(100); // Initial energy state
  // const [remainingTime, setRemainingTime] = useState("00:00:00");
  const MAX_ENERGY = 1000;
  useEffect(() => {
    const fetchEnergy = async () => {
      const tg = window.Telegram.WebApp;
      if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
        try {
          const telegram_id = tg.initDataUnsafe.user.id;
          const response = await userInitService.getEnergy(telegram_id);
          if (response.data && response.data.energy !== undefined) {
            setEnergy(response.data.energy);
          }
        } catch (error) {
          console.error("Error fetching energy:", error);
        }
      }
    };
    fetchEnergy();
    // Обновляем интервал, используя MAX_ENERGY вместо maxEnergy
    const energyInterval = setInterval(() => {
      setEnergy((prevEnergy) => {
        if (prevEnergy < MAX_ENERGY) {
          return prevEnergy + 1;
        }
        return prevEnergy;
      });
    }, 1000);
    return () => clearInterval(energyInterval);
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const newRemainingTime = {};
      Object.entries(nextOpenTime).forEach(([index, time]) => {
        if (time > now) {
          const remaining = time - now;
          const seconds = Math.floor(remaining / 1000);
          const milliseconds = remaining % 1000;
          newRemainingTime[index] = {
            seconds,
            milliseconds,
          };
        }
      });
      setRemainingTime(newRemainingTime);
    }, 10); // Обновляем каждые 10мс для плавности
    return () => clearInterval(timer);
  }, [nextOpenTime]);
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const startTime = performance.now();
        const response = await cardsService.getAllCards();
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        console.log(responseTime);

        // Process the response data based on response time
        if (responseTime > 800) {
          // For slow connections, modify image names
          const modifiedData = response.data.map((card) => {
            if (card.image) {
              // Check if image path has extension
              const hasExtension = /\.[^.]+$/.test(card.image);
              return {
                ...card,
                image: hasExtension
                  ? card.image.replace(/(\.[^.]+)$/, "bad$1") // Add 'bad' before extension
                  : card.image + "bad", // Add 'bad' at the end if no extension
              };
            }
            console.log(modifiedData);
            return card;
          });
          setPhotos(modifiedData);
        } else {
          // For fast connections, use original images
          setPhotos(response.data);
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };
    fetchPhotos();
  }, []);
  const [activeSlide, setActiveSlide] = useState(0);

  const [activeIndex, setActiveIndex] = useState(null);
  useEffect(() => {
    if (photos.length > 0 && !shouldUpdate) {
      const weightedRandom = (items) => {
        // Фильтруем предметы с нулевым шансом выпаденияа
        const availableItems = items.filter((item) => {
          const chance = parseFloat(item.chance);
          return !isNaN(chance) && chance > 0;
        });
        // Если нет доступных предметов, возвращаем null
        if (availableItems.length === 0) {
          return null;
        }
        // Считаем общий вес с поддержкой дробных чисел
        const totalWeight = availableItems.reduce(
          (sum, item) => sum + parseFloat(item.chance || 0.001),
          0
        );
        // Нормализуем шансы
        const normalizedItems = availableItems.map((item) => ({
          ...item,
          normalizedChance: parseFloat(item.chance || 0.001) / totalWeight,
        }));
        // Выбираем случайный элемент
        const random = Math.random();
        let cumulativeWeight = 0;

        for (const item of normalizedItems) {
          cumulativeWeight += item.normalizedChance;
          if (random <= cumulativeWeight) {
            return item;
          }
        }
        return normalizedItems[0];
      };

      const newSelectedPhotos = data.reduce((acc, item) => {
        const selectedItem = weightedRandom(photos);
        if (selectedItem) {
          acc[item.id] = selectedItem;
        }
        return acc;
      }, {});
      setSelectedPhotos(newSelectedPhotos);
    }
  }, [photos, data, shouldUpdate]);
  const nextSlide = () => {
    // console.log(`1${isButtonLocked}`);
    if (isButtonLocked) return; // Проверяем блокировку
    setActiveSlide((prev) => (prev + 1) % data.length);
    setIsFlipped(false); // Сбрасываем состояние переворота при переключении
  };
  useEffect(() => {
    if (shouldUpdate) {
      setIsSwipeLocked(false);
      setIsFlipped(false);
      setActiveIndex(null);
      setOpenedCards({});
      setTimeout(() => {
        if (photos.length > 0) {
          // Используем функцию weightedRandom для каждой карты
          const newSelectedPhotos = data.reduce((acc, item) => {
            const totalWeight = photos.reduce(
              (sum, photo) => sum + (photo.chance || 1),
              0
            );
            const random = Math.random() * totalWeight;
            let cumulativeWeight = 0;

            for (const photo of photos) {
              cumulativeWeight += photo.chance || 1;
              if (random <= cumulativeWeight) {
                acc[item.id] = photo;
                break;
              }
            }
            return acc;
          }, {});
          setSelectedPhotos(newSelectedPhotos);
        }
        onUpdateComplete();
      }, 500);
    }
  }, [shouldUpdate, photos, onUpdateComplete, data]);

  const getStyles = (index) => {
    const currentIndex = activeSlide % data.length;
    const prevIndex = (currentIndex - 1 + data.length) % data.length;
    const nextIndex = (currentIndex + 1) % data.length;
    if (index === currentIndex) {
      return {
        opacity: 1,
        transform: "translateX(0) translateZ(0px) rotateY(0deg)",
        zIndex: 10,
      };
    } else if (index === prevIndex) {
      return {
        opacity: 0.6,
        transform: "translateX(-200px) translateZ(-500px) rotateY(60deg)",
        zIndex: 9,
        // isBackCard: true,
      };
    } else if (index === nextIndex) {
      return {
        opacity: 0.6,
        transform: "translateX(200px) translateZ(-500px) rotateY(-60deg)",
        zIndex: 9,
        // isBackCard: true,
      };
    } else {
      return {
        opacity: 0,
        transform: "translateX(0) translateZ(-600px) rotateY(0deg)",
        zIndex: 7,
      };
    }
  };

  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const ANIMATION_DURATION = 500;
  const handleImageClick = async (index) => {
    if (energy < 40) {
      return; // Недостаточно энергии
    }
    if (isAnimating) return;
    // Check if card is still locked
    if (nextOpenTime[index] && Date.now() < nextOpenTime[index]) {
      return; // Card is still locked
    }
    const selectedCard = selectedPhotos[data[index].id];

    // Preload the card image
    // try {
    //   await new Promise((resolve, reject) => {
    //     const img = new Image();
    //     img.src = `https://api.zoomayor.io${selectedCard.image}`;
    //     img.onload = () => resolve(selectedCard);
    //     img.onerror = () => reject();
    //   });
    // } catch (error) {
    //   console.error("Error preloading image:", error);
    //   return;
    // }
    setIsAnimating(true);
    setIsSwipeLocked(true);
    setIsButtonLocked(true);

    const nextTime = Date.now() + 2500; // 5 seconds cooldown
    setNextOpenTime((prev) => ({ ...prev, [index]: nextTime }));
    setTimeout(() => {
      setIsFlipped(true);
      setTimeout(() => {
        setIsSwipeLocked(false);
        setIsButtonLocked(false);
        setIsAnimating(false);
        setIsFlipped(false);
      }, 2500);
    }, ANIMATION_DURATION);
    const tg = window.Telegram.WebApp;
    const telegram_id = tg.initDataUnsafe?.user?.id;
    if (!telegram_id) {
      console.error("Telegram ID not found");
      return;
    }
    try {
      const newEnergy = Math.max(0, energy - 40);
      await userInitService.updateEnergy(telegram_id, newEnergy);
      setEnergy(newEnergy);
      setIsFlipped(true);
      setOpenedCards({
        ...openedCards,
        [index]: selectedCard,
      });
      await userCardsService.addCardToUser(telegram_id, selectedCard.id);

      if (selectedCard.type === "energy_boost") {
        const boostValue = Number(selectedCard.energy) || 100;
        const boostedEnergy = Math.min(newEnergy + boostValue, 1000);
        await userInitService.updateEnergy(telegram_id, boostedEnergy);
        setEnergy(boostedEnergy);
      }
      handleOpenPopup(selectedCard);
    } catch (error) {
      console.error("Error in handleImageClick:", error);
    }
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
      <div
        className="main-carousel"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {" "}
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
                  flipTrigger="disabled"
                  flipByProp={activeSlide === i && isFlipped}
                  className="main-slider__card"
                  onClick={() => handleImageClick(i)}
                  frontComponent={
                    <div className="main-slider__image">
                      <img src={getCardBackImage()} alt="Card back" />
                      {remainingTime[i] && (
                        <div
                          className="card-timer"
                          style={{
                            position: "absolute",
                            top: "10px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "rgba(0, 0, 0, 0.7)",
                            color: "white",
                            padding: "5px 15px",
                            borderRadius: "4px",
                            minWidth: "100px",
                            textAlign: "center",
                          }}
                        >
                          {String(
                            Math.floor(remainingTime[i].seconds)
                          ).padStart(2, "0")}
                          :
                          {String(
                            Math.floor(remainingTime[i].milliseconds)
                          ).padStart(3, "0")}
                        </div>
                      )}
                    </div>
                  }
                  backComponent={
                    <div className="main-slider__image">
                      <img
                        src={
                          getStyles(i).isBackCard
                            ? getCardBackImage()
                            : openedCards[i]?.image
                            ? `https://api.zoomayor.io${openedCards[i].image}`
                            : selectedPhotos[item.id]?.image
                            ? `https://api.zoomayor.io${
                                selectedPhotos[item.id].image
                              }`
                            : cardBackStyles.default.image
                        }
                        alt=""
                      />
                    </div>
                  }
                />
              </div>
            </React.Fragment>
          ))}
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
            <div
              className="main-nav__progress-bar"
              data-energy={energy < 40}
              style={{ width: `${(energy / MAX_ENERGY) * 100}%` }}
            ></div>
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
            {`${energy}/${MAX_ENERGY}`}
          </div>
        </div>
        <div className="main-nav__play" onClick={nextSlide}>
          <svg
            width="24"
            height="14"
            viewBox="0 0 24 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M19.583 3.04905C17.683 2.16705 15.0029 1.60004 12 1.60004C8.99712 1.60004 6.31706 2.16702 4.41702 3.04905C2.45202 3.96105 1.6 5.06205 1.6 5.99996C1.6 6.93787 2.45199 8.03895 4.41702 8.95087C5.79302 9.58987 7.57914 10.0639 9.6 10.2759V9.59988C9.6 9.27589 9.795 8.98489 10.094 8.86089C10.393 8.73689 10.737 8.80589 10.966 9.03389L12.566 10.6339C12.878 10.9469 12.878 11.4529 12.566 11.7659L10.966 13.3659C10.737 13.5939 10.393 13.6629 10.094 13.5389C9.795 13.4149 9.6 13.1239 9.6 12.7999V11.8839C7.363 11.6649 5.34298 11.1449 3.744 10.4029C1.65601 9.43288 0 7.9339 0 5.99995C0 4.066 1.65601 2.56699 3.744 1.59701C5.89801 0.597018 8.81792 0 12 0C15.1821 0 18.102 0.596992 20.256 1.59701C22.344 2.56701 24 4.066 24 5.99995C24 7.54496 22.931 8.8139 21.487 9.73396C20.02 10.669 18.0069 11.356 15.7239 11.716C15.2879 11.785 14.8779 11.486 14.8099 11.05C14.7409 10.614 15.0389 10.204 15.4759 10.135C17.613 9.79896 19.3989 9.16698 20.6269 8.38497C21.8779 7.58797 22.3999 6.74197 22.3999 5.99997C22.3999 5.06197 21.548 3.96097 19.583 3.04905Z"
              fill="#AAB2BD"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MainCarousel;
