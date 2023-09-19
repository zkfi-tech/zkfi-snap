import { FC } from 'react';
import { StackProps, VStack } from '@chakra-ui/react';
import SignMessage from './SignMessage';
import SignTransaction from './SignTransaction';
import GetAccount from './GetAccount';

const SnapExamples: FC<StackProps> = () => {
  return (
    <VStack spacing={4} p={4}>
      <GetAccount maxW="md" />
      <SignMessage maxW="md" />
      <SignTransaction maxW="md" />
    </VStack>
  );
};

export default SnapExamples;
