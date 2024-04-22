import React, { useState } from 'react';
import { View, StyleSheet } from "react-native";
import Verse from "./verse.js"

const DualSwitcher = props => {
    const pri = props.pri;
    const sec = props.sec;
    const isDual = props.isDual
    return (
        <View style={styles.container}>
            {pri.map((verse, index) => (
                <React.Fragment key={index}>
                    <Verse
                        key={index}
                        number={verse.verse}
                        text={verse.text}
                    />
                    {isDual && (
                        <Verse
                            number={sec[index].verse}
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
    container: {
        paddingTop: 60,
        paddingBottom: 20
    }
});

export default DualSwitcher;
