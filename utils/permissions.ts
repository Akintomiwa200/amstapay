import { Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

export const permissions = {
  camera: async (): Promise<boolean> => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    return status === 'granted';
  },

  mediaLibrary: async (): Promise<boolean> => {
    if (Platform.OS !== 'web') {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      return status === 'granted';
    }
    return true;
  },

  imagePicker: async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  },
};
