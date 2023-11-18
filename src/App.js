import React, { useState, useEffect, useCallback } from 'react';
import { Dimensions, StatusBar, Keyboard } from 'react-native';
import styled, { ThemeProvider } from 'styled-components/native';
import { theme } from './theme';
import Input from './components/Input';
import Task from './components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  align-items: center;
  justify-content: flex-start;
`;

const Title = styled.Text`
  font-size: 40px;
  font-weight: 600;
  color: ${({ theme }) => theme.main};
  align-self: flex-start;
  margin: 0px 20px;
`;

const List = styled.ScrollView`
  flex: 1;
  width: ${({ width }) => width - 40}px;
`;

export default App = () => {
  const width = Dimensions.get('window').width;
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState({});
  const [editingId, setEditingId] = useState();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    prepare = async () => {
      try {
        const loadedTasks = await AsyncStorage.getItem('tasks');
        setTasks(JSON.parse(loadedTasks || '{}'));
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    };
    prepare();
  }, [tasks]);

  const addTask = () => {
    if (editingId) {
      const currentTasks = Object.assign({}, tasks);
      currentTasks[editingId].text = newTask;
      saveTasks(currentTasks);
    } else {
      const id = Date.now().toString();
      const newTaskObject = {
        [id]: { id: id, text: newTask, completed: false },
      };
      saveTasks({ ...tasks, ...newTaskObject });
    }
    setNewTask('');
    setEditingId(null);
  };

  const saveTasks = async tasks => {
    try {
      setTasks(tasks);
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteTask = id => {
    const currentTasks = Object.assign({}, tasks);
    delete currentTasks[id];
    saveTasks(currentTasks);
  };

  const toggleTask = id => {
    const currentTasks = Object.assign({}, tasks);
    currentTasks[id].completed = !currentTasks[id].completed;
    saveTasks(currentTasks);
  };

  const updateTask = id => {
    setNewTask(tasks[id].text);
    setEditingId(id);
  };

  const cancelUpdate = () => {
    setNewTask('');
    setEditingId(null);
    Keyboard.dismiss();
  };

  const handleTextChange = text => {
    setNewTask(text);
  };

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container onLayout={onLayoutRootView}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.background}
        />
        <Title>TODO List</Title>
        <Input
          placeholder="+ Add a task"
          value={newTask}
          onChangeText={handleTextChange}
          onSubmitEditing={addTask}
          onBlur={cancelUpdate}
        />
        <List width={width}>
          {!editingId &&
            Object.values(tasks)
              .reverse()
              .map(item => (
                <Task
                  key={item.id}
                  text={item.text}
                  deleteTask={() => {
                    deleteTask(item.id);
                  }}
                  updateTask={() => {
                    updateTask(item.id);
                  }}
                  completed={item.completed}
                  toggleTask={() => {
                    toggleTask(item.id);
                  }}
                />
              ))}
        </List>
      </Container>
    </ThemeProvider>
  );
};
