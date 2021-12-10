/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import {
  ColorSchemeName,
  PixelRatio,
  Pressable,
  Text,
  TouchableOpacity,
} from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import Dashboard from "../screens/Dashboard";
import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import TabOneScreen from "../screens/TabOneScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { IconButton } from "react-native-paper";
import { DeviceEventEmitter } from "react-native";
import MissedBills from "../screens/MissedBills";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const colorScheme = useColorScheme();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={({ navigation }) => ({
          headerTintColor: Colors.dark.text,
          headerTransparent: true,
          // headerStyle: {
          //   backgroundColor: Colors.primary,
          // },
          // headerTitle: () => (
          //   <TouchableOpacity
          //     style={{
          //       flexDirection: "row",
          //       alignItems: "center",
          //       justifyContent: "center",
          //     }}
          //   >
          //     <Text
          //       style={{
          //         fontSize: PixelRatio.getFontScale() * 17,
          //         // fontWeight: "600",
          //         color: Colors.dark.text,
          //         paddingRight: 1,
          //         fontFamily: "OpenSans-SemiBold",
          //       }}
          //     >
          //       {Months[new Date().getMonth()]}
          //     </Text>
          //     <MaterialIcons
          //       name="expand-more"
          //       size={20}
          //       color={Colors.dark.text}
          //       style={{ alignSelf: "center", paddingTop: 3 }}
          //     />
          //   </TouchableOpacity>
          // ),
          headerRight: () => (
            <Pressable
              onPress={() => {
                DeviceEventEmitter.emit("show.addbill", {});
              }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <MaterialIcons name="add" size={22} color={Colors.dark.text} />
            </Pressable>
          ),
          headerLeft: (props) => (
            <Pressable
              onPress={() => console.log("Pressed")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <MaterialIcons name="menu" size={22} color={Colors.dark.text} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Screen
        name="MissedBills"
        component={MissedBills}
        options={{
          title: "Missed Bills",
          headerTintColor: Colors.dark.text,
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          // headerTransparent: true,
        }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

{
  /* <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
<Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
<Stack.Group screenOptions={{ presentation: 'modal' }}>
  <Stack.Screen name="Modal" component={ModalScreen} />
</Stack.Group> */
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <BottomTab.Screen
        name="TabOne"
        component={TabOneScreen}
        options={({ navigation }: RootTabScreenProps<"TabOne">) => ({
          title: "Tab One",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Modal")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoScreen}
        options={{
          title: "Tab Two",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
