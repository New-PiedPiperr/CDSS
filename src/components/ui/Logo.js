import Image from 'next/image';
import { cn } from '@/lib/cn';

function Logo({ className, size = 'default', showText = true }) {
  const sizes = {
    sm: { image: 40, text: 'text-lg' },
    default: { image: 56, text: 'text-2xl' },
    lg: { image: 72, text: 'text-3xl' },
    xl: { image: 96, text: 'text-4xl' },
  };

  const { image, text } = sizes[size] || sizes.default;

  return (
    <div className={cn('flex flex-col items-center gap-2 transition-all', className)}>
      <div
        className="relative transition-all"
        style={{
          width: image,
          height: image,
          maxWidth: size === 'lg' || size === 'xl' ? '80vw' : '100%',
        }}
      >
        <Image
          src="/logo.png"
          alt="CDSS Logo"
          fill
          priority
          className={cn(
            'object-contain transition-all',
            size === 'lg' && 'scale-75 sm:scale-100',
            size === 'xl' && 'scale-50 sm:scale-100'
          )}
        />
      </div>
      {showText && (
        <span
          className={cn(
            'text-foreground font-semibold transition-all',
            text,
            size === 'lg' && 'text-xl sm:text-3xl',
            size === 'xl' && 'text-2xl sm:text-4xl'
          )}
        >
          CDSS
        </span>
      )}
    </div>
  );
}

export { Logo };
