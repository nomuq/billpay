import React, { useEffect } from "react";
import { View, Text, DeviceEventEmitter } from "react-native";
import { useDatabase } from "../hooks/useDatabase";
import { Bill } from "../store/database";
import { BillList } from "./Dashboard";

export default function PaidBills() {
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
      const bills = await db.getPaidBills();

      // missed bills
      setMissedBills(bills);
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
