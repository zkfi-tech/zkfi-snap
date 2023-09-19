import { FC } from 'react';
import { Button, StackProps, Text, VStack } from '@chakra-ui/react';
import { useSnap } from '../../contexts/snap-adapter';

const ConnectSnapButton: FC<StackProps> = ({ ...props }) => {
  const { isInstalled, snap } = useSnap();
  const handleConnect = () => {
    snap.connect();
  };

  return (
    <VStack {...props}>
      <Button variant="solid" onClick={handleConnect}>
        {isInstalled ? 'Connect to Snap' : 'Reconnect to Snap'}
      </Button>
      {/* {isInstalled && <Text>Connected to Snap</Text>} */}
    </VStack>
  );
};

export default ConnectSnapButton;
