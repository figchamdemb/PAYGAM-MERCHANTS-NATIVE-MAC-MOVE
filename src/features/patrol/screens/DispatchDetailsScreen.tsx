import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Platform,
  Alert,
  Animated,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome6';

const { width, height } = Dimensions.get('window');

// Types
type DispatchDetailsScreenNavigationProp = StackNavigationProp<any>;
type DispatchDetailsScreenRouteProp = RouteProp<{
  params: {
    alert: {
      id: string;
      title: string;
      location: string;
      description: string;
      priority: 'URGENT' | 'HIGH' | 'MEDIUM';
      timeAgo: string;
      type: string;
    };
  };
}, 'params'>;

interface MarkerPosition {
  top: string;
  left: string;
}

const DispatchDetailsScreen: React.FC = () => {
  const navigation = useNavigation<DispatchDetailsScreenNavigationProp>();
  const route = useRoute<DispatchDetailsScreenRouteProp>();
  const { alert } = route.params;

  // State
  const [isAccepted, setIsAccepted] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  const [patrolPosition, setPatrolPosition] = useState<MarkerPosition>({
    top: '25%',
    left: '25%',
  });

  // Animation for sliding up bottom sheet
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide up animation
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // Handlers
  const handleClose = () => {
    navigation.goBack();
  };

  const handleAcceptNow = () => {
    setIsAccepted(true);
    setShowRoute(true);

    // Simulate patrol moving to destination
    setTimeout(() => {
      setPatrolPosition({
        top: '63%',
        left: '50%',
      });
    }, 500);

    Alert.alert('Dispatch Accepted', 'Navigating to destination...');
  };

  const handleAcceptForLater = () => {
    Alert.alert('Queued', 'This dispatch has been added to your queue.');
    navigation.goBack();
  };

  const getPriorityColor = () => {
    switch (alert.priority) {
      case 'URGENT':
        return '#DC2626';
      case 'HIGH':
        return '#EA580C';
      case 'MEDIUM':
        return '#F59E0B';
      default:
        return '#64748B';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.backButton}>
          <Icon name="chevron-left" size={18} color="#FFFFFF" solid />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dispatch Request</Text>
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        {/* Map Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
            <Text style={styles.legendText}>Patrol Team</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#DC2626' }]} />
            <Text style={styles.legendText}>Incident</Text>
          </View>
        </View>

        {/* Distance Card */}
        <View style={styles.distanceCard}>
          <Text style={styles.distanceLabel}>DISTANCE</Text>
          <Text style={styles.distanceValue}>0.3 miles (approx. 2 min)</Text>
        </View>

        {/* Simple Map Background */}
        <View style={styles.mapBackground}>
          {/* Grid lines */}
          <View style={styles.gridContainer}>
            {[...Array(20)].map((_, i) => (
              <View key={`h-${i}`} style={[styles.gridLine, { top: `${i * 5}%` }]} />
            ))}
            {[...Array(20)].map((_, i) => (
              <View key={`v-${i}`} style={[styles.gridLineVertical, { left: `${i * 5}%` }]} />
            ))}
          </View>

          {/* Roads */}
          <View style={[styles.road, styles.roadVertical, { left: '25%' }]} />
          <View style={[styles.road, styles.roadVertical, { left: '50%' }]} />
          <View style={[styles.road, styles.roadVertical, { left: '75%' }]} />
          <View style={[styles.road, styles.roadHorizontal, { top: '50%' }]} />

          {/* Park Area */}
          <View style={styles.parkArea} />

          {/* Route Line (shows after accepting) */}
          {showRoute && (
            <View style={styles.routeLine} />
          )}
        </View>

        {/* Patrol Marker (Animated) */}
        <Animated.View
          style={[
            styles.markerContainer,
            {
              top: patrolPosition.top,
              left: patrolPosition.left,
              transform: [{ translateX: -20 }, { translateY: -20 }],
            },
          ]}
        >
          <View style={styles.patrolMarker}>
            <Icon name="car-side" size={14} color="#3B82F6" solid />
          </View>
          <View style={styles.markerLabel}>
            <Text style={styles.markerLabelText}>You</Text>
          </View>
        </Animated.View>

        {/* Incident Marker */}
        <View style={[styles.markerContainer, { top: '63%', left: '50%' }]}>
          {/* Pulse rings */}
          <View style={styles.pulseRing1} />
          <View style={styles.pulseRing2} />
          <View style={styles.incidentMarker}>
            <Icon name="exclamation" size={16} color="#DC2626" solid />
          </View>
          <View style={[styles.markerLabel, styles.incidentLabel]}>
            <Text style={[styles.markerLabelText, { color: '#DC2626' }]}>Incident</Text>
          </View>
        </View>
      </View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [400, 0],
                }),
              },
            ],
          },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Status Header */}
          <View style={styles.statusHeader}>
            <View style={[styles.statusDot, { backgroundColor: getPriorityColor() }]} />
            <Text style={styles.statusTitle}>EMERGENCY TASK DETAILS</Text>
          </View>

          {/* Location Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoIconContainer}>
              <Icon name="map-location-dot" size={18} color="#DC2626" solid />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>LOCATION</Text>
              <Text style={styles.infoValue}>{alert.location}</Text>
              <Text style={styles.infoSubtext}>Near North Fountain Entrance</Text>
            </View>
          </View>

          {/* Dispatch Message */}
          <View style={styles.messageSection}>
            <Text style={styles.messageLabel}>DISPATCH MESSAGE</Text>
            <View style={styles.messageBox}>
              <Icon name="quote-left" size={10} color="#CBD5E1" solid />
              <Text style={styles.messageText}>{alert.description}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          {!isAccepted ? (
            <View style={styles.actionsInitial}>
              <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptNow}>
                <Icon name="check-circle" size={16} color="#FFFFFF" solid />
                <Text style={styles.acceptButtonText}>Accept Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.queueButton} onPress={handleAcceptForLater}>
                <Text style={styles.queueButtonText}>Accept for Next Job</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actionsAccepted}>
              <View style={styles.navigatingButton}>
                <Icon name="location-arrow" size={16} color="#FFFFFF" solid />
                <Text style={styles.navigatingText}>Navigating...</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Icon name="xmark" size={16} color="#64748B" solid />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 12,
  },
  liveBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F0F4F8',
  },
  legend: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 8,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
  },
  distanceCard: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 12,
    maxWidth: 160,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  distanceLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  distanceValue: {
    fontSize: 10,
    color: '#64748B',
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  gridContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  gridLineVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#E2E8F0',
  },
  road: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  roadVertical: {
    width: 25,
    height: '100%',
  },
  roadHorizontal: {
    height: 25,
    width: '100%',
  },
  parkArea: {
    position: 'absolute',
    top: '53%',
    left: '55%',
    width: '40%',
    height: '22%',
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 4,
  },
  routeLine: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: 5,
    height: '38%',
    backgroundColor: '#4F46E5',
    opacity: 0.8,
    borderRadius: 2.5,
  },
  markerContainer: {
    position: 'absolute',
    zIndex: 20,
  },
  patrolMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  incidentMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  pulseRing1: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FCA5A5',
    opacity: 0.2,
  },
  pulseRing2: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FCA5A5',
    opacity: 0.1,
  },
  markerLabel: {
    position: 'absolute',
    top: 46,
    left: '50%',
    transform: [{ translateX: -20 }],
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  incidentLabel: {
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  markerLabelText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#1E293B',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: height * 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 20,
  },
  handle: {
    width: 48,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
    letterSpacing: 0.5,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  infoSubtext: {
    fontSize: 12,
    color: '#64748B',
  },
  messageSection: {
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  messageLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#94A3B8',
    marginBottom: 8,
  },
  messageBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  messageText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    marginTop: 4,
  },
  actionsInitial: {
    gap: 12,
  },
  acceptButton: {
    backgroundColor: '#1E40AF',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#93C5FD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  queueButton: {
    borderWidth: 2,
    borderColor: '#1E40AF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  queueButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
  },
  actionsAccepted: {
    flexDirection: 'row',
    gap: 12,
  },
  navigatingButton: {
    flex: 1,
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#4ADE80',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  navigatingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 56,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DispatchDetailsScreen;
