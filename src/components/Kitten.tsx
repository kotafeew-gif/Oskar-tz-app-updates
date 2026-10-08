import { useState, useRef, useCallback, useEffect } from "react";
import catGif from "../assets/Loader cat.gif";

const phrases = [
  "мяу!",
  "мурр...",
  "мряу?",
  "пррр ❤️",
  "Кто тут самый лучший менеджер?",
  "Хватит меня тыкать!",
  "Давай, работай!",
  "Скоро выходные!",
  "Где моя еда?",
  "Заявка сама себя не заполнит.",
  "Подумай о печатниках.",
  "🐾",
  "⭐",
  "мяу?",
  "тыц!",
  "привет!",
  "полетели!",
  "🚀",
  "Отправляй уже!",
  "Я всё вижу...",
  "Не забудь ламинацию!",
  "zzz...",
  "Опять работа?",
  "Покорми меня!",
];

export default function Kitten() {
  const [msg, setMsg] = useState(phrases[0]);
  const [pos, setPos] = useState({ x: window.innerWidth - 200, y: window.innerHeight - 240 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, origX: 0, origY: 0 });
  const draggingRef = useRef(false);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    draggingRef.current = true;
    setDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
    };
  }, [pos]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - 180, dragRef.current.origX + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 220, dragRef.current.origY + dy)),
      });
    };
    const onMouseUp = () => {
      draggingRef.current = false;
      setDragging(false);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const pet = () => setMsg(phrases[Math.floor(Math.random() * phrases.length)]);

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={pet}
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: 180,
        height: 220,
        zIndex: 9999,
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none",
        pointerEvents: "auto",
      }}
    >
      <div className="kitten-wrap" style={{ width: "100%", height: "100%" }}>
        <div style={{
          position: "absolute",
          top: -35,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
          borderRadius: 14,
          padding: "4px 12px",
          fontSize: 12,
          color: "#6366f1",
          whiteSpace: "nowrap",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          fontFamily: "system-ui, sans-serif",
          display: "none",
          maxWidth: "250px",
          textAlign: "center",
        }}
          className="kitten-bubble"
        >{msg}</div>
        <style>{`
          .kitten-wrap:hover .kitten-bubble { display: block !important; }
        `}</style>
        <img
          src={catGif}
          alt="котёнок"
          draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "contain", pointerEvents: "none" }}
        />
      </div>
    </div>
  );
}