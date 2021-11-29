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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Header />
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

function Header({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  return (
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
                fontSize: 30,
                color: "#ffffff99",
                fontFamily: "OpenSans-Regular",
                paddingRight: 2,
              }}
            >
              {"\u20B9"}
            </Text>
            <Text
              style={{
                fontSize: PixelRatio.getFontScale() * 35,
                color: Colors.dark.text,
                fontFamily: "OpenSans-Bold",
              }}
            >
              14,450.00
            </Text>
          </View>
          <Text
            style={{
              fontSize: 12,
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
          }}
        >
          <View
            style={{
              paddingBottom: 10,
            }}
          >
            <ProgressBar
              progress={0.3}
              color={"#16c591"}
              style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                height: 10,
                width: width * 0.85,
                elevation: 5,
                zIndex: 1,
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
            <StatsComponent
              value="1,500.00"
              icon="north-east"
              icon_color="#16c591"
            />

            <StatsComponent
              value="12,950.00"
              icon="priority-high"
              icon_color="#fb7c75"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

function StatsComponent({ value, icon, icon_color }: any) {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "baseline",
          paddingVertical: 2,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: "#ffffff99",
            fontFamily: "OpenSans-Regular",
            paddingRight: 2,
          }}
        >
          {"\u20B9"}
        </Text>
        <Text
          style={{
            fontSize: 17,
            color: "#ffffff",
            fontFamily: "OpenSans-SemiBold",
          }}
        >
          {value}
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
          name={icon}
          color={icon_color}
          size={13}
          style={{ alignSelf: "center", paddingRight: 3 }}
        />
        <Text
          style={{
            fontSize: 13,
            color: "#ffffff99",
            fontFamily: "OpenSans-Regular",
          }}
        >
          Paid (1)
        </Text>
      </View>
    </View>
  );
}
