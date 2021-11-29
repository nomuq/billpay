import * as React from "react";
import { StyleSheet, View } from "react-native";
// import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";

export default function Dashboard({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <View style={styles.list}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    flex: 1,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 1,
  },
  list: {
    flex: 1.3,
    backgroundColor: Colors.background,
  },
});
