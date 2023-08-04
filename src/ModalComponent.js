import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import { Close as CloseIcon, PlayCircleOutline } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useFetchTrailer from './useFetchTrailer';

const ModalContent = ({ item }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { trailer, loading } = useFetchTrailer(item.id, item.type);

  useEffect(() => {
    const preloadImage = new Image();
    preloadImage.src = `https://image.tmdb.org/t/p/w500/${item.backdrop_path}`;
    preloadImage.onload = () => {
      setImageLoaded(true);
    };
  }, [item.backdrop_path]);

  const handlePlayClick = () => {
    if (trailer && trailer.results.length > 0) {
      const videoUrl = `https://www.youtube.com/watch?v=${trailer.results[0].key}`;
      window.location.href = videoUrl;  // This will open the YouTube video in the same tab
    }
  };

  const [readMore, setReadMore] = useState(false);

  const handleReadMoreClick = () => {
    setReadMore(true);
  };

  return (
    <div>
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%", // 16:9 aspect ratio
          overflow: "hidden",
          boxShadow: "0 0 0 1px #dadce0",
          display: imageLoaded ? "block" : "none",
        }}
      >
        <img
          src={`https://image.tmdb.org/t/p/w500/${item.backdrop_path}`}
          alt="Backdrop Image"
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {!loading && trailer && trailer.results.length > 0 ? (
          <IconButton
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#fff",
            }}
            onClick={handlePlayClick}
          >
            <PlayCircleOutline
              style={{
                height: "48px",
                lineHeight: "48px",
                width: "48px",
              }}
            />
          </IconButton>
        ) : null}
      </div>
      <h2
        style={{
          margin: "1rem",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: "2",
          WebkitBoxOrient: "vertical",
          color: "#70757a",
          textAlign: "left",
        }}
      >
        {item.title}
      </h2>
      <p
        style={{
          margin: "1rem",
          textAlign: "left",
          color: "#70757a",
          display: "inline-block",
        }}
      >
        {readMore ? item.overview : item.overview.length > 100 ? item.overview.slice(0, 100) + "... " : item.overview}
        {item.overview.length > 100 && !readMore && (
          <a
            style={{
              color: "#007BFF",
              display: "inline-flex",
              alignItems: "center",
            }}
            onClick={handleReadMoreClick}
          >
            more <ExpandMoreIcon />
          </a>
        )}
      </p>
    </div>
  );
};

const ModalComponent = ({
  selectedItemIndex,
  handleModalClose,
  handleModalNavigation,
  likedItems,
  drawerWidth,
}) => {
  const settings = {
    initialSlide: selectedItemIndex,
    afterChange: handleModalNavigation,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
  };

  return (
    <Dialog
      open={selectedItemIndex !== null}
      onClose={handleModalClose}
      classes={{ paper: "custom-modal-paper" }}
      PaperProps={{
        style: {
          touchAction: 'none',
          margin: "0",
          height: "100vh",
          position: "fixed",
          right: "0",
          top: "0",
          maxHeight: "unset",
          maxWidth: "unset",
        },
      }}
    >
      <div style={{ width: drawerWidth, position: "relative" }}>
        {selectedItemIndex !== null && (
          <>
            <IconButton
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                color: "#fff",
                zIndex: "1",
                backgroundColor: "rgb(255, 255, 255, 0.1)",
              }}
              onClick={handleModalClose}
            >
              <CloseIcon />
            </IconButton>
            <Slider {...settings}>
              {likedItems.map((item, index) => (
                <div key={index}>
                  <ModalContent item={item} />
                </div>
              ))}
            </Slider>
          </>
        )}
      </div>
    </Dialog>
  );
};

export default ModalComponent;
