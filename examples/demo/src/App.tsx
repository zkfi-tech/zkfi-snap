import { ChakraProvider, theme } from '@chakra-ui/react';
import { SnapProvider } from './contexts/snap-adapter';
import { Layout, SnapExamples } from './components';

export const App = () => (
  <ChakraProvider theme={theme}>
    <SnapProvider>
      <Layout>
        <SnapExamples />
      </Layout>
    </SnapProvider>
  </ChakraProvider>
);
