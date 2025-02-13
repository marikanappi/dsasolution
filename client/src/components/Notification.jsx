import React, { useEffect, useState, useRef } from 'react';
import { FaBell, FaTimes, FaTrash } from 'react-icons/fa';

const NotificationSystem = ({ notifications, setNotifications, groups }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [animatedNotifications, setAnimatedNotifications] = useState([]);
  const [bellShake, setBellShake] = useState(false); // State for bell animation

  const notificationPanelRef = useRef(null);
  const notificationOverlayRef = useRef(null);

  useEffect(() => {
    if (groups && notifications) {
      const formattedNotifications = notifications.map(notification => {
        const group = groups.find(g => g.id === notification.groupId);
        return {
          ...notification,
          groupInfo: group || null,
          isNew: true
        };
      }).filter(notification => notification.groupInfo !== null);

      setAnimatedNotifications(formattedNotifications);

      // Trigger bell shake if there are new notifications
      if (formattedNotifications.some(n => n.isNew)) {
        setBellShake(true);
        // Reset the shake animation after a delay (e.g., 3 seconds)
        setTimeout(() => {
          setBellShake(false);
        }, 3000); // Adjust delay as needed
      }
    }
  }, [notifications, groups]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationOverlayRef.current && notificationOverlayRef.current === event.target) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setAnimatedNotifications(prev =>
        prev.map(notif => ({ ...notif, isNew: false }))
      );
    }
  };

  const removeNotification = (id) => {
    setAnimatedNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setAnimatedNotifications([]);
    setNotifications([]);
  };

  return (
    <div className="notification-system">
      <div className="notification-bell-container" onClick={toggleNotifications}>
        <FaBell
          className={`notification-bell ${bellShake ? 'has-new' : ''}`} // Apply animation class conditionally
        />
        {animatedNotifications.length > 0 && (
          <span className="notification-count">{animatedNotifications.length}</span>
        )}
      </div>

      {showNotifications && (
        <div className="notification-overlay" ref={notificationOverlayRef}> {/* Added ref here */}
          <div className="notification-panel" ref={notificationPanelRef}>
            <div className="notification-header">
              <h6>Notifications</h6>
              {animatedNotifications.length > 0 && (
                <button className="clear-all" onClick={clearAllNotifications}>
                  <FaTrash />
                </button>
              )}
            </div>

            <div className="notification-list">
              {animatedNotifications.length > 0 ? (
                animatedNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`notification-item ${notification.isNew ? 'new' : ''}`}
                  >
                    {notification.groupInfo && (
                      <img
                        src={notification.groupInfo.picture}
                        alt={notification.groupInfo.name}
                        className="group-icon"
                      />
                    )}
                    <div className="notification-content">
                      <div className="notification-message">
                        {notification.message}
                      </div>
                    </div>
                    <button
                      className="delete-notification"
                      onClick={() => removeNotification(notification.id)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))
              ) : (
                <div className="no-notifications">
                  No notifications
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;

