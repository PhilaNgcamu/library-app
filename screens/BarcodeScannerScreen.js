import React, { useCallback, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Camera } from "expo-camera";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import {
  searchBook,
  setScanned,
  resetScanned,
  setHasPermission,
  incrementCameraKey,
} from "../redux/actions";
import { Button, ButtonText } from "@gluestack-ui/themed";

const { width, height } = Dimensions.get("window");

const QRCodeScannerScreen = () => {
  const dispatch = useDispatch();
  const hasPermission = useSelector((state) => state.books.hasPermission);
  const cameraKey = useSelector((state) => state.books.cameraKey);
  const scanned = useSelector((state) => state.books.scanned);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      dispatch(setHasPermission(status === "granted"));
    })();
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      dispatch(resetScanned());
      dispatch(incrementCameraKey());
      return () => {};
    }, [dispatch])
  );

  const handleBarCodeScanned = ({ type, data }) => {
    dispatch(setScanned());
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
        key={cameraKey}
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <View style={styles.unfocusedContainer}></View>
          <View style={styles.middleContainer}>
            <View style={styles.unfocusedContainer}></View>
            <View style={styles.focusedContainer}></View>
            <View style={styles.unfocusedContainer}></View>
          </View>
          <View style={styles.unfocusedContainer}></View>
        </View>
      </Camera>
      {scanned && (
        <Button
          style={styles.scanButton}
          onPress={() => dispatch(resetScanned())}
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
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  unfocusedContainer: {
    flex: 1,
  },
  middleContainer: {
    flexDirection: "row",
  },
  focusedContainer: {
    width: width * 0.65,
    height: width * 0.65,
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  scanButton: {
    position: "absolute",
    backgroundColor: "#32a244",
    bottom: 20,
    width: "90%",
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default QRCodeScannerScreen;
