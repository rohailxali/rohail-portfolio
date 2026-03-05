'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import servicesData from '@/data/services.json';

const iconMap: Record<string, string> = {
    chart: '📊',
    code: '💻',
    ai: '🤖',
    cloud: '☁️',
};

export default function Services() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <section id="services" className="mt-24" ref={ref}>
            <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                className="font-heading font-bold text-4xl text-white mb-12"
            >
                Services
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {servicesData.map((service, index) => (
                    <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ translateY: -6, borderColor: 'rgba(255,90,42,0.4)' }}
                        className="bg-noir-card rounded-2xl p-6 flex flex-col gap-3 border border-transparent hover:border-accent-orange-dim transition-all duration-400 cursor-pointer group"
                    >
                        {/* Numbered Badge */}
                        <div className="flex items-start justify-between mb-2">
                            <div className="bg-accent-orange text-black font-semibold rounded px-3 py-1 text-sm">
                                {service.id}
                            </div>
                            <div className="text-2xl">{iconMap[service.icon] || '🔧'}</div>
                        </div>

                        <h4 className="font-heading font-bold text-xl text-white group-hover:text-accent-orange transition-colors">
                            {service.title}
                        </h4>

                        <p className="text-noir-muted text-sm leading-relaxed line-clamp-3">
                            {service.description}
                        </p>

                        <div className="mt-auto flex justify-end">
                            <span className="text-accent-orange text-xl group-hover:translate-x-1 transition-transform">
                                →
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
