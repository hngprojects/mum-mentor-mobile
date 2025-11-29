import {Platform} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const isWeb = Platform.OS === "web";

const storage = {
    async get(key: string, secure?: boolean): Promise<string | null> {
        if (isWeb) {
            return localStorage.getItem(key);
        } else if (secure) {
            return SecureStore.getItemAsync(key);
        } else {
            return AsyncStorage.getItem(key);
        }
    },
    async set(key: string, value: string, secure?: boolean): Promise<void> {
        if (isWeb) {
            return localStorage.setItem(key, value);
        } else if (secure) {
            return SecureStore.setItemAsync(key, value);
        } else {
            return AsyncStorage.setItem(key, value);
        }
    },
    remove: async function (key: string, secure?: boolean): Promise<void> {
        if (isWeb) {
            localStorage.removeItem(key);
        } else if (secure) {
            await SecureStore.deleteItemAsync(key);
        } else {
            await AsyncStorage.removeItem(key);
        }
    },
}

export default storage;