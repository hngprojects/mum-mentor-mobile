import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function useMilestoneTypeChange(defaultType: string, dataname: string) {
  const [mileStoneType, setMilestoneType] = useState(defaultType);

  useEffect(() => {
    const getMileStoneType = async () => {
      try {
        const savedMilestoneType = await AsyncStorage.getItem(dataname);

        if (savedMilestoneType !== null) {
          setMilestoneType(savedMilestoneType);
        }
      } catch (error) {
        if (__DEV__) {
          console.error("failed to load  milestone type");
          console.error(error);
        }
      }
    };

    getMileStoneType();
  }, [dataname]);

  const saveMilestoneType = async (type: string) => {
    try {
      setMilestoneType(type);
      await AsyncStorage.setItem(dataname, type);
    } catch (error) {
      if (__DEV__) {
        console.error(error);
      }
    }
  };

  return { saveMilestoneType, mileStoneType, setMilestoneType };
}
