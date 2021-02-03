import React from 'react';

import SelectorBox from './SelectorBox';

export default {
  title: 'Selector Box',
  component: SelectorBox,
};

const Template = args => (
  <SelectorBox {...args}>
    <SelectorBox.Display>Display</SelectorBox.Display>
    <SelectorBox.Collapse>Some more content</SelectorBox.Collapse>
  </SelectorBox>
);

export const Default = Template.bind({});
Default.args = {};
