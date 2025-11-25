// src/components/GalleryComponents/CameraScreen.tsx

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/core/styles';
import { ms, vs } from '@/src/core/styles/scaling';

interface CameraScreenProps {
  visible: boolean;
  onClose: () => void;
  onPhotoTaken: (uri: string) => void;
}

const CameraScreen: React.FC<CameraScreenProps> = ({
  visible,
  onClose,
  onPhotoTaken,
}) => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={onClose}
      >
        <View style={styles.permissionContainer}>
          <StatusBar style="dark" />
          <Text style={styles.message}>We need your permission to show the camera</Text>
          <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });
        
        if (photo?.uri) {
          onPhotoTaken(photo.uri);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <StatusBar style="light" />
        
        <CameraView 
          ref={cameraRef}
          style={styles.camera} 
          facing={facing}
        >
          <View style={styles.topBar}>
            <TouchableOpacity onPress={onClose} style={styles.topButton}>
              <Ionicons name="arrow-back" size={28} color={colors.textWhite} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={toggleCameraFacing} style={styles.topButton}>
              <Ionicons name="camera-reverse-outline" size={28} color={colors.textWhite} />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.sideButton}>
              <Ionicons name="images-outline" size={28} color={colors.textWhite} />
            </TouchableOpacity>

            <TouchableOpacity onPress={takePicture} style={styles.captureButtonOuter}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleCameraFacing} style={styles.sideButton}>
              <Ionicons name="camera-reverse-outline" size={28} color={colors.textWhite} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    </Modal>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.textPrimary,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundMain,
    paddingHorizontal: ms(40),
  },
  message: {
    textAlign: 'center',
    color: colors.textPrimary,
    fontSize: 16,
    marginBottom: vs(30),
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingVertical: vs(15),
    paddingHorizontal: ms(40),
    borderRadius: ms(10),
    marginBottom: vs(15),
    width: '100%',
  },
  permissionButtonText: {
    color: colors.textWhite,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: vs(15),
    paddingHorizontal: ms(40),
    width: '100%',
  },
  cancelButtonText: {
    color: colors.textGrey1,
    textAlign: 'center',
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ms(20),
    paddingTop: vs(60),
    paddingBottom: vs(20),
  },
  topButton: {
    width: ms(44),
    height: ms(44),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: vs(40),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: ms(40),
  },
  sideButton: {
    width: ms(44),
    height: ms(44),
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonOuter: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(40),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: ms(64),
    height: ms(64),
    borderRadius: ms(32),
    backgroundColor: colors.primary,
  },
});