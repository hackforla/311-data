import React from 'react';

import DatePicker from './DatePicker';

export default {
  title: 'Date Picker',
  component: DatePicker,
};

const Template = args => <DatePicker {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
