import * as SQLite from "expo-sqlite";
import Database from "../store/database";

export const useDatabase = () => {
  const db = Database.getInstance();

  return {
    db,
  };
};
