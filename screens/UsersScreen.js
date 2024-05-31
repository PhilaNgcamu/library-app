import React from "react";
import { View, Text, StyleSheet } from "react-native";

const UsersScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Users Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});

export default UsersScreen;
