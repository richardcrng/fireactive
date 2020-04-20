import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

const DEFAULT_VALUES = [
  { label: 'JavaScript', value: 'js', },
  { label: 'TypeScript', value: 'ts', }
]

function JsTsTabs({ children, values = DEFAULT_VALUES }) {
  return (
    <Tabs
      groupId='js-ts-tabs'
      defaultValue="js"
      values={values}
    >
      {children}
    </Tabs>
  )
}

export function JsTab({ children }) {
  return (
    <TabItem value='js'>
      {children}
    </TabItem>
  )
}

export function TsTab({ children }) {
  return (
    <TabItem value='ts'>
      {children}
    </TabItem>
  )
}

JsTsTabs.Js = JsTab
JsTsTabs.Ts = TsTab

export default JsTsTabs