
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import type { JSX } from "react";
import { toast } from "sonner";

interface NotificationOptions {
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

const notificationIcons: Record<NotificationOptions['type'], { icon: JSX.Element; color: string }> = {
    success: { icon: <CheckCircle className="w-5 h-5 mr-2" />, color: "green" },
    error: { icon: <XCircle className="w-5 h-5 mr-2" />, color: "red" },
    warning: { icon: <AlertTriangle className="w-5 h-5 mr-2" />, color: "yellow" },
    info: { icon: <Info className="w-5 h-5 mr-2" />, color: "blue" }
};

export function showNotification(type: 'success' | 'error' | 'warning' | 'info',  message: string) {
    const { icon, color } = notificationIcons[type];

    toast(
        <div className={`flex items-center text-${color}-500`}>
            {icon}
            {message}
        </div>,
        {
            className: `bg-${color}-100 border border-${color}-500`,
            icon: null
        }
    );
} 
