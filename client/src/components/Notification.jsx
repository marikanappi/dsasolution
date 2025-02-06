import { useState, useEffect } from "react";
import "./../css/homepage.css";

const Notifications = ({ notifications, setNotifications, groups }) => {
  const [swipeStyles, setSwipeStyles] = useState({});

  useEffect(() => {
    if (groups.length === 0 || notifications.length === 0) return;
  
    setNotifications((prev) =>
      prev.filter((notif) => groups.some((group) => group.id === notif.id))
    );
  }, [groups]);
  

  const handleTouchStart = (e, index) => {
    e.currentTarget.dataset.startX = e.touches[0].clientX;
  };

  const handleTouchMove = (e, index) => {
    const startX = parseFloat(e.currentTarget.dataset.startX);
    const moveX = e.touches[0].clientX;
    const deltaX = moveX - startX;

    setSwipeStyles((prev) => ({
      ...prev,
      [index]: {
        transform: `translateX(${deltaX}px)`,
        opacity: 1 - Math.abs(deltaX) / 100,
      },
    }));

    if (Math.abs(deltaX) > 80) {
      setSwipeStyles((prev) => ({
        ...prev,
        [index]: {
          transform: `translateX(${deltaX > 0 ? "100%" : "-100%"})`,
          opacity: 0,
        },
      }));

      setTimeout(() => {
        setNotifications((prev) => prev.filter((_, i) => i !== index));
      }, 300);
    }
  };

  const handleTouchEnd = (index) => {
    setSwipeStyles((prev) => ({
      ...prev,
      [index]: {
        transform: "translateX(0)",
        opacity: 1,
        transition: "transform 0.3s ease, opacity 0.3s ease",
      },
    }));
  };

  return (
    <div className="card-body">
      {notifications.length > 0 && (
        <div>
          {notifications.map((notif, index) => {
            const group = groups.find((group) => group.id === notif.id);
            return group ? (
              <div
                className="notification"
                key={index}
                onTouchStart={(e) => handleTouchStart(e, index)}
                onTouchMove={(e) => handleTouchMove(e, index)}
                onTouchEnd={() => handleTouchEnd(index)}
                style={swipeStyles[index] || {}}
              >
                <div className="notification-left">
                  <img
                    src={group.picture}
                    alt={group.name}
                    className="group-image"
                  />
                </div>
                <div className="notification-right">
                  <span className="notification-group-name">{group.name}</span>
                  <span className="notif-text">{notif.text}</span>
                </div>
              </div>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
