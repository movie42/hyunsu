"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";

const getIntersectionObserver = (setState: Dispatch<SetStateAction<string>>, isManuallyChangedRef: React.RefObject<boolean>) => {
  let direction = "";
  let prevYposition = 0;

  const checkScrollDirection = (prevY: number) => {
    if (window.scrollY === 0 && prevY === 0) return;
    else if (window.scrollY > prevY) direction = "down";
    else direction = "up";

    prevYposition = window.scrollY ?? 0;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      if (isManuallyChangedRef.current) {
        // 수동 변경 직후에는 observer의 상태 변경을 무시
        return;
      }

      entries.forEach((entry) => {
        checkScrollDirection(prevYposition);
        if ((direction === "down" && !entry.isIntersecting) || (direction === "up" && entry.isIntersecting)) {
          setState(entry.target.id);
        }
      });
    },
    { threshold: 0.4 }
  );
  return observer;
};

const TOC = () => {
  const [currentId, setCurrentId] = useState<string>("");
  const [toc, setToc] = useState<{ id: string; text: string | null; level: number }[]>([]);
  const isManuallyChangedRef = useRef(false);

  useEffect(() => {
    const observer = getIntersectionObserver(setCurrentId, isManuallyChangedRef);

    const headings = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5")).slice(1);

    const tocItems = headings.map((heading) => ({
      id: heading.id,
      text: heading.textContent,
      level: parseInt(heading.tagName.substring(1))
    }));

    setToc(tocItems);

    headings.map((header) => {
      observer.observe(header);
    });
  }, []);

  const handleManualSelection = (id: string) => {
    isManuallyChangedRef.current = true;
    setCurrentId(id);

    // 일정 시간 후에 플래그를 다시 false로 설정
    setTimeout(() => {
      isManuallyChangedRef.current = false;
    }, 100); // 적절한 시간을 설정하세요. 필요에 따라 조정 가능합니다.
  };

  return (
    <Nav className="toc">
      <ul>
        {toc.map((item, index) => {
          return (
            <ListItem
              key={`${item.id}-${index}`}
              level={item.level}
              onClick={() => handleManualSelection(item.id)}
            >
              <StyledLink
                isSelected={currentId === item.id}
                href={`#${item.id}`}
              >
                {item.text}
              </StyledLink>
            </ListItem>
          );
        })}
      </ul>
    </Nav>
  );
};

export default TOC;

const Nav = styled.nav`
  position: fixed;
  top: 7rem;
  right: calc((100vw - 1080px) / 2 - 320px);
  max-width: 300px;
  ul {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }
`;

const ListItem = styled.div<{ level: number }>`
  margin-left: ${({ level }) => `${(level - 1) * 1.2}rem`};
`;

const StyledLink = styled.a<{ isSelected: boolean }>`
  font-size: 1.4rem;
  padding: 0.5rem;
  ${({ theme, isSelected }) => {
    return css`
      background-color: ${isSelected ? theme.hlColor2 : "unset"};
      color: ${isSelected ? "white" : theme.grayColor_dark};
    `;
  }}
`;
