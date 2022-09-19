import React from 'react';
import './App.css';
import { Container, Box, Typography } from '@mui/material';
import IOSUtil from './IOSUtil';

function App() {
  const [number1, setNumber1] = React.useState<number>(0);
  React.useEffect(() => {
    const f = async () => {
      const iost = IOSUtil.getInstance();
      await iost.init();
      const number1 = await iost.getNumber1();
      console.log(`number1: ${number1}`);
      setNumber1(number1);
    };
    f();
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {number1.toString()}
        </Typography>
      </Box>
    </Container>
  );
}

export default App;
