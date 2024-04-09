import React, { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import { View, ScrollView, Text, Pressable, StyleSheet, Modal } from 'react-native';
import PocketBase from 'pocketbase'; // Import PocketBase library

const DownloadPage = () => {
    const [data, setData] = useState([]);
    const [download, setDownload] = useState();

    const BibleBookNames = [
        { "name": "GEN", "chapters": 50 },
        { "name": "EXO", "chapters": 40 },
        { "name": "LEV", "chapters": 27 },
        { "name": "NUM", "chapters": 36 },
        { "name": "DEU", "chapters": 34 },
        { "name": "JOS", "chapters": 24 },
        { "name": "JDG", "chapters": 21 },
        { "name": "RTH", "chapters": 4 },
        { "name": "1SA", "chapters": 31 },
        { "name": "2SA", "chapters": 24 },
        { "name": "1KI", "chapters": 22 },
        { "name": "2KI", "chapters": 25 },
        { "name": "1CH", "chapters": 29 },
        { "name": "2CH", "chapters": 36 },
        { "name": "EZR", "chapters": 10 },
        { "name": "NEH", "chapters": 13 },
        { "name": "EST", "chapters": 10 },
        { "name": "JOB", "chapters": 42 },
        { "name": "PSA", "chapters": 150 },
        { "name": "PRO", "chapters": 31 },
        { "name": "ECC", "chapters": 12 },
        { "name": "SNG", "chapters": 8 },
        { "name": "ISA", "chapters": 66 },
        { "name": "JER", "chapters": 52 },
        { "name": "LAM", "chapters": 5 },
        { "name": "EZK", "chapters": 48 },
        { "name": "DAN", "chapters": 12 },
        { "name": "HOS", "chapters": 14 },
        { "name": "JOL", "chapters": 3 },
        { "name": "AMO", "chapters": 9 },
        { "name": "OBA", "chapters": 1 },
        { "name": "JON", "chapters": 4 },
        { "name": "MIC", "chapters": 7 },
        { "name": "NUM", "chapters": 3 },
        { "name": "HAB", "chapters": 3 },
        { "name": "ZEP", "chapters": 3 },
        { "name": "HAG", "chapters": 2 },
        { "name": "ZEC", "chapters": 14 },
        { "name": "MAL", "chapters": 4 },
        { "name": "MAT", "chapters": 28 },
        { "name": "MRK", "chapters": 16 },
        { "name": "LUK", "chapters": 24 },
        { "name": "JHN", "chapters": 21 },
        { "name": "ACT", "chapters": 28 },
        { "name": "ROM", "chapters": 16 },
        { "name": "1CO", "chapters": 16 },
        { "name": "2CO", "chapters": 13 },
        { "name": "GAL", "chapters": 6 },
        { "name": "EPH", "chapters": 6 },
        { "name": "PHP", "chapters": 4 },
        { "name": "COL", "chapters": 4 },
        { "name": "1TH", "chapters": 5 },
        { "name": "2TH", "chapters": 3 },
        { "name": "1TI", "chapters": 6 },
        { "name": "2TI", "chapters": 4 },
        { "name": "TIT", "chapters": 3 },
        { "name": "PHM", "chapters": 1 },
        { "name": "HEB", "chapters": 13 },
        { "name": "JAS", "chapters": 5 },
        { "name": "1PE", "chapters": 5 },
        { "name": "2PE", "chapters": 3 },
        { "name": "1JN", "chapters": 5 },
        { "name": "2JN", "chapters": 1 },
        { "name": "3JN", "chapters": 1 },
        { "name": "JUD", "chapters": 1 },
        { "name": "REV", "chapters": 22 }
    ]

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
        downloadVersion();
    }, [download]);

    const downloadVersion = async () => {
        if (download)
            try {
                let totalBooksToDownload = 0;
                let startBookIndex = 0;

                switch (download.fullBible) {
                    case 0:
                        totalBooksToDownload = 66; // Full Bible
                        break;
                    case 1:
                        totalBooksToDownload = 39; // Old Testament Only
                        break;
                    case 2:
                        totalBooksToDownload = 27;
                        startBookIndex = 39; // New Testament Only
                        break;
                    default:
                        console.warn('Invalid value. Please provide a valid value (0, 1, or 2).');
                        return;
                }

                for (let i = startBookIndex; i < startBookIndex + totalBooksToDownload; i++) {
                    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + `${download.shortName}/${BibleBookNames[i].name}`, {});

                    console.log(`Book ${i} downloaded to ${FileSystem.documentDirectory + `${download.shortName}/${BibleBookNames[i].name}`}`);

                    // Download chapters for the current book
                    await downloadChaptersForBook(i);
                }

                console.log('All books and chapters downloaded successfully');
            } catch (error) {
                console.error('Error downloading books and chapters:', error);
            }
    };

    const downloadChaptersForBook = async (bookIndex) => {
        try {
            for (let j = 1; j <= BibleBookNames[bookIndex].chapters; j++) {
                const chapterUrl = `https://raw.githubusercontent.com/kenyonbowers/HostedBibleVersions/main/${"KJB1762"}/${BibleBookNames[bookIndex].name}/${j}.json`;
                console.log(chapterUrl)
                const chapterResumable = FileSystem.createDownloadResumable(
                    chapterUrl,
                    FileSystem.documentDirectory + `${"KJB1762"}/${BibleBookNames[bookIndex].name}/${j}.json`
                );

                const { uri: chapterUri } = await chapterResumable.downloadAsync();
                console.log(`Chapter ${j} of Book ${bookIndex} downloaded to ${chapterUri}`);
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
        </ScrollView >
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
    },
});


export default DownloadPage;