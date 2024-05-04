import React, { useState, useEffect, useRef } from 'react';
import * as FileSystem from 'expo-file-system';
import { View, ScrollView, Text, Pressable, StyleSheet, Modal, Button } from 'react-native';
import PocketBase from 'pocketbase';

import BibleBookData from '../resources/bibleBookData.json'

const DownloadPage = ({ backButtonDisabled }) => {
    const [data, setData] = useState([]);
    const [download, setDownload] = useState();

    const [downloadGoal, setDownloadGoal] = useState(0);
    const [downloadProgress, setDownloadProgress] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Initialize PocketBase
                const pocketBase = new PocketBase("https://kjb.pockethost.io/");
                // Example: Fetching a full list from PocketBase
                const response = await pocketBase.collection('Bibles').getFullList({
                    sort: 'created',
                });
                // Update state with the fetched data
                //console.log(response)
                setData(response);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        // Clean-up function
        return () => {
            // Any clean-up code here, if needed
        };
    }, []); // Empty dependency array to ensure effect runs only once on component mount

    useEffect(() => {
        if (download) {
            backButtonDisabled(true);
            downloadVersion();
        }
    }, [download]);

    const downloadVersion = async () => {
        try {
            const dirInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + `Bibles`);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + `Bibles`, {});
                console.log("'Bible' directory created.");
            }
            await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + `Bibles/${download.shortName}`, { intermediates: true });
            let totalBooksToDownload = 0;
            let startBookIndex = 0;

            switch (download.fullBible) {
                case 0:
                    totalBooksToDownload = 66; // Full Bible
                    setDownloadGoal(1189);
                    break;
                case 1:
                    totalBooksToDownload = 39; // Old Testament Only
                    setDownloadGoal(929);
                    break;
                case 2:
                    totalBooksToDownload = 27;
                    startBookIndex = 39; // New Testament Only
                    setDownloadGoal(260);
                    break;
                default:
                    console.warn('Invalid value. Please provide a valid value (0, 1, or 2).');
                    return;
            }

            for (let i = startBookIndex; i < startBookIndex + totalBooksToDownload; i++) {
                await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + `Bibles/${download.shortName}/${BibleBookData[i].shortName}`, { intermediates: true });

                //console.log(`Book ${i} downloaded to ${FileSystem.documentDirectory + `Bibles/${download.shortName}/${BibleBookData[i].shortName}`}`);

                // Download chapters for the current book
                await downloadChaptersForBook(i, totalBooksToDownload == 39 ? 39 : 66);
            }

            console.log('All books and chapters downloaded successfully');
            setDownload();
            backButtonDisabled();
        } catch (error) {
            console.error('Error downloading books and chapters:', error);
            //setDownload();
        }
    };

    const downloadChaptersForBook = async (bookIndex, lastIndex) => {
        try {
            for (let j = 1; j <= BibleBookData[bookIndex].chapters; j++) {
                const chapterUrl = `https://raw.githubusercontent.com/kenyonbowers/HostedBibleVersions/main/${"KJB1762"}/${BibleBookData[bookIndex].shortName}/${j}.json`;
                //console.log(chapterUrl)
                const chapterResumable = FileSystem.createDownloadResumable(
                    chapterUrl,
                    FileSystem.documentDirectory + `Bibles/${download.shortName}/${BibleBookData[bookIndex].shortName}/${j}.json`
                );

                const { uri: chapterUri } = await chapterResumable.downloadAsync();
                console.log(`Chapter ${j} of Book ${bookIndex} downloaded to ${chapterUri}`);
                setDownloadProgress(`${BibleBookData[bookIndex].name} ${j} Downloaded.`);
            }
            if (bookIndex + 1 == lastIndex) {
                await FileSystem.writeAsStringAsync(
                    FileSystem.documentDirectory + `Bibles/${download.shortName}/version.json`,
                    download.toString()
                );
                console.log(`version.json downloaded to ${FileSystem.documentDirectory + `Bibles/${download.shortName}/version.json`}`);
                setDownloadProgress(`Verson Data Downloaded.`);
            }
        } catch (error) {
            console.error(`Error downloading chapters for Book ${bookIndex}:`, error);
        }
    };

    return (
        <ScrollView style={{ marginTop: 10 }}>
            {download && <Modal>
                <View style={styles.modalContainer}>
                    <Text style={styles.downloadingText}>Downloading {download.name}...</Text>
                    <Text>Please do not close the app.</Text>
                    <Text>{downloadProgress}</Text>
                </View>
            </Modal>}
            {data.map((version, index) => (
                <View key={index} style={[styles.container, { marginVertical: 2 }]}>
                    <Text>{version.name}{version.edition !== "" && <Text> ({version.edition})</Text>}</Text>
                    <Text style={{ marginTop: 5 }}>{version.language}</Text>
                    <Pressable
                        style={styles.button}
                        onPress={() => setDownload(version)}>
                        <Text style={styles.textStyle}>Download!</Text>
                    </Pressable>
                </View>
            ))
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: '#2196F3',
        marginTop: 15
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    downloadingText: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
});

export default DownloadPage;