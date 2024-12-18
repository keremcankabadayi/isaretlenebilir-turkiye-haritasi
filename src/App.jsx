import React from 'react';
import styled from 'styled-components';
import Map from './components/Map';

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

function App() {
  return (
    <Container>
      <Map />
    </Container>
  );
}

export default App; 