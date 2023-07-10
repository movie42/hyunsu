"use client";

import React, { useEffect, useRef } from "react";
import { styled } from "styled-components";

const Canvas = () => {
  const containerRef = useRef<HTMLCanvasElement>(null);

  const handleDraw = () => {
    const canvas = containerRef.current;
    const position = { x: 60, y: 60 };
    const velocity = { x: 10, y: 10 };
    const rad = 30;
    if (!canvas) return;
    let innerWidth = canvas.width;
    let innerHeight = canvas.height;
    canvas.width = 1000;
    canvas.height = 500;

    const context = canvas.getContext("2d");

    if (!context) return;

    const draw = () => {
      context.fillStyle = "#0efccc";
      context.beginPath();
      context.arc(position.x, position.y, rad, 0, 2 * Math.PI);
      context.fill();
    };

    const update = () => {
      if (position.x + rad > innerWidth) {
        velocity.x = -velocity.x;
      }
      if (position.x - rad < 0) {
        velocity.x = -velocity.x;
      }
      if (position.y + rad > innerHeight || position.y - rad < 0) {
        velocity.y = -velocity.y;
      }

      position.x += velocity.x;
      position.y += velocity.y;
    };

    const animate = () => {
      requestAnimationFrame(animate);
      context.clearRect(0, 0, innerWidth, innerHeight);
      draw();
      update();
    };

    animate();
  };

  useEffect(() => {
    handleDraw();
  }, []);

  return (
    <Box>
      <Container ref={containerRef} />;
    </Box>
  );
};

export default Canvas;

const Container = styled.canvas`
  background-color: white;
`;

const Box = styled.div`
  width: 100%;
`;
