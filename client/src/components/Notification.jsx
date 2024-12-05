import React, { useState } from 'react';

const NotificationsCard = ({ onCollapseChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapseChange(newCollapsedState);
  };

  return (
    <div className="card mb-5">
      <div
        className="card-header text-white"
        onClick={toggleCollapse}
        style={{ cursor: 'pointer' }}
      >
        Recent Notifications
      </div>
      {!isCollapsed && (
        <div className="card-body">
          <div className="notification d-flex justify-content-between align-items-center mb-2">
            <span>New Challenge Available</span>
            <span className="group-labels badge text-dark">Bioinformatics</span>
          </div>
          <div className="notification d-flex justify-content-between align-items-center mb-2">
            <span>New Challenge Available</span>
            <span className="group-labels badge text-dark">Advanced AI</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsCard;
