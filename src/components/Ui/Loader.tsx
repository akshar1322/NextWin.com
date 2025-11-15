"use client";
import React from "react";
import styled from "styled-components";

interface LoaderProps {
  words?: string[]; // ✅ dynamic words for the animation
  message?: string; // optional message (default: "Loading")
}

const Loader: React.FC<LoaderProps> = ({
  words = ["products", "details", "images", "reviews", "data"],
  message = "Loading",
}) => {
  return (
    <StyledWrapper>
      <div className="spinnerContainer">
        <div className="spinner" />
        <div className="loader">
          <p>{message}</p>
          <div className="words">
            {words.concat(words[0]).map((word, index) => (
              <span key={index} className="word">
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f5f5f5;
  width: 100%;

  .spinnerContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .spinner {
    width: 56px;
    height: 56px;
    display: grid;
    border: 4px solid #0000;
    border-radius: 50%;
    border-right-color: #299fff;
    animation: tri-spinner 1s infinite linear;
  }

  .spinner::before,
  .spinner::after {
    content: "";
    grid-area: 1/1;
    margin: 2px;
    border: inherit;
    border-radius: 50%;
    animation: tri-spinner 2s infinite;
  }

  .spinner::after {
    margin: 8px;
    animation-duration: 3s;
  }

  @keyframes tri-spinner {
    100% {
      transform: rotate(1turn);
    }
  }

  .loader {
    color: #4a4a4a;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    font-size: 25px;
    box-sizing: content-box;
    height: 40px;
    padding: 10px 10px;
    display: flex;
    border-radius: 8px;
  }

  .words {
    overflow: hidden;
  }

  .word {
    display: block;
    height: 100%;
    padding-left: 6px;
    color: #299fff;
    animation: cycle-words 5s infinite;
  }

  @keyframes cycle-words {
    10% {
      transform: translateY(-105%);
    }

    25% {
      transform: translateY(-100%);
    }

    35% {
      transform: translateY(-205%);
    }

    50% {
      transform: translateY(-200%);
    }

    60% {
      transform: translateY(-305%);
    }

    75% {
      transform: translateY(-300%);
    }

    85% {
      transform: translateY(-405%);
    }

    100% {
      transform: translateY(-400%);
    }
  }
`;

export default Loader;
