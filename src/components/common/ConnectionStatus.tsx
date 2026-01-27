// src/components/common/ConnectionStatus.tsx
import React from 'react';
import { Wifi, WifiOff, Loader } from 'lucide-react';

interface ConnectionStatusProps {
    status: 'checking' | 'connected' | 'disconnected';
    className?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status, className = '' }) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'checking':
                return {
                    icon: <Loader className="h-4 w-4 animate-spin" />,
                    text: 'Checking connection...',
                    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
                    textColor: 'text-yellow-800 dark:text-yellow-300',
                    borderColor: 'border-yellow-300 dark:border-yellow-700',
                };
            case 'connected':
                return {
                    icon: <Wifi className="h-4 w-4" />,
                    text: 'Connected to API',
                    bgColor: 'bg-green-100 dark:bg-green-900/30',
                    textColor: 'text-green-800 dark:text-green-300',
                    borderColor: 'border-green-300 dark:border-green-700',
                };
            case 'disconnected':
                return {
                    icon: <WifiOff className="h-4 w-4" />,
                    text: 'API connection failed',
                    bgColor: 'bg-red-100 dark:bg-red-900/30',
                    textColor: 'text-red-800 dark:text-red-300',
                    borderColor: 'border-red-300 dark:border-red-700',
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div className={`${className} flex items-center`}>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
                {config.icon}
                <span>{config.text}</span>
            </div>
        </div>
    );
};

export default ConnectionStatus;