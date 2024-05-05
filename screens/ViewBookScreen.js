import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { Button, ButtonText } from "@gluestack-ui/themed";

const ViewBookScreen = ({ navigation, route }) => {
  const { bookId } = route.params;

  const book = useSelector((state) =>
    state.books.books.find((book) => book.id === bookId)
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.coverContainer}>
        <Image source={{ uri: book.coverUrl }} style={styles.cover} />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Title:</Text>
          <Text style={styles.text}>{book.title}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Author:</Text>
          <Text style={styles.text}>{book.author}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Genre:</Text>
          <Text style={styles.text}>{book.genre}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Description:</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{book.description}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Page Count:</Text>
          <Text style={styles.text}>{book.pageCount}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Published Date:</Text>
          <Text style={styles.text}>{book.publishedDate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Language:</Text>
          <Text style={styles.text}>{book.language}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f7f7f7",
  },
  coverContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  cover: {
    width: 200,
    height: 300,
    borderRadius: 10,
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    width: "30%",
  },
  text: {
    fontSize: 16,
    width: "65%",
  },
  descriptionContainer: {
    maxWidth: "70%",
  },
  description: {
    fontSize: 16,
    textAlign: "justify",
  },
});

export default ViewBookScreen;
