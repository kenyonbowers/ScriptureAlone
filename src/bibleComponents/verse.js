import React, { View, Text, StyleSheet } from "react-native";

const Verse = props => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <Text style={props.isDual ? styles.dual : styles.primary}>
                <Text style={[styles.text, styles.italic, styles.bold]}>{props.number}  </Text>
                {props.text.map((word, index) => (
                    word.startsWith('*') ?
                        <Text key={index} style={[styles.text, styles.italic]}>{word.substr(1)} </Text>
                        : word.startsWith("|") ?
                            <Text key={index} style={styles.text}>{word} </Text>
                            :
                            <Text key={index} style={styles.text}>{word} </Text>
                ))}
            </Text>
        </View >
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 20
    },
    italic: {
        fontStyle: 'italic',
    },
    bold: {
        fontWeight: 'bold',
    },
    primary: {

    },
    dual: {
        color: "#81b0ff"
    }
});

export default Verse;
