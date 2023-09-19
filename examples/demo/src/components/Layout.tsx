import { Box, HStack, StackProps, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import ConnectSnapButton from './examples/ConnectSnapButton';

const Layout: FC<StackProps> = ({ children, ...props }) => {
  return (
    <Box w="full" {...props}>
      <HStack
        justify="space-between"
        p={4}
        borderBottomColor="whiteAlpha.400"
        borderBottomWidth={1}
      >
        <Text>zkFi Snap</Text>
        <HStack spacing={4}>
          <ConnectSnapButton />
          <ColorModeSwitcher />
        </HStack>
      </HStack>
      <Box w="full">{children}</Box>
      <HStack justify="center" p={4}>
        zkFi
      </HStack>
    </Box>
  );
};

export default Layout;
