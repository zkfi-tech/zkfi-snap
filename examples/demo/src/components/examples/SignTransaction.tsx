import { FC, useState } from 'react';
import { Box, Button, Divider, Heading, StackProps, Text, VStack } from '@chakra-ui/react';
import { useSnap } from '../../contexts/snap-adapter';
import { SignTransactionPayload } from '@zkfi-tech/snap-adapter';

const mockNotes: SignTransactionPayload = {
  in: [
    {
      assetId: 65537,
      value: '1500000000000000000',
      owner: '0x40329c992bb9d5fd23ff4b6aad47053641acdd819d9e07c1c9d81ce714cc3f1c',
    },
  ],
  out: [
    {
      assetId: 65537,
      value: '1000000000000000000',
      owner: '0x40329c992bb9d5fd23ff4b6aad47053641acdd819d9e07c1c9d81ce714cc3f1c',
    },
  ],
};

const SignTransaction: FC<StackProps> = ({ ...props }) => {
  const [sign, setSign] = useState('');
  const { snap } = useSnap();

  const handleSign = async () => {
    const signature = await snap.signTransaction(mockNotes);
    setSign(JSON.stringify(signature));
  };

  return (
    <VStack borderWidth={2} rounded="md" p={4} {...props}>
      <Heading fontSize="xl">Sign Transaction</Heading>
      <Box maxW="full">
        <Text mb="8px">Notes</Text>
        <Text fontSize="sm">{JSON.stringify(mockNotes.in, null, 2)}</Text>
        <Text fontSize="sm" py={2}>
          {JSON.stringify(mockNotes.out, null, 2)}
        </Text>
        <Button onClick={handleSign}>Sign</Button>
      </Box>
      <Divider />

      <Box maxW="full">
        <Text mb="8px">Signatures:</Text>
        <Text fontSize="sm">{sign}</Text>
      </Box>
    </VStack>
  );
};

export default SignTransaction;
