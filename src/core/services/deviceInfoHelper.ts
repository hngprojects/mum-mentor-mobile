import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { Platform } from 'react-native';

/**
 * Get device information for authentication
 */
export const getDeviceInfo = async () => {
  try {
    let deviceId = '';
    let deviceName = '';

    // Get device ID
    if (Platform.OS === 'android') {
      deviceId = Application.getAndroidId() || 'unknown-android';
    } else if (Platform.OS === 'ios') {
      deviceId = await Application.getIosIdForVendorAsync() || 'unknown-ios';
    } else {
      deviceId = 'web-device';
    }

    // Get device name
    deviceName = `${Device.brand || 'Unknown'} ${Device.modelName || Device.osName || 'Device'}`;

    return {
      device_id: deviceId,
      device_name: deviceName.trim(),
    };
  } catch (error) {
    console.error('Error getting device info:', error);
    return {
      device_id: 'unknown-device',
      device_name: `${Platform.OS} device`,
    };
  }
};