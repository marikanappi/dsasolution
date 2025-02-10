import { PiCatBold } from "react-icons/pi";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "../css/toolTipCat.css";

const TooltipCat = ({ tooltipModal, setTooltipModal }) => {
  const [catVisible, setCatVisible] = useState(false);

  useEffect(() => {
    setCatVisible(true);
    setTooltipModal({
      visible: !tooltipModal.visible,
      text: "I will generate you a challenge! Click on cat icon wherever you need help.",
    });
  }, []);

  return (
    <div className="tooltip-container">
      {/* Animated Cat Icon */}
      <motion.div
        className="animated-cat"
        initial={{ y: 0, opacity: 0, scale: 0.5 }}
        animate={catVisible ? { y: 0, opacity: 1, scale: 1 } : {}}
        transition={{
          duration: 1,
          ease: "easeOut",
          type: "spring",
          stiffness: 100,
        }}
      >
        <PiCatBold
          className="cat"
          size={50}
          style={{ cursor: "pointer", fontSize: "2rem" }}
          onClick={() =>
            setTooltipModal({ visible: !tooltipModal.visible, text: "MUA!" })
          }
        />
      </motion.div>

      {/* Custom Animated Dialog Box */}
      {tooltipModal.visible && (
        <motion.div
          className="dialog-box"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="dialog-content">
            <p>{tooltipModal.text}</p>
          </div>
          <div className="dialog-tail"></div>
        </motion.div>
      )}
    </div>
  );
};

export default TooltipCat;
