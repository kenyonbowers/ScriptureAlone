import React, { useEffect, useState } from 'react'
import { BackHandler, Alert, Text } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BiblePage from './src/pages/bible.js'
import DownloadPage from './src/pages/download.js'

const App = () => {
  const pages = {
    bible: 1,
    bookSelect: 2,
    chapSelect: 3,
    resourceList: 4,
    resource: 5,
    download: 6
  };
  const [page, setPage] = useState(pages.bible);
  const [book, setBibleBook] = useState(2);
  const [chapter, setBookChapter] = useState(6);
  const [stack, setStack] = useState([[1, 2, 3, 4], 2, 3, 4]);
  /*
    [1 // Book //, 2 // Chapter //, 3 // Verse Start //, 4 // Verse End //]
    2-6 
  */
  const [backButtonDisabled, setBackButtonDisabled] = useState(false);

  const setPageStack = (newPage, currentPage) => {
    stack.push(currentPage);
    console.log(stack);
    setPage(newPage)
  }

  const renderPageComponent = () => {
    switch (page) {
      case pages.bible:
        return <BiblePage book={book} chap={chapter} setBook={setBibleBook} setChap={setBookChapter} setPage={setPageStack} />;
      case pages.bookSelect:
        return <Text>1</Text>;
      case pages.chapSelect:
        return <Text>2</Text>;
      case pages.resourceList:
        return <Text>3</Text>;
      case pages.resource:
        return <Text>4</Text>;
      case pages.download:
        return <DownloadPage backButtonDisabled={setBackButtonDisabled} />;
      default:
        return null;
    }
  };

  // back button
  useEffect(() => {
    const backAction = () => {
      console.log(stack);
      if (!backButtonDisabled)
        if (!stack[0]) {
          return false;
        }
        else {
          if (Array.isArray(stack[stack.length - 1])) {
            setBibleBook(stack[stack.length - 1][0]);
            setBookChapter(stack[stack.length - 1][1]);
            setPage(pages.bible);
            stack.pop();
            return true;
          }
          else {
            console.log("Stack: ", stack)
            switch (stack[stack.length - 1]) {
              case pages.bookSelect:
                setPage(pages.bookSelect);
                stack.pop();
                return true;
              case pages.chapSelect:
                setPage(pages.chapSelect);
                stack.pop();
                return true;
              case pages.resourceList:
                setPage(pages.resourceList);
                stack.pop();
                return true;
              case pages.resource:
                setPage(pages.resource);
                stack.pop();
                return true;
              case pages.download:
                setPage(pages.download);
                stack.pop();
                return true;
            }
          }
        }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [page]); // Add 'page' as a dependency

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ paddingHorizontal: 15 }}>
        {renderPageComponent()}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;