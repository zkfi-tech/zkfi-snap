import { FC, useState } from 'react';
import { Box, Button, Divider, Heading, Input, StackProps, Text, VStack } from '@chakra-ui/react';
import { useSnap } from '../../contexts/snap-adapter';

const SignMessage: FC<StackProps> = ({ ...props }) => {
  const [message, setMessage] = useState('0xabcd123');
  const [sign, setSign] = useState('');
  const { snap } = useSnap();

  const handleChange = (event: any) => setMessage(event.target.value);

  const handleSign = async () => {
    let msg;
    try {
      msg = '0x' + BigInt(message).toString(16);
    } catch (error) {
      console.error(error);
      alert('Invalid hex value message');
      return;
    }
    const signature = await snap.signMessage(msg);
    setSign(JSON.stringify(signature));
  };

  return (
    <VStack borderWidth={2} rounded="md" p={4} {...props}>
      <Heading fontSize="xl">Sign Message</Heading>
      <Box>
        <Text>Hex Value</Text>
        <Input
          value={message}
          onChange={handleChange}
          placeholder="Here is a sample placeholder"
          size="sm"
          my={3}
        />
        <Button onClick={handleSign}>Sign</Button>
      </Box>
      <Divider />

      <Box maxW="full">
        <Text mb="8px">Signature:</Text>
        <Text fontSize="sm">{sign}</Text>
      </Box>
    </VStack>
  );
};

export default SignMessage;
