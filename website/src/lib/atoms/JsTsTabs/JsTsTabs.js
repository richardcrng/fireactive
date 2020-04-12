import React from 'react';
import Tabs from '@theme/Tabs';

function JsTsTabs({ children }) {
  return (
    <Tabs
      defaultValue="js"
      values={[
        { label: 'JavaScript', value: 'js', },
        { label: 'TypeScript', value: 'ts', }
      ]}
    >
      {children}
    </Tabs>
  )
}

export default JsTsTabs