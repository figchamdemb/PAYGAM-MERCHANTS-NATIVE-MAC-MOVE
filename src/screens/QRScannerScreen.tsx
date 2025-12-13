/**
 * ✅ PATROL APP - QR CODE SCANNER SCREEN
 * Scans QR codes, barcodes on IDs, permits, licenses
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Rect } from 'react-native-svg';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';

const { width, height } = Dimensions.get('window');
const SCAN_AREA_SIZE = width * 0.7;

// Icons
const BackIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </Svg>
);

const FlashIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M7 2v11h3v9l7-12h-4l4-8z" />
  </Svg>
);

const QRFrameIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
  </Svg>
);

// Department color configurations
const departmentConfigs: Record<string, { primary: string; secondary: string; name: string }> = {
  police: { primary: '#3B82F6', secondary: '#1D4ED8', name: 'Police' },
  fire: { primary: '#EF4444', secondary: '#DC2626', name: 'Fire' },
  ambulance: { primary: '#10B981', secondary: '#059669', name: 'Medical' },
  immigration: { primary: '#1E40AF', secondary: '#1E3A8A', name: 'Immigration' },
};

const QRScannerScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const department = route.params?.department || 'police';
  const config = departmentConfigs[department] || departmentConfigs.police;

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flashOn, setFlashOn] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const device = useCameraDevice('back');

  // Request camera permission
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Code scanner
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'ean-8', 'code-128', 'code-39', 'code-93', 'codabar', 'itf', 'upc-a', 'upc-e', 'pdf-417', 'aztec', 'data-matrix'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && !isProcessing) {
        setIsProcessing(true);
        const code = codes[0];
        setScannedData(code.value || '');
        
        // Show result
        Alert.alert(
          '✅ Scan Successful',
          `Type: ${code.type?.toUpperCase() || 'Unknown'}\n\nData: ${code.value || 'No data'}`,
          [
            {
              text: 'Scan Again',
              onPress: () => {
                setScannedData(null);
                setIsProcessing(false);
              },
            },
            {
              text: 'Done',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    },
  });

  // Permission loading
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#0F172A', '#1E293B', '#0F172A']} style={StyleSheet.absoluteFill} />
        <ActivityIndicator size="large" color={config.primary} />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  // Permission denied
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#0F172A', '#1E293B', '#0F172A']} style={StyleSheet.absoluteFill} />
        <Text style={styles.errorText}>Camera permission denied</Text>
        <Text style={styles.errorSubtext}>Please enable camera access in settings</Text>
        <TouchableOpacity style={[styles.retryButton, { backgroundColor: config.primary }]} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // No camera device
  if (!device) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#0F172A', '#1E293B', '#0F172A']} style={StyleSheet.absoluteFill} />
        <Text style={styles.errorText}>No camera found</Text>
        <TouchableOpacity style={[styles.retryButton, { backgroundColor: config.primary }]} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Camera View */}
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!isProcessing}
        codeScanner={codeScanner}
        torch={flashOn ? 'on' : 'off'}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <BackIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan Document</Text>
          <TouchableOpacity 
            onPress={() => setFlashOn(!flashOn)} 
            style={[styles.flashButton, flashOn && { backgroundColor: config.primary }]}
          >
            <FlashIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Scan Area Mask */}
        <View style={styles.scanAreaContainer}>
          <View style={styles.maskTop} />
          <View style={styles.maskCenter}>
            <View style={styles.maskSide} />
            <View style={styles.scanArea}>
              {/* Corner Markers */}
              <View style={[styles.corner, styles.cornerTL, { borderColor: config.primary }]} />
              <View style={[styles.corner, styles.cornerTR, { borderColor: config.primary }]} />
              <View style={[styles.corner, styles.cornerBL, { borderColor: config.primary }]} />
              <View style={[styles.corner, styles.cornerBR, { borderColor: config.primary }]} />
            </View>
            <View style={styles.maskSide} />
          </View>
          <View style={styles.maskBottom} />
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <LinearGradient colors={['rgba(15,23,42,0.9)', 'rgba(15,23,42,0.95)']} style={styles.instructionsGradient}>
            <Text style={styles.instructionsTitle}>Position document in frame</Text>
            <Text style={styles.instructionsSubtitle}>
              Scan ID cards, driver's licenses, permits, or any QR/barcode
            </Text>
            <View style={styles.supportedTypes}>
              <View style={[styles.typeTag, { borderColor: config.primary }]}>
                <Text style={[styles.typeText, { color: config.primary }]}>ID Card</Text>
              </View>
              <View style={[styles.typeTag, { borderColor: config.primary }]}>
                <Text style={[styles.typeText, { color: config.primary }]}>License</Text>
              </View>
              <View style={[styles.typeTag, { borderColor: config.primary }]}>
                <Text style={[styles.typeText, { color: config.primary }]}>Permit</Text>
              </View>
              <View style={[styles.typeTag, { borderColor: config.primary }]}>
                <Text style={[styles.typeText, { color: config.primary }]}>QR Code</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 16,
    marginTop: 16,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorSubtext: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight! + 16,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  flashButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanAreaContainer: {
    flex: 1,
  },
  maskTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  maskCenter: {
    flexDirection: 'row',
    height: SCAN_AREA_SIZE,
  },
  maskSide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scanArea: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    position: 'relative',
  },
  maskBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderWidth: 4,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  instructions: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  instructionsGradient: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  instructionsSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 16,
  },
  supportedTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default QRScannerScreen;
