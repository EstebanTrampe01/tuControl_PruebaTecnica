import * as React from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';
import {
  Button as UIButton,
} from '@/components/ui/button';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
    const variantMap = {
      primary: 'default',
      secondary: 'secondary',
      outline: 'outline',
      danger: 'destructive',
    } as const;

    return (
      <UIButton
        ref={ref}
        variant={variantMap[variant]}
        className={cn(className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Cargando...
          </>
        ) : (
          children
        )}
      </UIButton>
    );
  }
);
Button.displayName = 'Button';
