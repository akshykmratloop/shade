import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ModalPortal = ({ children, show, onClose, className = '', childClassName = '' }) => {
  const [mounted, setMounted] = useState(false);
  const [el] = useState(() => (typeof document !== 'undefined' ? document.createElement('div') : null));

  useEffect(() => {
    if (!el) return;
    
    const modalRoot = document.getElementById('modal-root');
    if (modalRoot) {
      modalRoot.appendChild(el);
      setMounted(true);
    }
    
    return () => {
      if (modalRoot) {
        modalRoot.removeChild(el);
      }
    };
  }, [el]);

  if (!mounted || !el) return null;

  return createPortal(
    <AnimatePresence>
      {true && (
        <motion.div
          className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000] ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`bg-white p-[30px_20px] rounded-[10px] max-w-[960px] max-h-[80vh] h-auto overflow-y-auto w-full relative shadow-[0_2px_10px_rgba(0,0,0,0.1)] mx-[20px] ${childClassName}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    el
  );
};

export default ModalPortal;