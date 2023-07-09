"use client";

import React, { SyntheticEvent } from "react";
import { styled } from "styled-components";

const Canvas = () => {
  const handleDraw = (event: SyntheticEvent<HTMLCanvasElement, Event>) => {
    console.log("hihi");
    const context = event.currentTarget.getContext("2d");
    if (!context) return;
    context.beginPath();
    context.moveTo(75, 50);
    context.lineTo(100, 75);
    context.lineTo(100, 25);
    context.fill();
  };

  return <Container onLoad={handleDraw} />;
};

export default Canvas;

const Container = styled.canvas`
  background-color: white;
`;
