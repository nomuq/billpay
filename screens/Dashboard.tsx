import * as React from "react";
import {
  Alert,
  PixelRatio,
  Pressable,
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
import {
  DatePickerModal,
  en,
  registerTranslation,
} from "react-native-paper-dates";
import {
  Button,
  Modal,
  Portal,
  ProgressBar,
  RadioButton,
  Snackbar,
  Surface,
  TextInput,
} from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import { useDatabase } from "../hooks/useDatabase";
import { Bill, BillType, InputBill } from "../store/database";
import { DeviceEventEmitter } from "react-native";

export default function Dashboard({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { db } = useDatabase();

  const [data, setData] = React.useState<Bill[]>([]);

  const [todaysBills, setTodaysBills] = React.useState<Bill[]>([]);
  const [upcomingBills, setUpcomingBills] = React.useState<Bill[]>([]);

  const [loading, setLoading] = React.useState(true);

  // total unpaid amount
  const [totalUnpaid, setTotalUnpaid] = React.useState(0);

  // total paid amount
  const [totalPaid, setTotalPaid] = React.useState(0);

  // total amount this month
  const [totalThisMonth, setTotalThisMonth] = React.useState(0);

  // total expenses this month
  const [totalExpensesThisMonth, setTotalExpensesThisMonth] = React.useState(0);

  // missed bills
  const [missedBills, setMissedBills] = React.useState<Bill[]>([]);

  const [visible, setVisible] = React.useState(false);
  const [refresh, setRefresh] = React.useState(0);

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
  };

  React.useEffect(() => {
    DeviceEventEmitter.addListener("show.addbill", () => {
      showModal();
    });

    DeviceEventEmitter.addListener("refresh.bills", () => {
      setRefresh(refresh + 1);
      console.log("refresh bills");
    });

    (async () => {
      try {
        const today = new Date();

        const bills = await db.getBills();
        setData(bills);
        setTodaysBills(
          bills.filter((bill: Bill) => {
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

        // missed bills
        setMissedBills(
          bills.filter((bill: Bill) => {
            let billDate = new Date(bill.date);
            if (
              billDate.getDate() < today.getDate() ||
              billDate.getMonth() < today.getMonth() ||
              billDate.getFullYear() < today.getFullYear()
            ) {
              if (bill.paid === 0) {
                return bill;
              }
            }
          })
        );

        // total amount this month
        let thisMonthsBills = bills.filter((bill: Bill) => {
          let billDate = new Date(bill.date);
          if (
            billDate.getMonth() === today.getMonth() &&
            billDate.getFullYear() === today.getFullYear()
          ) {
            return bill;
          }
        });

        let total = thisMonthsBills.reduce(
          (acc: number, cur: Bill) => acc + cur.amount,
          0
        );
        setTotalThisMonth(total);

        // total expenses this month
        setTotalExpensesThisMonth(thisMonthsBills.length);

        const amount = await db.getTotalUnpaidAmount();
        setTotalUnpaid(amount);

        const paidAmount = await db.getTotalPaidAmount();
        setTotalPaid(paidAmount);

        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [visible, refresh]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

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
        <Portal>
          <Modal visible={visible} onDismiss={hideModal}>
            <NewBillComponent visible={visible} onDismiss={hideModal} />
          </Modal>
        </Portal>
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
                  {totalThisMonth.toFixed(2)}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: "#ffffff99",
                  fontFamily: "OpenSans-Regular",
                }}
              >
                Total Expanse this month ({totalExpensesThisMonth})
              </Text>
            </View>
            <ProgressBar
              progress={
                isNaN(totalPaid / totalThisMonth)
                  ? 0
                  : totalPaid / totalThisMonth
              }
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
                value={totalPaid.toFixed(2)}
                icon="north-east"
                icon_color="#16c591"
              />

              <StatsComponent
                value={totalUnpaid.toFixed(2)}
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
              {missedBills.length > 0 && (
                <MissedBillsComponent
                  bills={missedBills}
                  onPress={() => {
                    navigation.navigate("MissedBills");
                  }}
                />
              )}
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
            navigation.navigate("PaidBills");
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

export function BillList({ bills }: any) {
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
  const { db } = useDatabase();

  return (
    <TouchableOpacity
      onPress={() => {
        if (bill.paid == 0) {
          Alert.alert("Bill", "Do you want to pay this bill?", [
            {
              text: "Yes",
              onPress: () => {
                db.payBill(bill.id).then(() => {
                  DeviceEventEmitter.emit("refresh.bills");
                });
              },
            },
            {
              text: "No",
            },
          ]);
        }
      }}
    >
      <View
        style={{
          flexDirection: "row",
          borderBottomWidth: 1,
          borderBottomColor: "#00000033",
          paddingVertical: 6,
          backgroundColor: "#fff",
        }}
      >
        {bill.paid == 0 ? (
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
            {Date(bill.date).toString().substring(0, 21)}
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
              {bill.amount.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function MissedBillsComponent({ bills, onPress }: any) {
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
            {bills.length}
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

// filter todays bills from data
// var d = new Date();
// // d.setDate(d.getDate() + 3);
// // // add sample bill
// db.addBill({
//   type: BillType.Internet,
//   name: "JIO Internet Bill",
//   amount: 1200.88,
//   date: d.toISOString(),
//   paid: 0,
//   note: "9426678969",
// });

function BillTypeComponent({
  types,
  billType,
  setBillType,
  setVisable,
  bill,
  setBill,
}: any) {
  return (
    <Surface
      style={{
        margin: 15,
        zIndex: 1,
        elevation: 2,
        borderRadius: 4,
        backgroundColor: "#fff",
      }}
    >
      <View
        style={{
          padding: 15,
        }}
      >
        <RadioButton.Group
          onValueChange={(value) => {
            if (value) {
              // setBillType(value);
              setBill({ ...bill, type: value });
              setVisable(false);
            }
          }}
          value={bill.type}
        >
          {types.map((type: any, index: any) => {
            return (
              <View
                key={index}
                style={{
                  backgroundColor:
                    bill.type === type.type.toString() ? "#16c591" : "#fff",
                }}
              >
                <RadioButton.Item
                  value={type.type.toString()}
                  label={type.name}
                />
              </View>
            );
          })}
        </RadioButton.Group>
      </View>
    </Surface>
  );
}

function NewBillComponent({ onDismiss }: any) {
  const [billType, setBillType] = React.useState<string>(
    BillType.Electricity.toString()
  );

  const { db } = useDatabase();

  const types = [
    { type: BillType.Electricity, name: "Electricity" },
    { type: BillType.Phone, name: "Phone" },
    { type: BillType.Internet, name: "Internet" },
    { type: BillType.Water, name: "Water" },
    { type: BillType.Gas, name: "Gas" },
    { type: BillType.Rent, name: "Rent" },
    { type: BillType.Loan, name: "Loan" },
    { type: BillType.Other, name: "Other" },
  ];

  const [visible, setVisable] = React.useState<boolean>(false);
  const [bill, setBill] = React.useState<InputBill>({
    type: BillType.Electricity,
    name: "",
    amount: 0,
    date: new Date().toISOString(),
    paid: 0,
    note: "",
  });

  return (
    <Surface
      style={{
        margin: 15,
        zIndex: 1,
        elevation: 2,
        borderRadius: 4,
        backgroundColor: "#fff",
      }}
    >
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => {
            setVisable(false);
          }}
        >
          <BillTypeComponent
            types={types}
            billType={billType}
            setBillType={setBillType}
            setVisable={setVisable}
            setBill={setBill}
            bill={bill}
          ></BillTypeComponent>
        </Modal>
      </Portal>

      <View
        style={{
          padding: 15,
        }}
      >
        <View
          style={{
            paddingBottom: 10,
            paddingHorizontal: 5,
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 22,
              // color: "#00000099",
              fontFamily: "OpenSans-Bold",
            }}
          >
            New Bill
          </Text>
        </View>
        <View
          style={{
            marginVertical: 5,
          }}
        >
          <TextInput
            autoComplete="off"
            label="Bill Type"
            value={
              types.find((t: any) => t.type.toString() === bill.type)?.name
            }
            editable={false}
            onPressIn={() => {
              setVisable(true);
            }}
          />
        </View>

        <View
          style={{
            marginVertical: 5,
          }}
        >
          <TextInput
            autoComplete="off"
            label="Bill Title"
            value={bill.name}
            onChangeText={(text) => {
              setBill({ ...bill, name: text });
            }}
          />
        </View>
        <View
          style={{
            marginVertical: 5,
          }}
        >
          <TextInput
            autoComplete="off"
            label="Bill Amount"
            keyboardType="number-pad"
            value={bill.amount.toString()}
            onChangeText={(text) => {
              if (text.length > 0) {
                setBill({
                  ...bill,
                  amount: parseFloat(text),
                });
              } else {
                setBill({
                  ...bill,
                  amount: 0,
                });
              }
            }}
          />
        </View>

        <View
          style={{
            marginVertical: 5,
          }}
        >
          <BillDatePicker bill={bill} setBill={setBill}></BillDatePicker>
        </View>

        <View
          style={{
            marginVertical: 5,
          }}
        >
          <TextInput
            autoComplete="off"
            label="Bill Notes"
            value={bill.note}
            onChangeText={(text) => {
              setBill({ ...bill, note: text });
            }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 5,
          }}
        >
          <Button
            style={{
              flex: 1,
              margin: 10,
            }}
            onPress={() => {
              console.log(bill.name.length);
              if (bill.name.length <= 0) {
                alert("Name cannot be empty");
              } else if (bill.amount <= 0) {
                alert("Amount cannot be empty");
              } else if (bill.date === "") {
                alert("Date cannot be empty");
              } else {
                db.addBill({
                  ...bill,
                });
                onDismiss();
              }
            }}
            uppercase={false}
            mode="outlined"
          >
            Save
          </Button>
          <Button
            style={{
              flex: 1,
              margin: 10,
            }}
            onPress={() => {
              onDismiss();
            }}
            uppercase={false}
            mode="outlined"
          >
            Cancle
          </Button>
        </View>
      </View>
    </Surface>
  );
}
registerTranslation("en", en);
function BillDatePicker({ bill, setBill }: any) {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [open, setOpen] = React.useState(false);

  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = React.useCallback(
    (params) => {
      if (params.date) {
        setBill({ ...bill, date: params.date.toISOString() });
      } else {
        setBill({ ...bill, date: new Date().toISOString() });
      }
      setOpen(false);
      setDate(params.date);
    },
    [setOpen, setDate]
  );

  return (
    <>
      <TextInput
        autoComplete="off"
        label="Bill Due Date"
        value={date?.toDateString()}
        editable={false}
        onPressIn={() => {
          setOpen(true);
        }}
      />
      {/* <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
        Pick single date
      </Button> */}
      <DatePickerModal
        locale="en"
        mode="single"
        visible={open}
        onDismiss={onDismissSingle}
        date={date}
        onConfirm={onConfirmSingle}
        // validRange={{
        //   startDate: new Date(2021, 1, 2),  // optional
        //   endDate: new Date(), // optional
        //   disabledDates: [new Date()] // optional
        // }}
        // onChange={} // same props as onConfirm but triggered without confirmed by user
        // saveLabel="Save" // optional
        // uppercase={false} // optional, default is true
        // label="Select date" // optional
        // animationType="slide" // optional, default is 'slide' on ios/android and 'none' on web
      />
    </>
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
