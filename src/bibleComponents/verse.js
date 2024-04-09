import { View, Text, StyleSheet } from "react-native";

const Verse = props => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <Text style={props.isDual ? styles.dual : null}>
                <Text style={styles.verseNumber}>{props.number}  </Text>
                <Text style={styles.text}>{props.text}</Text>
            </Text>
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

export default Verse;
