import React from 'react';
import { motion } from 'framer-motion';

const Reveal = ({ children, width = "fit-content", delay = 0.2, duration = 0.5 }) => {
    return (
        <div style={{ position: "relative", width, overflow: "hidden" }}>
            <motion.div
                initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                viewport={{ once: true }}
                transition={{
                    duration: duration,
                    delay: delay,
                    ease: "easeOut"
                }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default Reveal;
