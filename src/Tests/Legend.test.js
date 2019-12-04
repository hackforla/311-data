import React from 'react';
import Enzyme, {shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({adapter: new Adapter()});

describe('Tree map legend component test suite', () => {
  test('Ensure jest is working', () => {
    expect(true).toEqual(true);
  });

  // test('renders', () => {
  //   const wrapper = shallow(<Legend />);
  //   expect(wrapper.exists()).toBe(true);
  // });
});
