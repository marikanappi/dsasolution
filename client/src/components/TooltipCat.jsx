import { PiCat } from "react-icons/pi";

const TooltipCat = ({ tooltipModal, setTooltipModal }) => {
  return (
    <div className="tooltip-container">
      {/* Cat Icon */}
      <PiCat
        className="help-icon cat"
        style={{ cursor: "pointer", fontSize: "4rem" }}
        
      />

      {/* Dialog Box with Text Inside */}
      {tooltipModal.visible && (
        <div className="dialog-box">
          <img src="dialog_box.svg" alt="dialog" className="dialog-image" />
          <p className="dialog-text">{tooltipModal.text}</p>
          {/* <button
            className="btn btn-secondary close-btn"
            onClick={() => setTooltipModal({ visible: false, text: "" })}
          >
            Close
          </button> */}
        </div>
      )}
    </div>
  );
};

export default TooltipCat;
