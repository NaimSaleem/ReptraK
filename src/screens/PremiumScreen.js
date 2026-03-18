import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity
} from 'react-native';
import { getPremiumInsights } from '../lib/reptrak';
import { AmbientGlow } from '../components/AmbientGlow';
import { FadeInView } from '../components/FadeInView';
import { GlassButton } from '../components/GlassButton';
import { GlassSurface } from '../components/GlassSurface';
import { glass } from '../theme/glass';
import { layout } from '../theme/layout';
import { THEMES } from '../theme/palette';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1a46'
  },
  scrollContent: {
    paddingHorizontal: layout.appHorizontalPadding,
    paddingVertical: layout.appVerticalPadding,
    paddingBottom: 136
  },
  title: {
    fontSize: 33,
    lineHeight: 36,
    letterSpacing: -1,
    fontWeight: '800',
    color: glass.colors.textMain,
    marginBottom: 14
  },
  subtitle: {
    fontSize: 14,
    color: glass.colors.textSoft,
    marginBottom: 16,
    lineHeight: 21
  },
  featureCard: {
    padding: 16,
    marginBottom: 12,
    overflow: 'hidden'
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: glass.colors.textMain,
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
    fontWeight: '700',
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
    fontWeight: '700',
    color: '#ffbc48'
  },
  featureDescription: {
    fontSize: 13,
    color: glass.colors.textSoft,
    lineHeight: 18
  },
  pricingSection: {
    marginTop: 8,
    padding: 18,
    overflow: 'hidden'
  },
  pricingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#88efff',
    marginBottom: 4
  },
  pricingCopy: {
    fontSize: 13,
    color: glass.colors.textSoft,
    marginBottom: 16,
    lineHeight: 20
  },
  tierGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8
  },
  priceBox: {
    flex: 1,
    backgroundColor: glass.colors.panel,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: glass.colors.borderSoft
  },
  priceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: glass.colors.textMain,
    marginBottom: 2
  },
  priceAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#88efff'
  },
  priceFoot: {
    fontSize: 11,
    color: glass.colors.textSoft
  },
  insightGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    marginBottom: 8
  },
  insightCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: glass.colors.borderSoft,
    backgroundColor: glass.colors.panel,
    padding: 10
  },
  insightLabel: {
    fontSize: 11,
    color: glass.colors.textSoft
  },
  insightValue: {
    marginTop: 3,
    fontSize: 16,
    fontWeight: '800',
    color: glass.colors.textMain
  },
  themeTitle: {
    marginTop: 16,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '700',
    color: glass.colors.textMain
  },
  themeGrid: {
    flexDirection: 'row',
    gap: 10
  },
  themeCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: glass.colors.borderSoft,
    padding: 10
  },
  themeSwatch: {
    width: '100%',
    height: 28,
    borderRadius: 8,
    marginBottom: 8
  },
  themeName: {
    fontSize: 12,
    color: glass.colors.textMain,
    fontWeight: '700'
  },
  themeStatus: {
    marginTop: 2,
    fontSize: 10,
    color: glass.colors.textSoft
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
    description: 'Detailed analysis comparing your best and weakest periods',
    isPremium: true
  },
  {
    title: 'Theme switching',
    description: 'Change visual themes without losing your data or progress',
    isPremium: true
  },
  {
    title: 'Sick/Travel void days',
    description: 'Exclude disrupted days from streak and trend calculations',
    isPremium: true
  }
];

export default function PremiumScreen({ user, onUserChange, theme }) {
  const insights = getPremiumInsights(user);

  const handleSubscribe = () => {
    onUserChange({ ...user, premium: true });
    Alert.alert('Premium Active', 'Unlocked immediately for showcase mode.');
  };

  const applyTheme = (themeId) => {
    if (!user.premium) {
      Alert.alert('Premium only', 'Unlock Premium first to switch themes.');
      return;
    }
    onUserChange({ ...user, theme: themeId });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme?.bgBase || '#1d1a46' }]}>
      <AmbientGlow theme={theme} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FadeInView>
          <Text style={styles.title}>Premium</Text>
          <Text style={styles.subtitle}>
            Free stays focused on daily tracking. Premium adds compare-and-contrast insights, trend detail, and deeper coaching.
          </Text>
        </FadeInView>

        {FEATURES.map((feature, index) => (
          <FadeInView key={feature.title} delay={60 + (index * 50)}>
            <GlassSurface style={styles.featureCard} radius={glass.radius.lg} fillColor={glass.colors.panel}>
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
            </GlassSurface>
          </FadeInView>
        ))}

        <FadeInView delay={380}>
          <GlassSurface
            style={styles.pricingSection}
            radius={glass.radius.xl}
            fillColor={glass.colors.panelStrong}
            accentColor={theme?.accentStrong || glass.colors.accentStrong}
            borderColor='rgba(136, 239, 255, 0.35)'
          >
            <Text style={styles.pricingTitle}>Upgrade to Premium</Text>
            <Text style={styles.pricingCopy}>
              Unlock advanced analytics, weekly insights, and detailed progress tracking.
            </Text>

            <View style={styles.tierGrid}>
              <View style={styles.priceBox}>
                <Text style={styles.priceTitle}>Intro Offer</Text>
                <Text style={styles.priceAmount}>$2.99</Text>
                <Text style={styles.priceFoot}>First 30 days</Text>
              </View>
              <View style={styles.priceBox}>
                <Text style={styles.priceTitle}>Monthly</Text>
                <Text style={styles.priceAmount}>$5.99</Text>
                <Text style={styles.priceFoot}>After intro period</Text>
              </View>
            </View>

            <View style={styles.insightGrid}>
              <View style={styles.insightCard}>
                <Text style={styles.insightLabel}>Week Avg</Text>
                <Text style={styles.insightValue}>{insights.weekAvg}%</Text>
              </View>
              <View style={styles.insightCard}>
                <Text style={styles.insightLabel}>Month Avg</Text>
                <Text style={styles.insightValue}>{insights.monthAvg}%</Text>
              </View>
              <View style={styles.insightCard}>
                <Text style={styles.insightLabel}>Trend</Text>
                <Text style={styles.insightValue}>{insights.trend >= 0 ? '+' : ''}{insights.trend}</Text>
              </View>
            </View>

            <Text style={styles.themeTitle}>Premium themes</Text>
            <View style={styles.themeGrid}>
              {Object.values(THEMES).map((themeOption) => (
                <TouchableOpacity
                  key={themeOption.id}
                  style={[
                    styles.themeCard,
                    user.theme === themeOption.id && {
                      borderColor: themeOption.accent,
                      backgroundColor: `${themeOption.accent}20`
                    }
                  ]}
                  onPress={() => applyTheme(themeOption.id)}
                >
                  <View style={[styles.themeSwatch, { backgroundColor: themeOption.bgBase }]} />
                  <Text style={styles.themeName}>{themeOption.label}</Text>
                  <Text style={styles.themeStatus}>
                    {user.theme === themeOption.id ? 'Active' : 'Tap to apply'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <GlassButton
              title={user.premium ? 'Premium Active' : 'Subscribe Now'}
              onPress={handleSubscribe}
            />
          </GlassSurface>
        </FadeInView>
      </ScrollView>
    </SafeAreaView>
  );
}
