import * as React from "react";
import {
  PixelRatio,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
// import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import { BarChart, Grid } from "react-native-svg-charts";
import { ProgressBar } from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

export default function Dashboard({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View
            style={{
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              flex: 1,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 1.8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "baseline",
                }}
              >
                <Text
                  style={{
                    fontSize: PixelRatio.getFontScale() * 30,
                    color: "#ffffff99",
                    fontFamily: "OpenSans-Regular",
                    paddingRight: 2,
                  }}
                >
                  {"\u20B9"}
                </Text>
                <Text
                  style={{
                    fontSize: PixelRatio.getFontScale() * 38,
                    color: Colors.dark.text,
                    fontFamily: "OpenSans-Bold",
                  }}
                >
                  14,450.00
                </Text>
              </View>
              <Text
                style={{
                  fontSize: PixelRatio.getFontScale() * 12,
                  color: "#ffffff99",
                  fontFamily: "OpenSans-Regular",
                }}
              >
                Total Expanse this month (7)
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                // justifyContent: "center",
                // alignItems: "center",
                // backgroundColor: "green",
              }}
            >
              <View
                style={
                  {
                    //   flex: 1,
                  }
                }
              >
                <ProgressBar
                  progress={0.3}
                  color={"#16c591"}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 10,
                    // width: "50%",
                    // width: "80%",
                    height: 10,
                    width: width * 0.85,
                    // paddingHorizontal: 10,
                  }}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginHorizontal: 10,
                }}
              >
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "baseline",
                      paddingVertical: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: PixelRatio.getFontScale() * 16,
                        color: "#ffffff99",
                        fontFamily: "OpenSans-Regular",
                        paddingRight: 2,
                      }}
                    >
                      {"\u20B9"}
                    </Text>
                    <Text
                      style={{
                        fontSize: PixelRatio.getFontScale() * 17,
                        color: "#ffffff",
                        fontFamily: "OpenSans-SemiBold",
                      }}
                    >
                      1,500.00
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "baseline",
                      paddingVertical: 4,
                    }}
                  >
                    <MaterialIcons
                      name="north-east"
                      color={"#16c591"}
                      size={PixelRatio.getFontScale() * 13}
                      style={{ alignSelf: "center", paddingRight: 3 }}
                    />
                    <Text
                      style={{
                        fontSize: PixelRatio.getFontScale() * 13,
                        color: "#ffffff99",
                        fontFamily: "OpenSans-Regular",
                      }}
                    >
                      Paid (1)
                    </Text>
                  </View>
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "baseline",
                      paddingVertical: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: PixelRatio.getFontScale() * 16,
                        color: "#ffffff99",
                        fontFamily: "OpenSans-Regular",
                        paddingRight: 2,
                      }}
                    >
                      {"\u20B9"}
                    </Text>
                    <Text
                      style={{
                        fontSize: PixelRatio.getFontScale() * 17,
                        color: "#ffffff",
                        fontFamily: "OpenSans-SemiBold",
                      }}
                    >
                      12,950.00
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "baseline",
                      paddingVertical: 4,
                    }}
                  >
                    <MaterialIcons
                      name="priority-high"
                      color={"#fb7c75"}
                      size={PixelRatio.getFontScale() * 13}
                      style={{ alignSelf: "center", paddingRight: 3 }}
                    />
                    <Text
                      style={{
                        fontSize: PixelRatio.getFontScale() * 13,
                        color: "#ffffff99",
                        fontFamily: "OpenSans-Regular",
                      }}
                    >
                      Due (6)
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* <View
          style={{
            height: 50,
            width: 50,
            // alignItems: "center",
            // justifyContent: "center",
            position: "absolute",
            // left: 0,
            // top: 0,
            // width: "100%",
            // height: "100%",
          }}
        >
          <View
            style={{
              flex: 1,
            }}
          ></View>
          <BarChart
            style={{ flex: 1 }}
            data={data}
            svg={{ fill }}
            contentInset={{ top: 30, bottom: 30 }}
          >
            <Grid />
          </BarChart>
        </View> */}
          {/* <View
          style={{
            flex: 1,
            // backgroundColor: "transparent",
          }}
        ></View> */}
        </View>
        <View style={styles.list}></View>
      </View>
    </SafeAreaView>
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
    flex: 1.5,
    backgroundColor: Colors.background,
  },
});
