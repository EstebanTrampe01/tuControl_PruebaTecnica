'use client';

import * as React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NumberStepperProps {
  id?: string;
  value: string | number;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
}

const getDecimalPlaces = (step: number) => {
  const stepText = step.toString();
  if (!stepText.includes('.')) return 0;
  return stepText.split('.')[1]?.length ?? 0;
};

export function NumberStepper({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled,
  className,
  inputClassName,
}: NumberStepperProps) {
  const decimalPlaces = React.useMemo(() => getDecimalPlaces(step), [step]);

  const clamp = (num: number) => {
    let next = num;
    if (min !== undefined) next = Math.max(min, next);
    if (max !== undefined) next = Math.min(max, next);
    return next;
  };

  const normalize = (num: number) => {
    const fixed = decimalPlaces > 0 ? Number(num.toFixed(decimalPlaces)) : Math.round(num);
    return String(fixed);
  };

  const adjust = (direction: -1 | 1) => {
    const parsed = Number.parseFloat(String(value));
    const current = Number.isFinite(parsed) ? parsed : min ?? 0;
    const next = clamp(current + direction * step);
    onChange(normalize(next));
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => adjust(-1)}
        disabled={disabled}
        aria-label="Disminuir valor"
      >
        <Minus className="h-4 w-4" />
      </Button>

      <Input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className={cn(
          'h-8 w-24 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          inputClassName,
        )}
      />

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => adjust(1)}
        disabled={disabled}
        aria-label="Aumentar valor"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
