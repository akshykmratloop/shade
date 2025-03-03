'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './modal_portal.module.scss'; // SCSS for custom styling

const ModalPortal = ({ children, show, onClose, className, childClassName }) => {
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
      {show && (
        <motion.div
          className={`${styles.modalOverlay} ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`${styles.modalContent} ${childClassName}`}
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
