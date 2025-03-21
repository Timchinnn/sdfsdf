import React, { useState, useEffect } from "react";
import styles from "./AddEditDeck.module.css";
import { useParams, useHistory } from "react-router-dom";
import { cardsService, cardSetsService } from "services/api";
import routeAddEditDeck from "./route";
import addimg from "assets/img/addimg.png";
import left from "assets/img/left.png";
import right from "assets/img/right.png";

const AddEditDeck = () => {
  const { id } = useParams();
  const history = useHistory();

  console.log(id);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rewards, setRewards] = useState([
    { type: "experience", value: 0 },
    { type: "hourly_income", value: 0 },
    { type: "coins", value: 0 },
    { type: "card", value: "" },
  ]);
  const [activeRewards, setActiveRewards] = useState({
    coins: false,
    hourly_income: false,
    card: false,
    experience: false,
  });
  const [cardReward, setCardReward] = useState("");
  console.log(cardReward);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentAvailableIndex, setCurrentAvailableIndex] = useState(0);

  const [cards, setCards] = useState([]);
  const [existingCards, setExistingCards] = useState([]);
  const [cardsInSet, setCardsInSet] = useState(new Set());
  const [showAddCards, setShowAddCards] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [pendingChanges, setPendingChanges] = useState({
    addedCards: new Set(),
    removedCards: new Set(),
  });
  useEffect(() => {
    const fetchSetData = async () => {
      if (id) {
        try {
          const response = await cardSetsService.getSetRewards(id);
          const data = response.data;
          setName(data.title || "");
          setDescription(data.description || "");

          // Инициализируем активные вознаграждения
          const activeRewardsState = {
            coins: false,
            hourly_income: false,
            card: false,
            experience: false,
          };
          // Создаем новый массив rewards с начальной структурой
          const newRewards = [
            { type: "experience", value: 0 },
            { type: "hourly_income", value: 0 },
            { type: "coins", value: 0 },
            { type: "card", value: "" },
          ];
          // Обновляем значения из полученных данных
          if (data.rewards) {
            data.rewards.forEach((reward) => {
              // Отмечаем тип награды как активный
              activeRewardsState[reward.type] = true;
              // Обновляем значение в массиве наград
              const existingReward = newRewards.find(
                (r) => r.type === reward.type
              );
              if (existingReward) {
                if (reward.type === "card") {
                  // Находим карту по ID и устанавливаем её название
                  const card = cards.find((c) => c.id === reward.value);
                  existingReward.value = card ? card.title : reward.value;
                } else {
                  existingReward.value = reward.value;
                }
              }
            });
          }
          // Устанавливаем состояния
          setActiveRewards(activeRewardsState);
          setRewards(newRewards);
        } catch (error) {
          console.error("Ошибка при получении наград набора:", error);
        }
      }
    };
    fetchSetData();
  }, [id, cards]);
  // Обновляем при загрузке существующих карт
  useEffect(() => {
    setCardsInSet(new Set(existingCards.map((card) => card.id)));
  }, [existingCards]);
  useEffect(() => {
    const fetchExistingCards = async () => {
      if (id) {
        try {
          const response = await cardSetsService.getSetCards(id);
          setExistingCards(response.data);
        } catch (error) {
          console.error("Error fetching existing cards:", error);
        }
      }
    };
    fetchExistingCards();
  }, [id]);
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await cardsService.getAllCards();
        setCards(response.data);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };
    fetchCards();
  }, []);

  const handleAddCardToSet = (cardId) => {
    setPendingChanges((prev) => ({
      ...prev,
      addedCards: prev.addedCards.add(cardId),
    }));

    // Добавляем карточку также в existingCards
    // const cardToAdd = cards.find((card) => card.id === cardId);
    // if (cardToAdd) {
    //   setExistingCards((prev) => [...prev, cardToAdd]);
    // }

    setCardsInSet((prev) => new Set([...prev, cardId]));
  };

  const handleRemoveCardFromSet = (cardId) => {
    // Скрываем карточку визуально
    setCardsInSet((prev) => {
      const newSet = new Set(prev);
      newSet.delete(cardId);
      return newSet;
    });

    // Добавляем в список ожидающих удаления
    setPendingChanges((prev) => ({
      ...prev,
      removedCards: prev.removedCards.add(cardId),
    }));
  };
  // const handleSave = async () => {
  //   try {
  //     // Удаление карт
  //     for (const cardId of pendingChanges.removedCards) {
  //       await cardSetsService.removeCardFromSet(id, cardId);
  //     }

  //     // Добавление новых карт
  //     for (const cardId of pendingChanges.addedCards) {
  //       await cardSetsService.addCardToSet(id, cardId);
  //     }

  //     const response = await cardSetsService.getSetCards(id);
  //     setExistingCards(response.data);
  //     setPendingChanges({
  //       addedCards: new Set(),
  //       removedCards: new Set(),
  //     });
  //   } catch (error) {
  //     console.error("Error saving changes:", error);
  //   }
  // };
  const handleCardRewardChange = async (e) => {
    const value = e.target.value;
    setCardReward(value);

    if (value.length > 0) {
      // Фильтруем карты по введенному значению
      const filteredCards = cards.filter((card) =>
        card.title.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredCards);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  const handleSuggestionClick = (card) => {
    setCardReward(card.title);
    setSuggestions([]);
    setShowSuggestions(false);
  };
  const handleSave = async () => {
    try {
      if (id) {
        const activeRewardsList = rewards.filter(
          (reward) => activeRewards[reward.type]
        );
        // Update existing set
        await cardSetsService.updateSetRewards(id, {
          title: name,
          description: description,
          rewards: activeRewardsList.map((reward) => ({
            type: reward.type,
            value:
              reward.type === "card"
                ? cards.find((c) => c.title === reward.value)?.id ||
                  reward.value
                : reward.value,
          })),
        });
        // Remove cards
        for (const cardId of pendingChanges.removedCards) {
          await cardSetsService.removeCardFromSet(id, cardId);
        }
        // Add new cards
        for (const cardId of pendingChanges.addedCards) {
          await cardSetsService.addCardToSet(id, cardId);
        }
      } else {
        // Validate required fields
        if (!name.trim()) {
          throw new Error("Name is required");
        }
        if (!description.trim()) {
          throw new Error("Description is required");
        }
        if (cardsInSet.size === 0) {
          throw new Error("At least one card is required");
        }

        // Create new set
        const response = await cardSetsService.createCardSet({
          title: name,
          description: description,
          rewards: rewards.map((reward) => ({
            type: reward.type,
            value:
              reward.type === "card"
                ? cards.find((c) => c.title === reward.value)?.id ||
                  reward.value
                : reward.value,
          })),
        });
        // Add cards to new set
        if (response && response.data && response.data.setId) {
          const promises = Array.from(cardsInSet).map((cardId) =>
            cardSetsService.addCardToSet(response.data.setId, cardId)
          );
          await Promise.all(promises);
        } else {
          throw new Error("Failed to get new set ID from response");
        }
      }
      // Reset pending changes
      setPendingChanges({
        addedCards: new Set(),
        removedCards: new Set(),
      });
      // Show success message
      alert("Card set saved successfully");
      history.push("/cardmanagement");
    } catch (error) {
      console.error("Error saving changes:", error);
      if (error.response?.status === 400) {
        alert(error.message || "Invalid data. Please check your inputs.");
      } else {
        alert("An error occurred while saving the card set. Please try again.");
      }
    }
  };
  return (
    <div className={styles.contents}>
      <div className={styles.content}>
        <div>
          {" "}
          <h3>Карты в наборе:</h3>
          <div className={styles.mainContent}>
            <img
              src={left}
              className={styles.arrow}
              onClick={() => {
                // const filteredCards = cards.filter((card) =>
                //   cardsInSet.has(card.id)
                // );
                currentSetIndex > 0 && setCurrentSetIndex(currentSetIndex - 1);
              }}
              alt="Previous"
            />
            {cards
              .filter((card) => cardsInSet.has(card.id))
              .slice(currentSetIndex, currentSetIndex + 3)
              .map((card) => (
                <div key={card.id} className={styles.cardItem}>
                  <div className={styles.cardItemImg}>
                    <img src={`${card.image}`} alt={card.title} />
                  </div>
                  <div className={styles.cardInfo}>
                    <h3>{card.title}</h3>
                  </div>
                  <button
                    onClick={() => handleRemoveCardFromSet(card.id)}
                    style={{ background: "red" }}
                  >
                    Удалить
                  </button>
                </div>
              ))}

            <div
              className={styles.whiteBox}
              onClick={() => setShowAddCards(!showAddCards)}
            >
              <div className={styles.whiteBoxImg}>
                <img src={addimg} alt="#" style={{ height: "64px" }} />
                <p
                  style={{
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                    hyphens: "auto",
                  }}
                >
                  Добавьте изображение
                </p>
              </div>
            </div>
            <img
              src={right}
              className={styles.arrow}
              onClick={() => {
                const filteredCards = cards.filter((card) =>
                  cardsInSet.has(card.id)
                );
                currentSetIndex < filteredCards.length - 3 &&
                  setCurrentSetIndex(currentSetIndex + 1);
              }}
              alt="Next"
            />
          </div>
          {showAddCards && (
            <div>
              <h3>Добавить карты в набор</h3>
              <div className={styles.mainContent}>
                <img
                  src={left}
                  className={styles.arrow}
                  onClick={() => {
                    // const filteredCards = cards.filter(
                    //   (card) => !cardsInSet.has(card.id)
                    // );
                    currentAvailableIndex > 0 &&
                      setCurrentAvailableIndex(currentAvailableIndex - 1);
                  }}
                  alt="Previous"
                />
                {cards
                  .filter(
                    (card) =>
                      !cardsInSet.has(card.id) &&
                      card.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  )
                  .slice(currentAvailableIndex, currentAvailableIndex + 3)
                  .map((card) => (
                    <div key={card.id} className={styles.cardItem}>
                      <div className={styles.cardItemImg}>
                        <img src={`${card.image}`} alt={card.title} />
                      </div>
                      <div className={styles.cardInfo}>
                        <h3>{card.title}</h3>
                      </div>
                      <button
                        onClick={() => handleAddCardToSet(card.id)}
                        disabled={cardsInSet.has(card.id)}
                      >
                        {cardsInSet.has(card.id)
                          ? "В наборе"
                          : "Добавить в набор"}
                      </button>
                    </div>
                  ))}
                <img
                  src={right}
                  className={styles.arrow}
                  onClick={() => {
                    const filteredCards = cards.filter(
                      (card) => !cardsInSet.has(card.id)
                    );
                    currentAvailableIndex < filteredCards.length - 3 &&
                      setCurrentAvailableIndex(currentAvailableIndex + 1);
                  }}
                  alt="Next"
                />
              </div>
              <div className={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Поиск по названию"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>
          )}
        </div>
        <div className={styles.inputContainer}>
          <div style={{ marginRight: "20px" }}>
            <h2 className={styles.title}>Название</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <h2 className={styles.title}>Описание</h2>
            <textarea
              className={styles.describedCard}
              placeholder="Введите описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className={styles.rewardSection}>
              <div className={styles.rewardItem}>
                <input
                  type="checkbox"
                  checked={activeRewards.coins}
                  onChange={(e) =>
                    setActiveRewards({
                      ...activeRewards,
                      coins: e.target.checked,
                    })
                  }
                />
                <h2 className={styles.title}>Вознаграждение</h2>
                <input
                  type="text"
                  value={
                    activeRewards.coins
                      ? rewards.find((r) => r.type === "coins")?.value || ""
                      : ""
                  }
                  onChange={(e) => {
                    const newRewards = rewards.map((r) =>
                      r.type === "coins"
                        ? { ...r, value: parseInt(e.target.value) || 0 }
                        : r
                    );
                    setRewards(newRewards);
                  }}
                  disabled={!activeRewards.coins}
                />
              </div>
              <div className={styles.rewardItem}>
                <input
                  type="checkbox"
                  checked={activeRewards.experience}
                  onChange={(e) =>
                    setActiveRewards({
                      ...activeRewards,
                      experience: e.target.checked,
                    })
                  }
                />
                <h2 className={styles.title}>Опыт</h2>
                <input
                  type="text"
                  value={
                    activeRewards.experience
                      ? rewards.find((r) => r.type === "experience")?.value ||
                        ""
                      : ""
                  }
                  onChange={(e) => {
                    const newRewards = rewards.map((r) =>
                      r.type === "experience"
                        ? { ...r, value: parseInt(e.target.value) || 0 }
                        : r
                    );
                    setRewards(newRewards);
                  }}
                  disabled={!activeRewards.experience}
                />
              </div>
              <div className={styles.rewardItem}>
                <input
                  type="checkbox"
                  checked={activeRewards.hourly_income}
                  onChange={(e) =>
                    setActiveRewards({
                      ...activeRewards,
                      hourly_income: e.target.checked,
                    })
                  }
                />
                <h2 className={styles.title}>Вознаграждение в час</h2>
                <input
                  type="text"
                  value={
                    activeRewards.hourly_income
                      ? rewards.find((r) => r.type === "hourly_income")
                          ?.value || ""
                      : ""
                  }
                  onChange={(e) => {
                    const newRewards = rewards.map((r) =>
                      r.type === "hourly_income"
                        ? { ...r, value: parseInt(e.target.value) || 0 }
                        : r
                    );
                    setRewards(newRewards);
                  }}
                  disabled={!activeRewards.hourly_income}
                />
              </div>
              <div className={styles.rewardItem}>
                <input
                  type="checkbox"
                  checked={activeRewards.card}
                  onChange={(e) =>
                    setActiveRewards({
                      ...activeRewards,
                      card: e.target.checked,
                    })
                  }
                />
                <h2 className={styles.title}>Вознаграждение картой</h2>
                <div className={styles.autocompleteContainer}>
                  <input
                    type="text"
                    value={
                      activeRewards.card
                        ? rewards.find((r) => r.type === "card")?.value || ""
                        : ""
                    }
                    onChange={(e) => {
                      const newRewards = rewards.map((r) =>
                        r.type === "card" ? { ...r, value: e.target.value } : r
                      );
                      setRewards(newRewards);
                      handleCardRewardChange(e);
                    }}
                    placeholder="Введите название карты"
                    disabled={!activeRewards.card}
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <div className={styles.suggestionsList}>
                      {suggestions.map((card) => (
                        <div
                          key={card.id}
                          className={styles.suggestionItem}
                          onClick={() => {
                            handleSuggestionClick(card);
                            const newRewards = rewards.map((r) =>
                              r.type === "card"
                                ? { ...r, value: card.title }
                                : r
                            );
                            setRewards(newRewards);
                          }}
                        >
                          {card.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>{" "}
                <div className={styles.save}>
                  <button onClick={handleSave} className={styles.saveButton}>
                    Сохранить изменения
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export { routeAddEditDeck };

export default AddEditDeck;
