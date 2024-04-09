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
  const [book, setBibleBook] = useState(1);
  const [chapter, setBookChapter] = useState(1);


  const renderPageComponent = () => {
    switch (page) {
      case pages.bible:
        return <BiblePage book={book} chap={chapter} setPage={setPage} />;
      case pages.bookSelect:
        return <Text>1</Text>;
      case pages.chapSelect:
        return <Text>2</Text>;
      case pages.resourceList:
        return <Text>3</Text>;
      case pages.resource:
        return <Text>4</Text>;
      case pages.download:
        return <DownloadPage />;
      default:
        return null;
    }
  };

  // back button
  useEffect(() => {
    const backAction = () => {
      //console.log(page);
      switch (page) {
        case pages.bible:
          return false;
        case pages.bookSelect:
          setPage(pages.bible);
          return true;
        case pages.chapSelect:
          setPage(pages.bookSelect);
          return true;
        case pages.resourceList:
          setPage(pages.bible);
          return true;
        case pages.resource:
          setPage(pages.resourceList);
          return true;
        case pages.download:
          setPage(pages.bible);
          return true;
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