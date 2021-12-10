import React, { useEffect } from "react";
import { View, Text, DeviceEventEmitter } from "react-native";
import { useDatabase } from "../hooks/useDatabase";
import { Bill } from "../store/database";
import { BillList } from "./Dashboard";

export default function MissedBills() {
  const { db } = useDatabase();
  // missed bills
  const [missedBills, setMissedBills] = React.useState<Bill[]>([]);
  const [refresh, setRefresh] = React.useState(0);

  useEffect(() => {
    DeviceEventEmitter.addListener("refresh.bills", () => {
      setRefresh(refresh + 1);
      console.log("refresh bills");
    });

    (async () => {
      const today = new Date();
      const bills = await db.getBills();

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
    })();
  }, [refresh]);

  return (
    <View
      style={{
        margin: 10,
      }}
    >
      <BillList bills={missedBills}></BillList>
    </View>
  );
}
