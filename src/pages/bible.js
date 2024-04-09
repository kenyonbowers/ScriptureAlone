import React, { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { View, ScrollView, StyleSheet, Switch, TouchableOpacity, Text, Modal, Pressable } from "react-native";
import DualSwitcher from '../bibleComponents/dualSwitcher.js'

const BiblePage = ({ book, chap, setPage }) => {
    const checkFolderExists = async (folderName) => {
        try {
            const folderInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + folderName);
            return folderInfo.exists;
        } catch (error) {
            console.error('Error checking folder existence:', error);
            return false;
        }
    };

    const [isBibleDownloaded, setIsBibleDownloaded] = useState(checkFolderExists('Bible')['_j']);

    //console.log(isBibleDownloaded);

    const [isDualView, setDualView] = useState(true);
    const toggleDualView = () => setDualView(!isDualView);
    const [data, setData] = useState(null);





    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            {isBibleDownloaded ?
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <TouchableOpacity style={{ flex: 1, marginRight: 5, backgroundColor: 'lightblue', alignItems: 'center', justifyContent: 'center', height: 40 }}>
                        <Text>{props.book}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 1, marginLeft: 5, backgroundColor: 'lightgreen', alignItems: 'center', justifyContent: 'center', height: 40 }}>
                        <Text>{props.chap}</Text>
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
                        visible={!isBibleDownloaded}
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