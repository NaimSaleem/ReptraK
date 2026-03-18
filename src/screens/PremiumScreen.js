import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import { GlassButton } from '../components/GlassButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1220'
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1
  },
  freeTag: {
    backgroundColor: 'rgba(121, 244, 156, 0.2)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4
  },
  freeTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#79f49c'
  },
  premiumTag: {
    backgroundColor: 'rgba(255, 188, 72, 0.2)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4
  },
  premiumTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffbc48'
  },
  featureDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 18
  },
  pricingSection: {
    marginTop: 20,
    backgroundColor: 'rgba(136, 239, 255, 0.1)',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(136, 239, 255, 0.3)'
  },
  pricingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#88efff',
    marginBottom: 4
  },
  pricingCopy: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 16,
    lineHeight: 20
  },
  priceBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  priceTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2
  },
  priceAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#88efff'
  }
});

const FEATURES = [
  {
    title: 'Daily habit tracking',
    description: 'Log your daily progress across multiple habits',
    isPremium: false
  },
  {
    title: 'Weekly calendar view',
    description: 'See your week at a glance with visual completion states',
    isPremium: false
  },
  {
    title: 'Streak tracking',
    description: 'Build momentum with consecutive day streaks',
    isPremium: false
  },
  {
    title: 'Weekly compare-and-contrast',
    description: 'Detailed analysis comparing your performance across weeks',
    isPremium: true
  },
  {
    title: 'Advanced analytics',
    description: 'Deep insights into your habit patterns and trends',
    isPremium: true
  },
  {
    title: 'Custom goals',
    description: 'Set unlimited custom habits and targets',
    isPremium: true
  }
];

export default function PremiumScreen({ user, onUserChange }) {
  const handleSubscribe = () => {
    Alert.alert(
      'Premium Feature',
      'In the full app, this would connect to Stripe Checkout or RevenueCat for payment processing.\n\n' +
      'Premium benefits:\n' +
      '• Weekly compare-and-contrast positioning\n' +
      '• Detailed progress language and analytics\n' +
      '• $2.99 intro / $5.99 monthly',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Activate Premium',
          onPress: () => {
            onUserChange({ ...user, premium: true });
            Alert.alert('Success', 'Premium is now active!');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        <Text style={styles.title}>Premium</Text>

        {FEATURES.map((feature) => (
          <View key={feature.title} style={styles.featureCard}>
            <View style={styles.featureHeader}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              {feature.isPremium && user.premium && (
                <View style={styles.freeTag}>
                  <Text style={styles.freeTagText}>ACTIVE</Text>
                </View>
              )}
              {feature.isPremium && !user.premium && (
                <View style={styles.premiumTag}>
                  <Text style={styles.premiumTagText}>PREMIUM</Text>
                </View>
              )}
              {!feature.isPremium && (
                <View style={styles.freeTag}>
                  <Text style={styles.freeTagText}>FREE</Text>
                </View>
              )}
            </View>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </View>
        ))}

        <View style={styles.pricingSection}>
          <Text style={styles.pricingTitle}>Upgrade to Premium</Text>
          <Text style={styles.pricingCopy}>
            Unlock advanced analytics, weekly insights, and detailed progress tracking.
          </Text>

          <View style={styles.priceBox}>
            <Text style={styles.priceTitle}>Intro Offer</Text>
            <Text style={styles.priceAmount}>$2.99</Text>
            <Text style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.5)' }}>First 7 days</Text>
          </View>

          <View style={styles.priceBox}>
            <Text style={styles.priceTitle}>Monthly</Text>
            <Text style={styles.priceAmount}>$5.99</Text>
            <Text style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.5)' }}>After intro period</Text>
          </View>

          <GlassButton
            title={user.premium ? 'Premium Active' : 'Subscribe Now'}
            onPress={handleSubscribe}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
