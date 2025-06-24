import { useState } from 'react';
import { motion } from 'framer-motion';

const features = [
  { name: 'Dashboard Insight', icon: '📊' },
  { name: 'User Management', icon: '👥' },
  { name: 'Role/Permission', icon: '🔑' },
  // { name: 'Resource Management', icon: '📦' },
  { name: 'Content Management', icon: '🗂️' },
  { name: 'Content Editor', icon: '✏️' },
  { name: 'Verification Flow', icon: '✅' },
  { name: 'Logs', icon: '📝' },
  { name: 'Versions', icon: '🕒' },
  { name: 'Version Rollback', icon: '⏪' },
  { name: 'RBAC', icon: '🛡️' },
  { name: 'Notification', icon: '🔔' },
  { name: 'Audit Logger', icon: '📋' },
  { name: 'Email Info', icon: '✉️' },
  { name: 'Dark/Light Theme', icon: '🌗' },
  // { name: 'Actions', icon: '⚡' },
  { name: 'Edit History', icon: '📝' },
];

function TemplatePointers() {
  const [hovered, setHovered] = useState(null);
  // Responsive orbit radius based on screen size
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const orbitRadius = isMobile ? 110 : 180;
  const coreSize = isMobile ? 90 : 130;
  const featureSize = isMobile ? 60 : 100;
  const textSize = isMobile ? 7 : 10;

  return (
    <div
      className=" flex items-center justify-center rounded-xl px-2 py-2 h-[560px]"
      style={{ overflow: 'hidden' }}
    >
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl gap-8 md:gap-16">
        {/* Description Left */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 max-w-lg text-center md:text-left z-10"
        >
          <div className="text-3xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Shade CMS Engine
            </span>
          </div>
          <h2 className="text-xl font-semibold mb-2">Comprehensive CMS Features</h2>
          <p className="text-gray-600 dark:text-gray-400">
            A powerful engine that manages users, roles, resources, and content with real-time notifications, versioning, audit logs, and more.<br/>
            All components work together seamlessly to provide a robust content management experience.
          </p>
        </motion.div>

        {/* Animation Right */}
        <div className="flex-1 flex items-center justify-center w-full" style={{ minWidth: 320, minHeight: isMobile ? 320 : 400 }}>
          <div className="relative flex items-center justify-center w-full" style={{ height: isMobile ? 340 : 440, minHeight: isMobile ? 340 : 440 }}>
            {/* Animated Background Dots */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-blue-400 opacity-10"
                style={{
                  width: 30 + (i % 3) * 10,
                  height: 30 + (i % 3) * 10,
                  left: `calc(50% + ${Math.cos((i * 30) * Math.PI / 180) * (orbitRadius + 60)}px)`,
                  top: `calc(50% + ${Math.sin((i * 30) * Math.PI / 180) * (orbitRadius + 60)}px)`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1,
                }}
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 3 + i * 0.2, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}

            {/* Central Engine Core (Animated) */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.08, 1], opacity: 1, rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute left-1/2 top-1/2 z-20 "
              style={{ transform: 'translate(-50%, -50%)', width: coreSize, height: coreSize }}
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center w-full h-full">
                <div className="bg-white  rounded-full flex items-center justify-center" style={{ width: coreSize * 0.7, height: coreSize * 0.7 }}>
                  <span className="text-3xl">⚡</span>
                </div>
              </div>
            </motion.div>

            {/* Static Feature Cards in a Circle */}
            {features.map((feature, idx) => {
              const angle = (idx * 360) / features.length - 90; // Start from top
              const x = Math.cos((angle * Math.PI) / 180) * orbitRadius;
              const y = Math.sin((angle * Math.PI) / 180) * orbitRadius;
              const isHovered = hovered === idx;
              return (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  className="absolute"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    width: featureSize,
                    height: featureSize,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isHovered ? 99 : 20,
                  }}
                >
                  <motion.div
                    onMouseEnter={() => setHovered(idx)}
                    onMouseLeave={() => setHovered(null)}
                    animate={isHovered ? {
                      scale: 1.18,
                      boxShadow: '0 0 24px 6px #6366f1, 0 0 0 4px #fff',
                      filter: 'brightness(1.15)',
                      zIndex: 99,
                    } : {
                      scale: 1,
                      filter: 'none',
                      opacity: 1,
                      zIndex: 20,
                    }}
                    transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                    className="w-full h-full flex flex-col items-center justify-center rounded-xl shadow-md bg-white/80 dark:bg-gray-900/80 border border-blue-100 dark:border-gray-700 backdrop-blur-sm cursor-pointer select-none"
                    style={{
                      padding: 6,
                      minHeight: featureSize,
                      minWidth: featureSize,
                      textAlign: 'center',
                      overflow: 'hidden',
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span className="text-2xl mb-1">{feature.icon}</span>
                    <span
                      className="text-xs font-medium leading-tight"
                      style={{ fontSize: textSize, wordBreak: 'break-word', whiteSpace: 'normal', maxWidth: '90%' }}
                    >
                      {feature.name}
                    </span>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplatePointers;
