import React, { useCallback, useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { Camera } from "expo-camera";
import { useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { searchBook } from "../redux/actions";
import { Button, ButtonText } from "@gluestack-ui/themed";

const QRCodeScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      })();
      return () => {};
    }, [])
  );

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    console.log(data);

    const isbn = extractISBN(data);
    console.log("ISBN:", isbn);

    dispatch(searchBook(isbn));
  };

  const extractISBN = (qrCodeData) => {
    const regex = /\b\d{10,13}\b/;
    const match = qrCodeData.match(regex);
    return match ? match[0] : null;
  };

  if (hasPermission === null) {
    return (
      <ActivityIndicator
        size="large"
        color="#32a244"
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    );
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {scanned && (
        <Button
          style={{ backgroundColor: "#32a244" }}
          title={"Tap to Scan Again"}
          onPress={() => setScanned(false)}
        >
          <ButtonText>Tap to Scan Again</ButtonText>
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
});

export default QRCodeScannerScreen;
