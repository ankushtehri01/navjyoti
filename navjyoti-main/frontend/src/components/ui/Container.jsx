import { cn } from '@/utils/cn.js';

/** Centered, max-width, responsive horizontal-padding wrapper. */
const SIZES = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
};

const Container = ({ as: Component = 'div', size = 'xl', className, children, ...props }) => (
  <Component className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', SIZES[size], className)} {...props}>
    {children}
  </Component>
);

export default Container;
