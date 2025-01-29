'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
    useReportWebVitals((metric) => {
        // Enviar para o Google Analytics
        if (window.gtag) {
            window.gtag('event', metric.name, {
                value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                event_label: metric.id,
                non_interaction: true,
                metric_value: metric.value,
                metric_delta: metric.delta,
                metric_rating: 'good',
            });
        }

        // Você também pode enviar para sua própria API de analytics
        // if (navigator.sendBeacon) {
        //   navigator.sendBeacon('/api/analytics', metric);
        // } else {
        //   fetch('/api/analytics', { body: JSON.stringify(metric), method: 'POST', keepalive: true });
        // }
    });

    return null;
}
