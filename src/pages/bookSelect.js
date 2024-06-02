import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Switch, TouchableOpacity, Text, Modal, Button } from "react-native";

import BibleBookData from '../resources/bibleBookData.json'


const BookSelect = ({ book, chap, setBook, setPage }) => {

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
                    onPress={() => { setPage(2, 3) }}
                    style={{ flex: 1, marginLeft: 5, backgroundColor: 'lightgreen', alignItems: 'center', justifyContent: 'center', height: 40 }}>
                    <Text>{chap}</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={styles.container}
            >
                {BibleBookData.map((book, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.button}
                        onPress={() => { setBook(index + 1); setPage(2, 3) }}
                    >
                        <Text style={styles.text}>{book.name}</Text>
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
        justifyContent: 'space-evenly',
        flexDirection: "column",
    },
    button: {
        marginHorizontal: 5,
        borderTopColor: "lightgray",
        borderTopWidth: 0.5,
        height: 50,
        width: "full",
        justifyContent: 'center',
    },
    text: {
        color: 'black',
        fontSize: 18
    }
});

export default BookSelect;