import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const GridNavigation = ({ items, handleCardClick, itemsInViewport }) => (
  <div className="gridContainer">
    <div
            style={{
              display: 'flex',
              overflowX: 'auto',
              flexWrap: 'nowrap',
              padding: '1rem',
              paddingLeft: '2rem',
              gap: '0.8rem',
              marginLeft: '-2rem',
              marginRight: '-2rem',
            }}
          >
             {items.map((item, index) => (
              <Card
                key={index}
                style={{
                  flex: `0 0 calc(100% / ${itemsInViewport})`,
                  maxWidth: '100%',
                  border: 'none',
                  borderRadius: '0',
                  boxShadow: 'none',
                  padding: '0',
                  cursor: 'pointer',
                }}
                onClick={() => handleCardClick(index)}
              >
                <CardContent style={{ height: '100%', padding: '0' }}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: 'auto',
                      boxShadow: '0 0 0 1px #dadce0',
                      borderRadius: '8px',
                    }}
                  />
                  <h4
                    style={{
                      margin: '0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                      color: '#70757a',
                      font: '14px/20px Roboto-Regular,Helvetica Neue,Arial,sans-serif',
                    }}
                  >
                    {item.title}
                  </h4>
                </CardContent>
              </Card>
            ))}
          </div>
  </div>
);

export default GridNavigation;
