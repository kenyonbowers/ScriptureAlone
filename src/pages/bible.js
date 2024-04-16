import React, { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { View, ScrollView, StyleSheet, Switch, TouchableOpacity, Text, Modal, Pressable } from "react-native";
import { StatusBar } from 'expo-status-bar';

import DualSwitcher from '../bibleComponents/dualSwitcher.js'


const BiblePage = ({ book, chap, setPage }) => {
    const [isBibleDownloaded, setIsBibleDownloaded] = useState(0);

    const [isDualView, setDualView] = useState(true);
    const toggleDualView = () => setDualView(!isDualView);
    const [data, setData] = useState(null);

    const checkForBibleFolder = async () => {
        const mainDir = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
        if (mainDir.includes("Bibles")) {
            bibleDir = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + "Bibles/RVG2023/GEN");
            return bibleDir;
        }
        else
            return [];
    }

    useEffect(() => {
        const fetchData = async () => {
            const content = await checkForBibleFolder();
            setIsBibleDownloaded(content.length == 0 ? 2 : 1);
            console.log(content.length == 0 ? 2 : 1)
            console.log(content)
        };

        fetchData();
    }, [])

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            {isBibleDownloaded == 0 ? <ScrollView></ScrollView> : isBibleDownloaded == 1 ?
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <TouchableOpacity
                        onPress={() => setPage(6)}
                        style={{ flex: 1, marginRight: 5, backgroundColor: 'lightblue', alignItems: 'center', justifyContent: 'center', height: 40 }}>
                        <Text>{book}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setPage(3)}
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
                :
                <View style={styles.centeredView}>
                    <Modal
                        animationType="none"
                        transparent={true}
                        visible={true}
                        onRequestClose={() => {
                            Alert.alert('Modal has been closed.');
                            setModalVisible(!modalVisible);
                        }}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>You have no Bibles downloaded. Please go to the Downloads page to download a Bible.</Text>
                                <Pressable
                                    style={styles.button}
                                    onPress={() => setPage(6)}>
                                    <Text style={styles.textStyle}>Go to Downloads!</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                </View>
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 20
    },
    italic: {

    },
    verseNumber: {
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 20,
    },
    dual: {
        color: "#81b0ff"
    },

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
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

export default BiblePage;

/*<DualSwitcher pri={versesPri} sec={versesSec} isDual={isDualView} />*/