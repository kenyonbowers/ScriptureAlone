import React, { useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import Verse from "./verse.js"

const DualSwitcher = props => {
    const pri = props.pri;
    const sec = props.sec;
    const isDual = props.isDual
    return (
        <View>
            {pri.map((verse, index) => (
                <React.Fragment key={index}>
                    <Verse
                        key={index}
                        number={verse.number}
                        text={verse.text}
                    />
                    {isDual && (
                        <Verse
                            number={sec[index].number}
                            isDual={true}
                            text={sec[index].text}
                        />
                    )}
                </React.Fragment>
            ))}
        </View>
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
    }
});

export default DualSwitcher;
