import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Switch, TouchableOpacity, Text, Modal, Button } from "react-native";

import BibleBookData from '../resources/bibleBookData.json'


const ChapterSelect = ({ book, chap, setChap, setPage }) => {

    useEffect(() => {

    }, [])

    return (
        <View>
            <View style={styles.topBar}>
                <TouchableOpacity
                    onPress={() => setPage(6, [book, chap, 0, 0])}
                    style={{ flex: 1, marginRight: 5, backgroundColor: 'lightblue', alignItems: 'center', justifyContent: 'center', height: 40 }}>
                    <Text>{BibleBookData[book - 1].name}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setPage(3, [book, chap, 0, 0])}
                    style={{ flex: 1, marginLeft: 5, backgroundColor: 'lightgreen', alignItems: 'center', justifyContent: 'center', height: 40 }}>
                    <Text>{chap}</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={styles.container}
            >
                {Array(BibleBookData[book - 1].chapters).fill().map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.button}
                        onPress={() => setPage(3, [book, index + 1, 0, 0])}
                    >
                        <Text style={styles.text}>{(index + 1).toString()}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View >
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
    // Chapter Select
    container: {
        paddingTop: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: "row",
        flexWrap: 'wrap',
    },
    button: {
        marginLeft: 5,
        backgroundColor: 'lightgray',
        alignItems: 'center',
        justifyContent: 'center',
        height: 70,
        width: 70,
        borderRadius: 15,
        marginTop: 10,
    },
    text: {
        color: 'black',
        fontSize: 18
    }
});

export default ChapterSelect;