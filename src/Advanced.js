import React, { useState, useRef, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import ColorThief from 'colorthief';
import IconButton from '@mui/material/IconButton';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import UndoIcon from '@mui/icons-material/Undo';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { fetchItems, fetchGenres } from './Api';
import DrawerComponent from './DrawerComponent';

const Advanced = ({ setLikedItems }) => {
  const [items, setItems] = useState([]);
  const [genres, setGenres] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedItems, setLikedItemsState] = useState([]);
  const currentIndexRef = useRef(currentIndex);
  const childRefs = useRef([]);
  const leftButtonRef = useRef(null);
  const rightButtonRef = useRef(null);
  const buttonSwipeRef = useRef(false);

  const [gradient, setGradient] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const fetchedItems = await fetchItems();
      const fetchedGenres = await fetchGenres();

      setItems(fetchedItems);
      setGenres(fetchedGenres);
      setCurrentIndex(fetchedItems.length - 1);
      childRefs.current = Array(fetchedItems.length)
        .fill(0)
        .map(() => React.createRef());
    };

    fetchData();
  }, []);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const updateCurrentIndex = (val) => {
    // Only update the current index if it's different from the current value.
    if (val !== currentIndexRef.current) {
      setCurrentIndex(val);
      currentIndexRef.current = val;
    }
  };

  const canGoBack = currentIndex < items.length - 1;
  const canSwipe = currentIndex >= 0;

  const swiped = (direction, item, index) => {
    // Only process the swipe if the index matches the current index.
    if (index !== currentIndexRef.current) return;
  
    updateCurrentIndex(index - 1);
    console.log('swiped function called');
  
    if (direction === 'left') {
      leftButtonRef.current.style.backgroundColor = 'white';
      leftButtonRef.current.style.color = '#9198e5';
      leftButtonRef.current.style.transform = 'scale(1)';
    } else if (direction === 'right') {
      rightButtonRef.current.style.backgroundColor = 'white';
      rightButtonRef.current.style.color = '#9198e5';
      rightButtonRef.current.style.transform = 'scale(1)';
      setLikedItemsState((prevLikedItems) => [...prevLikedItems, { ...item, type: item.type }]);
      setLikedItems((prevLikedItems) => [...prevLikedItems, { ...item, type: item.type }]);
    }
  };

  const outOfFrame = (name, idx) => {
    console.log(`outOfFrame called for ${name} (${idx})`, currentIndexRef.current);

    // Only process the out ofFrame if the index matches the current index.
    if (idx === currentIndexRef.current) {
      console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    }
  };

  const swipe = (direction, item, index) => {
    if (currentIndex < items.length) {
      if (childRefs.current[currentIndex] && childRefs.current[currentIndex].current) {
        setCurrentIndex(index - 1);
        childRefs.current[currentIndex].current.swipe(direction);
      } else {
        console.log(`Ref not available for index ${currentIndex}`);
      }
    } else {
      console.log('Cannot swipe');
    }
  };

  const goBack = async () => {
    if (!canGoBack) return;

    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);

    if (currentIndexRef.current >= newIndex && childRefs.current[newIndex].current) {
      childRefs.current[newIndex].current.restoreCard();
    }
  };

  const fetchDominantColor = async (url) => {
    const colorThief = new ColorThief();
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    return new Promise((resolve) => {
      img.onload = function () {
        const color = colorThief.getColor(this);
        resolve(color);
      };
      img.src = url;
    });
  };

  useEffect(() => {
    const fetchColor = async () => {
      const color = await fetchDominantColor(
        `https://image.tmdb.org/t/p/w220_and_h330_face/${items[currentIndex]?.poster_path}`
      );
      const gradientStart = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.2)`;
      const gradientEnd = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      const generatedGradient = `linear-gradient(${gradientStart} 33%, ${gradientEnd} 67%)`;
      setGradient(generatedGradient);
    };

    fetchColor();
  }, [currentIndex, items]);

  const onSwipeRequirementFulfilled = (direction) => {
    if (direction === 'left') {
      leftButtonRef.current.style.backgroundColor = '#d93025';
      leftButtonRef.current.style.color = 'white';
      leftButtonRef.current.style.transform = 'scale(1.05)';
    } else if (direction === 'right') {
      rightButtonRef.current.style.backgroundColor = '#1e8e3e';
      rightButtonRef.current.style.color = 'white';
      rightButtonRef.current.style.transform = 'scale(1.05)';
    }
  };

  const onSwipeRequirementUnfulfilled = (direction) => {
    leftButtonRef.current.style.backgroundColor = 'white';
    leftButtonRef.current.style.color = '#9198e5';
    leftButtonRef.current.style.transform = 'scale(1)';

    rightButtonRef.current.style.backgroundColor = 'white';
    rightButtonRef.current.style.color = '#9198e5';
    rightButtonRef.current.style.transform = 'scale(1)';
  };

  return (
    <div className="recomovi-swiper" style={{ backgroundImage: gradient }}>
      <DrawerComponent likedItems={likedItems} />

      {items[currentIndex] && (
        <div
          className="backgroundImage"
          style={{
            backgroundImage: `url(${
              items[currentIndex]?.poster_path
                ? `https://image.tmdb.org/t/p/w500/${items[currentIndex].poster_path}`
                : 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%253D%253D&auto=format&fit=crop&w=2940&q=80'
            })`,
            transition: 'background-image 0.5s ease-in-out',
          }}
        />
      )}
      <link href="https://fonts.googleapis.com/css?family=Damion&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css?family=Alatsi&display=swap" rel="stylesheet" />

      <div className="cardContainer">
        {items.map((item, index) => (
          <TinderCard
            ref={childRefs.current[index]}
            className={`swipe ${currentIndex === index ? 'current' : ''}`}
            key={item.id}
            onSwipe={(dir) => swiped(dir, item, index)}
            onCardLeftScreen={() => outOfFrame(item.title, index)} // Modify this line
            preventSwipe={['down']}
            swipeRequirementType="position"
            swipeThreshold="20"
            onSwipeRequirementFulfilled={onSwipeRequirementFulfilled}
            onSwipeRequirementUnfulfilled={onSwipeRequirementUnfulfilled}
          >
            <div
              style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500/${item.poster_path})` }}
              className="card"
            />
          </TinderCard>
        ))}
      </div>
      <div className="belowCard">
        <div className="movieMeta">
          {items[currentIndex] && (
            <>
              <div className="movieTitle">
                <span className="ellipsis">{items[currentIndex].title}</span>
              </div>
              <div className="movieInfo">
                <p>
                  {items[currentIndex].type} ‧ {items[currentIndex].releaseYear} ‧{' '}
                  {items[currentIndex].genreIds.map((genreId) => genres[genreId]).slice(0, 1).join(', ')}
                  {items[currentIndex].imdbRating !== 'N/A' && items[currentIndex].imdbRating !== '' && !isNaN(items[currentIndex].imdbRating) ? (
                    <a href={items[currentIndex].imdbLink} target="_blank" rel="noopener noreferrer">
                      <span className="imdbScore">
                        {Number(items[currentIndex].imdbRating) !== 0
                          ? Number(items[currentIndex].imdbRating) % 1 === 0
                            ? Number(items[currentIndex].imdbRating).toFixed(0)
                            : Number(items[currentIndex].imdbRating).toFixed(1)
                          : 'N/A'}
                      </span>
                    </a>
                  ) : (
                    <span className="imdbScore">N/A</span>
                  )}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="buttons">
          <IconButton
            ref={leftButtonRef}
            className="leftButton"
            color="primary"
            disabled={!canSwipe}
            onClick={() => swipe('left', items[currentIndex], currentIndex)}
            aria-label="Thumb Down"
          >
            <ThumbDownOutlinedIcon />
          </IconButton>

          <IconButton
            color="primary"
            disabled={!canGoBack}
            onClick={() => goBack()}
            aria-label="Undo"
            size="small"
          >
            <UndoIcon />
          </IconButton>

          <IconButton
            ref={rightButtonRef}
            className="rightButton"
            color="primary"
            disabled={!canSwipe}
            onClick={() => swipe('right', items[currentIndex], currentIndex)}
            aria-label="Thumb Up"
          >
            <ThumbUpOutlinedIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Advanced;
