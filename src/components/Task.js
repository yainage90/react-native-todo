import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import IconButton from './IconButton';
import { images } from '../images';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.itemBackground};
  border-radius: 10px;
  padding: 5px;
  margin: 3px 0px;
`;

const Contents = styled.Text`
  flex: 1;
  font-size: 24px;
  color: ${({ theme, completed }) => (completed ? theme.done : theme.text)};
  text-decoration-line: ${({ completed }) =>
    completed ? 'line-through' : 'none'};
`;

const Task = ({ text, completed, deleteTask, updateTask, toggleTask }) => {
  return (
    <Container>
      <IconButton
        type={completed ? images.completed : images.uncompleted}
        onPressOut={toggleTask}
        completed={completed}
      />
      <Contents completed={completed}>{text}</Contents>
      {!completed && (
        <IconButton
          type={images.update}
          onPressOut={updateTask}
          completed={completed}
        />
      )}
      <IconButton
        type={images.delete}
        onPressOut={deleteTask}
        completed={completed}
      />
    </Container>
  );
};

Task.propTypes = {
  text: PropTypes.string.isRequired,
  deleteTask: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  toggleTask: PropTypes.func.isRequired,
};

export default Task;
