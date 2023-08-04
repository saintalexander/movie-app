import React, { useState, useRef, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import ColorThief from 'colorthief';
import IconButton from '@mui/material/IconButton';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import UndoIcon from '@mui/icons-material/Undo';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress component
import { fetchItems, fetchGenres } from './Api';
import DrawerComponent from './DrawerComponent';
import LottieAnimation from './LottieAnimation';
import animationData from './img/MovieReel.json';

const Advanced = ({ setLikedItems, handleDrawerToggle }) => {
  const [items, setItems] = useState([]);
  const [genres, setGenres] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedItems, setLikedItemsState] = useState([]);
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const currentIndexRef = useRef(currentIndex);
  const childRefs = useRef([]);
  const leftButtonRef = useRef(null);
  const rightButtonRef = useRef(null);
  const buttonSwipeRef = useRef(false);

  const [gradient, setGradient] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading state to true

      const fetchedItems = await fetchItems();
      const fetchedGenres = await fetchGenres();

      // Simulate a delay before setting loading to false
      setTimeout(() => {
        setItems(fetchedItems);
        setGenres(fetchedGenres);
        setCurrentIndex(fetchedItems.length - 1);
        childRefs.current = Array(fetchedItems.length)
          .fill(0)
          .map(() => React.createRef());

        setLoading(false); // Set loading state to false after data is fetched
      }, 0); // Adjust the delay time as needed
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
      setLikedItemsState((prevLikedItems) => [{ ...item, type: item.type }, ...prevLikedItems]);
      setLikedItems((prevLikedItems) => [{ ...item, type: item.type }, ...prevLikedItems]);
      
    }
  };

  const outOfFrame = (name, idx) => {
    console.log(`outOfFrame called for ${name} (${idx})`, currentIndexRef.current);
  
    // Only process the out ofFrame if the index matches the current index.
    if (idx === 0) {
      console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
  
      // Check if it's the last card and if the card has left the screen fully
      const isLastCard = idx === 0;
  
      if (isLastCard) {
        setShowMessage(true);
      }
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

// Continue rating handler
const handleContinueRating = async () => {
  setLoading(true); // Set loading state to true

  const newItems = await fetchItems();

  // Simulate a delay before setting new items and resetting the state
  setTimeout(() => {
    setItems(newItems);
    setCurrentIndex(newItems.length - 1);
    childRefs.current = Array(newItems.length)
      .fill(0)
      .map(() => React.createRef());

    setLoading(false); // Set loading state to false

    setShowMessage(false); // Hide the thank you message

    // Additional logic if needed
  }, 1000); // Adjust the delay time as needed
};

  return (
    <div className="recomovi-root" style={{ backgroundImage: gradient }}>
{items[currentIndex] ? (
  <div
    className="backgroundImage"
    style={{
      backgroundImage: `url(${
        items[currentIndex] && items[currentIndex].poster_path
          ? `https://image.tmdb.org/t/p/w500/${items[currentIndex].poster_path}`
          : 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3000&q=80'
      })`,
      transition: 'background-image 0.5s ease-in-out',
    }}
  />
) : (
  <div
    className="backgroundImage"
    style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3000&q=80')`,
      transition: 'background-image 0.5s ease-in-out',
    }}
  />
)}


<DrawerComponent open={false} likedItems={likedItems} setLikedItems={setLikedItems} handleDrawerToggle={handleDrawerToggle} />
    
      {loading ? (
            <div className="loadingContainer">
              <CircularProgress color="primary" size={40} />
            </div>
      ) : showMessage ? (
        <div className="messageComponent">
        
          <div className="messageContent">
          <div className="messageImage">
        <LottieAnimation animationData={animationData} />
      </div>
            <div className="messageTitle">Thanks for your feedback</div>
            <div className="messageSubtitle">Rating films and TV shows improves picks for you</div>
            <div className="buttonContainer">
      <Button
        variant="contained"
        color="primary"
        onClick={handleContinueRating}
        className="continueButton"
      >
        Continue rating
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleDrawerToggle}
        className="viewRecButton"
      >
        View recommendations
      </Button>
    </div>
          </div>
        </div>
      ) : (
        <>
         

          <link href="https://fonts.googleapis.com/css?family=Damion&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css?family=Alatsi&display=swap" rel="stylesheet" />
          <div className="recomovi-swiper">
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
                      {items[currentIndex].imdbRating !== 'N/A' && items[currentIndex].imdbRating !== '' ? (
  <a href={items[currentIndex].imdbLink} target="_blank" rel="noopener noreferrer">
    <span className="imdbScore">{items[currentIndex].imdbRating}</span>
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
  <div 
    
    onClick={() => swipe('left', items[currentIndex], currentIndex)}
  >
    <IconButton
    ref={leftButtonRef}
    className="leftButton"
      color="primary"
      disabled={!canSwipe}
      aria-label="Thumb Down"
    >
      <ThumbDownOutlinedIcon />
    </IconButton>
    <p>Dislike</p>
  </div>

  <div onClick={() => goBack()}>
    <IconButton
      color="primary"
      disabled={!canGoBack}
      aria-label="Undo"
      size="small"
    >
      <UndoIcon />
    </IconButton>
    <p>Undo</p>
  </div>

  <div 
    
    onClick={() => swipe('right', items[currentIndex], currentIndex)}
  >
    <IconButton
    ref={rightButtonRef}
    className="rightButton"
      color="primary"
      disabled={!canSwipe}
      aria-label="Thumb Up"
    >
      <ThumbUpOutlinedIcon />
    </IconButton>
    <p>Like</p>
  </div>
</div>

            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Advanced;