import { chakra, ImageProps, forwardRef } from '@chakra-ui/react';

export const Logo = forwardRef<ImageProps, 'img'>((props, ref) => {
  return <chakra.img src="/logo.svg" ref={ref} boxSize={14} {...props} />;
});
