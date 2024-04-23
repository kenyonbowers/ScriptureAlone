import React, { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { View, ScrollView, StyleSheet, Switch, TouchableOpacity, Text, Modal, Pressable } from "react-native";

import DualSwitcher from '../bibleComponents/dualSwitcher.js'

import BibleBookData from '../resources/bibleBookData.json'


const BiblePage = ({ book, chap, setBook, setChap, setPage }) => {
    const [isBibleDownloaded, setIsBibleDownloaded] = useState(0);

    const [isDualView, setDualView] = useState(true);
    const toggleDualView = () => setDualView(!isDualView);
    const [primaryVerData, setPrimaryVerData] = useState(null);
    const [secondaryVerData, setSecondaryVerData] = useState(null);

    const checkForBibleFolder = async () => {
        const mainDir = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
        if (mainDir.includes("Bibles")) {
            bibleDir = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "Bibles/KJB1900/GEN");
            return bibleDir;
        }
        else
            return [];
    }

    useEffect(() => {
        const checkForBibleData = async () => {
            const content = await checkForBibleFolder();
            setIsBibleDownloaded(content.length == 0 ? 2 : 1);
        };

        console.log("Book:", book, "| Chapter:", chap);

        checkForBibleData();
    }, [])

    const getChapter = async () => {
        try {
            // Primary Version
            let fileUri = FileSystem.documentDirectory + `Bibles/${"KJB1900"}/${BibleBookData[book - 1].shortName}/${chap}.json`;
            let fileContent = await FileSystem.readAsStringAsync(fileUri);
            let chapterDataPrimary = JSON.parse(fileContent);
            //console.log(chapterDataPrimary);

            // Secondary Version
            fileUri = FileSystem.documentDirectory + `Bibles/${"KJB1900"}/${BibleBookData[book - 1].shortName}/${chap}.json`;
            fileContent = await FileSystem.readAsStringAsync(fileUri);
            let chapterDataSecondary = JSON.parse(fileContent);
            //console.log(chapterDataSecondary);

            // Set Variables
            setSecondaryVerData(chapterDataSecondary)
            setPrimaryVerData(chapterDataPrimary)
        } catch (error) {
            console.error("Error reading the file:", error);
        }
    }

    useEffect(() => {
        if (isBibleDownloaded == 1) {
            getChapter();
        }
    }, [isBibleDownloaded])

    return (
        <View>
            {isBibleDownloaded == 0 ?
                <View></View>
                : (isBibleDownloaded == 1 && primaryVerData) ?
                    <View>
                        <View style={styles.topBar}>
                            <TouchableOpacity
                                onPress={() => setPage([book, chap, 0, 0], 6)}
                                style={{ flex: 1, marginRight: 5, backgroundColor: 'lightblue', alignItems: 'center', justifyContent: 'center', height: 40 }}>
                                <Text>{BibleBookData[book - 1].name}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setPage([book, chap, 0, 0], 3)}
                                style={{ flex: 1, marginLeft: 5, backgroundColor: 'lightgreen', alignItems: 'center', justifyContent: 'center', height: 40 }}>
                                <Text>{chap}</Text>
                            </TouchableOpacity>
                            <Switch
                                trackColor={{ false: '#767577', true: 'lightblue' }}
                                thumbColor={isDualView ? '#f4f3f4' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleDualView}
                                value={isDualView}
                            />
                        </View>
                        <ScrollView showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="automatic">
                            <DualSwitcher pri={primaryVerData.verses} sec={secondaryVerData.verses} isDual={isDualView}></DualSwitcher>
                        </ScrollView>
                    </View>
                    :
                    isBibleDownloaded !== 1 ?
                        <View style={styles.centeredView}>
                            <Modal
                                animationType="none"
                                transparent={true}
                                visible={true}
                                onRequestClose={() => {
                                    //Alert.alert('Modal has been closed.');
                                    setModalVisible(!modalVisible);
                                }}>
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <Text style={styles.modalText}>You have no Bibles downloaded. Please go to the Downloads page to download a Bible.</Text>
                                        <Pressable
                                            style={styles.button}
                                            onPress={() => setPage([1, 1, 0, 0], 6)}>
                                            <Text style={styles.modalTextButton}>Go to Downloads!</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                        :
                        <View></View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    // Top Bar
    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: 'white',
        paddingVertical: 5
    },
    // No Bibles Modal
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: '#2196F3',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    modalTextButton: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    }
});

export default BiblePage;

/*<DualSwitcher pri={versesPri} sec={versesSec} isDual={isDualView} />*/