import React, { useEffect, useState } from "react";
import { getAllGroups } from "../../api"; // Import API
import "./../css/searchpage.css"; // File CSS per lo stile

const SearchGroup = ({ setGroup }) => {
  const [suggestedGroups, setSuggestedGroups] = useState([]);
  const [otherGroups, setOtherGroups] = useState([]);

  // Fetch dei gruppi
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const allGroups = await getAllGroups(); // Recupera tutti i gruppi
        const suggested = allGroups.filter(
          (group) => group.university === "Politecnico di Torino"
        );
        const others = allGroups.filter(
          (group) => group.university !== "Politecnico di Torino"
        );
        setSuggestedGroups(suggested);
        setOtherGroups(others);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="search-group-container">
      {/* Sezione Suggested for You */}
      <div className="suggested-groups-container">
        <h4>Suggested for You</h4>
        {suggestedGroups.length > 0 ? (
          <ul>
            {suggestedGroups.map((group) => (
              <li
                key={group.id}
                className="group-item"
                onClick={() => setGroup(group)}
              >
                <img
                  src={group.picture}
                  alt={`${group.name} Icon`}
                  className="group-icon"
                />
                <div>
                  <div className="group-name">{group.name}</div>
                  <div className="group-university">{group.university}</div>
                  <div className="group-level">{group.level}</div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No suggested groups found.</p>
        )}
      </div>

      {/* Sezione Other Groups */}
<div className="other-groups-container">
  <h4>Other Groups</h4>
  {otherGroups.length > 0 ? (
    <ul>
      {otherGroups.map((group) => (
        <li
          key={group.id}
          className="group-item"
          onClick={() => setGroup(group)}
        >
          <img
            src={group.picture}
            alt={`${group.name} Icon`}
            className="group-icon"
          />
          <div>
            <div className="group-name">{group.name}</div>
            <div className="group-university">{group.university}</div>
            <div className="group-level">{group.level}</div>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p>No other groups found.</p>
  )}
</div>

    </div>
  );
};

export default SearchGroup;
