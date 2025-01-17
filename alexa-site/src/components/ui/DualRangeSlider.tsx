import React from 'react';
import { cn } from '@/lib/utils';

const DualRangeSlider = ({
    label,
    value,
    onChange,
    min,
    max,
    step,
    className,
}: {
    label: string;
    value: [number, number];
    onChange: (value: [number, number]) => void;
    min: number;
    max: number;
    step: number;
    className?: string;
}) => {
    const [isDragging, setIsDragging] = React.useState<'min' | 'max' | null>(null);
    const sliderRef = React.useRef<HTMLDivElement>(null);

    const getPercentage = (value: number) => ((value - min) / (max - min)) * 100;
    const minThumbPosition = getPercentage(value[0]);
    const maxThumbPosition = getPercentage(value[1]);

    const handleMouseMove = React.useCallback(
        (event: MouseEvent) => {
            if (!isDragging || !sliderRef.current) return;

            const rect = sliderRef.current.getBoundingClientRect();
            const percentage = Math.min(Math.max(0, ((event.clientX - rect.left) / rect.width) * 100), 100);
            const newValue = min + ((max - min) * percentage) / 100;
            const roundedValue = Math.round(newValue / step) * step;

            if (isDragging === 'min') {
                const newMinValue = Math.min(roundedValue, value[1] - step);
                onChange([Math.max(min, newMinValue), value[1]]);
            } else {
                const newMaxValue = Math.max(roundedValue, value[0] + step);
                onChange([value[0], Math.min(max, newMaxValue)]);
            }
        },
        [isDragging, min, max, step, value, onChange],
    );

    const handleMouseUp = React.useCallback(() => {
        setIsDragging(null);
    }, []);

    React.useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return (
        <div className="flex flex-col gap-2">
            <div className="text-sm font-medium">
                { label }: { value[0] } - { value[1] }
            </div>
            <div
                ref={ sliderRef }
                className={ cn(
                    'relative w-full h-2 bg-secondary rounded-full cursor-pointer',
                    className,
                ) }
                onClick={ (e) => {
                    if (isDragging) return;
                    const rect = sliderRef.current?.getBoundingClientRect();
                    if (!rect) return;
                    const percentage = ((e.clientX - rect.left) / rect.width) * 100;
                    const clickedValue = min + ((max - min) * percentage) / 100;
                    const roundedValue = Math.round(clickedValue / step) * step;
                    
                    // Decide which thumb to move based on which is closer
                    const distToMin = Math.abs(value[0] - roundedValue);
                    const distToMax = Math.abs(value[1] - roundedValue);
                    if (distToMin <= distToMax) {
                        onChange([roundedValue, value[1]]);
                    } else {
                        onChange([value[0], roundedValue]);
                    }
                } }
            >
                { /* Track fill */ }
                <div
                    className="absolute h-full bg-primary rounded-full"
                    style={ {
                        left: `${minThumbPosition}%`,
                        right: `${100 - maxThumbPosition}%`,
                    } }
                />
                
                { /* Min thumb */ }
                <div
                    className="absolute w-4 h-4 -mt-1 -ml-2 bg-primary rounded-full shadow-md hover:shadow-lg transition-shadow"
                    style={ { left: `${minThumbPosition}%` } }
                    onMouseDown={ () => setIsDragging('min') }
                />
                
                { /* Max thumb */ }
                <div
                    className="absolute w-4 h-4 -mt-1 -ml-2 bg-primary rounded-full shadow-md hover:shadow-lg transition-shadow"
                    style={ { left: `${maxThumbPosition}%` } }
                    onMouseDown={ () => setIsDragging('max') }
                />
            </div>
        </div>
    );
};

export default DualRangeSlider;