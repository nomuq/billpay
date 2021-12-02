import * as React from "react";
import {
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
// import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import { BarChart, Grid } from "react-native-svg-charts";
import { ProgressBar, Snackbar, Surface } from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import { useDatabase } from "../hooks/useDatabase";
import { Bill, BillType } from "../store/database";

export default function Dashboard({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { db } = useDatabase();

  const [data, setData] = React.useState<Bill[]>([]);

  const [todaysBills, setTodaysBills] = React.useState<Bill[]>([]);
  const [upcomingBills, setUpcomingBills] = React.useState<Bill[]>([]);

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    db.getBills().then((bills: Bill[]) => {
      setData(bills);
      setTodaysBills(
        bills.filter((bill: Bill) => {
          let today = new Date();
          let billDate = new Date(bill.date);
          if (
            billDate.getDate() === today.getDate() &&
            billDate.getMonth() === today.getMonth() &&
            billDate.getFullYear() === today.getFullYear()
          ) {
            return bill;
          }
        })
      );
      setUpcomingBills(
        bills.filter((bill: Bill) => {
          let today = new Date();
          let billDate = new Date(bill.date);
          if (
            billDate.getDate() > today.getDate() ||
            billDate.getMonth() > today.getMonth() ||
            billDate.getFullYear() > today.getFullYear()
          ) {
            return bill;
          }
        })
      );
      setLoading(false);
    });

    // filter todays bills from data

    // add sample bill
    // db.addBill({
    //   type: BillType.Electricity,
    //   name: "Electricity",
    //   amount: 1203,
    //   date: new Date().toISOString(),
    //   paid: 0,
    //   note: "1000431645",
    // });
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.primary,
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.background,
        }}
      >
        <View
          style={{
            backgroundColor: Colors.primary,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              margin: 25,
              paddingTop: insets.top,
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 10,
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
            <ProgressBar
              progress={0.3}
              color={"#16c591"}
              style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                height: 10,
                elevation: 5,
                zIndex: 1,
                marginVertical: 20,
              }}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginHorizontal: 2,
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

        <ScrollView>
          <View
            style={{
              margin: 20,
            }}
          >
            <View>
              <MissedBillsComponent
                onPress={() => {
                  navigation.navigate("Modal");
                }}
              ></MissedBillsComponent>
              <View
                style={{
                  marginTop: 20,
                  marginHorizontal: 2,
                }}
              >
                <TodaysBills bills={todaysBills}></TodaysBills>
              </View>
              <View
                style={{
                  marginTop: 20,
                  marginHorizontal: 2,
                }}
              >
                <UpcomingBills bills={upcomingBills}></UpcomingBills>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function TodaysBills({ bills }: any) {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            fontSize: PixelRatio.getFontScale() * 17,
            fontFamily: "OpenSans-Bold",
          }}
        >
          Bills today
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: "OpenSans-Medium",
            color: "#00000099",
          }}
        >
          {new Date().getDate() + " " + Months[new Date().getMonth()]}
        </Text>
      </View>
      <BillList bills={bills}></BillList>
    </View>
  );
}

function UpcomingBills({ bills }: any) {
  const navigation = useNavigation();
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            fontSize: PixelRatio.getFontScale() * 17,
            fontFamily: "OpenSans-Bold",
          }}
        >
          Upcoming bills
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Modal");
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: "OpenSans-Medium",
              color: "#00000099",
            }}
          >
            Paid bills
          </Text>
        </TouchableOpacity>
      </View>
      <BillList bills={bills}></BillList>
    </View>
  );
}

function BillList({ bills }: any) {
  return (
    <Surface
      style={{
        zIndex: 1,
        elevation: 2,
        borderRadius: 4,
        backgroundColor: "#ffffff",
      }}
    >
      {bills.map((bill: any, index: number) => {
        return <BillCard key={index} bill={bill}></BillCard>;
      })}
    </Surface>
  );
}

interface BillCardProps {
  bill: Bill;
}

function BillCard({ bill }: BillCardProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#00000033",
        paddingVertical: 6,
        backgroundColor: "#fff",
      }}
    >
      {bill.paid == 1 ? (
        <View
          style={{
            width: 22,
            height: 22,
            backgroundColor: "#00000099",
            borderRadius: 22,
            justifyContent: "center",
            alignItems: "center",
            margin: 15,
          }}
        >
          {bill.type == BillType.Electricity && (
            <FontAwesome5 name="wifi" size={10} color={"#fff"} />
          )}
          {bill.type == BillType.Phone && (
            <FontAwesome5 name="mobile" size={10} color={"#fff"} />
          )}
        </View>
      ) : (
        <View
          style={{
            width: 22,
            height: 22,
            backgroundColor: "#16c591",
            borderRadius: 22,
            justifyContent: "center",
            alignItems: "center",
            margin: 15,
          }}
        >
          <FontAwesome5 name="check" size={10} color={"#fff"} />
        </View>
      )}
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Text
          style={{
            fontSize: PixelRatio.getFontScale() * 14,
            fontFamily: "OpenSans-SemiBold",
          }}
        >
          {bill.name}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: "OpenSans-Medium",
            color: "#00000099",
          }}
        >
          {bill.note}
        </Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          paddingHorizontal: 15,
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
              fontSize: 12,
              color: "#00000099",
              fontFamily: "OpenSans-Regular",
              paddingRight: 2,
            }}
          >
            {"\u20B9"}
          </Text>
          <Text
            style={{
              fontSize: 14,
              // color: "#ffffff",
              fontFamily: "OpenSans-SemiBold",
            }}
          >
            {Number(bill.amount.toFixed(1)).toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
}

function MissedBillsComponent({ onPress }: any) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Surface
        style={{
          zIndex: 1,
          elevation: 2,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 4,
          backgroundColor: "#fa7c75",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",

            margin: 15,
          }}
        >
          <MaterialIcons name="error" size={20} color={Colors.dark.text} />
          <Text
            style={{
              color: Colors.dark.text,
              fontFamily: "OpenSans-SemiBold",
              flex: 1,
              paddingHorizontal: 10,
            }}
          >
            Missed Bills
          </Text>
          <Text
            style={{
              color: Colors.dark.text,
              fontFamily: "OpenSans-SemiBold",
            }}
          >
            1
          </Text>
        </View>
      </Surface>
    </TouchableOpacity>
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
