import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

export default function DatePickerWithRange({ className, onChange, start, end }) {
    // Function to add days to a given date
    const addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    // Function to format dates using native JavaScript
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short', // Short month name
            day: 'numeric', // Day of the month
            year: 'numeric', // Full year
        });
    };

    const [date, setDate] = useState(() => {
        const today = new Date();
        const startDate = start ? new Date(start) : today;
        const endDate = end ? new Date(end) : '';
        // const twentyDaysFromToday = new Date(today);
        // twentyDaysFromToday.setDate(today.getDate() + 10); // Add 10 days to today's date

        return {
            from: startDate || today,
            to: endDate || '',
        };
    });

    const handleDateSelect = (selectedDate) => {
        setDate(selectedDate); // Update local state
        if (onChange) {
            onChange(selectedDate); // Trigger the callback prop with the new date
        }
    };

    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={'outline'}
                        className={cn(
                            'w-full justify-start text-left font-normal h-12',
                            !date && 'text-muted-foreground',
                        )}
                    >
                        <CalendarIcon />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {formatDate(date.from)} - {formatDate(date.to)}
                                </>
                            ) : (
                                formatDate(date.from)
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleDateSelect}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
