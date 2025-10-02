import React from 'react';

interface SectionCardProps {
    title: string;
    // Fix: Changed JSX.Element to React.ReactNode to resolve the 'Cannot find namespace JSX' error. This ensures the type is derived from the imported React module.
    icon: React.ReactNode;
    children: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon, children, actions, className = '', style }) => (
    <div className={`bg-brand-secondary rounded-xl shadow-lg overflow-hidden animate-slide-in-up ${className}`} style={style}>
        <div className="p-6">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <div className="flex items-center">
                    <div className="text-brand-primary mr-3">{icon}</div>
                    <h2 className="text-2xl font-bold text-brand-light">{title}</h2>
                </div>
                {actions && <div>{actions}</div>}
            </div>
            <div className="text-gray-300 leading-relaxed">
                {children}
            </div>
        </div>
    </div>
);

export default SectionCard;