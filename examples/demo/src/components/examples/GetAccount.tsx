import { FC, useState } from 'react';
import { Box, Button, Checkbox, StackProps, Text, VStack } from '@chakra-ui/react';
import { useSnap } from '../../contexts/snap-adapter';

const GetAccount: FC<StackProps> = ({ ...props }) => {
  const { snap } = useSnap();
  const [account, setAccount] = useState<string>('');
  const [reqViewKey, setReqViewKey] = useState<boolean>(true);

  const handleSwitchReq = () => {
    setReqViewKey(!reqViewKey);
  };

  const handleGet = async () => {
    const data = await snap.getAccount(reqViewKey);
    setAccount(JSON.stringify(data));
  };

  return (
    <VStack borderWidth={2} rounded="md" p={4} {...props}>
      <Button variant="solid" onClick={handleGet}>
        Get Account
      </Button>
      <Checkbox isChecked={reqViewKey} onChange={handleSwitchReq}>
        Request View Key
      </Checkbox>
      <Box w="full">
        <Text>Account:</Text>
        <Text fontSize="sm">{account}</Text>
      </Box>
    </VStack>
  );
};

export default GetAccount;
