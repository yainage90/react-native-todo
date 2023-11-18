import React from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { images } from '../images';

const Icon = styled.Image`
  tint-color: ${({ theme, completed }) =>
    completed ? theme.done : theme.text};
  width: 30px;
  height: 30px;
`;

const IconButton = ({ type, onPressOut, completed }) => {
  return (
    <Pressable onPressOut={onPressOut} hitSlop={0}>
      <Icon source={type} completed={completed} />
    </Pressable>
  );
};

IconButton.propTypes = {
  type: PropTypes.oneOf(Object.values(images)).isRequired,
  onPressOut: PropTypes.func,
  completed: PropTypes.bool,
};

export default IconButton;
