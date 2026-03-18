import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import { GlassButton } from '../components/GlassButton';
import { AmbientGlow } from '../components/AmbientGlow';
import { FadeInView } from '../components/FadeInView';
import { GlassSurface } from '../components/GlassSurface';
import { OnboardingBackdrop } from '../components/OnboardingBackdrop';
import { glass } from '../theme/glass';
import { layout } from '../theme/layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1a46',
    paddingHorizontal: layout.appHorizontalPadding
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 12,
    paddingBottom: 38
  },
  shell: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    display: 'flex',
    gap: 14
  },
  hero: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 6
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 8
  },
  brandMark: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2.2,
    color: glass.colors.accentStrong,
    textTransform: 'uppercase'
  },
  header: {
    fontSize: 42,
    fontWeight: '800',
    color: glass.colors.textMain,
    letterSpacing: -1.1,
    textAlign: 'center'
  },
  subheader: {
    fontSize: 16,
    lineHeight: 22,
    color: glass.colors.textSoft,
    marginBottom: 2,
    textAlign: 'center'
  },
  card: {
    display: 'flex',
    paddingHorizontal: 14,
    paddingVertical: 16,
    gap: 10,
    overflow: 'hidden'
  },
  stepTitle: {
    color: glass.colors.textMain,
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center'
  },
  stepHint: {
    color: glass.colors.textSoft,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 2
  },
  inputContainer: {
    minHeight: 56,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginTop: 6
  },
  input: {
    color: glass.colors.textMain,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.5
  },
  label: {
    color: glass.colors.textSoft,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4
  },
  optionContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 9,
    flexWrap: 'wrap',
    marginTop: 4
  },
  optionButton: {
    display: 'flex',
    width: '31%',
    minWidth: 92,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 13,
    backgroundColor: glass.colors.panel,
    borderWidth: 1,
    borderColor: glass.colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    ...glass.shadow.soft
  },
  optionButtonActive: {
    backgroundColor: 'rgba(201, 252, 255, 0.34)',
    borderColor: 'rgba(156, 241, 255, 0.52)'
  },
  optionText: {
    color: glass.colors.textSoft,
    fontSize: 13,
    fontWeight: '600'
  },
  optionTextActive: {
    color: '#13203e',
    fontWeight: '700'
  },
  buttonSpacing: {
    marginTop: 6
  },
  footerSpacing: {
    height: 10
  }
});

const HABIT_CHOICES = [
  'Deep Work',
  'Movement',
  'Reading',
  'Learning',
  'Health',
  'Creativity'
];

const FREQUENCY_OPTIONS = [
  { label: '1x', value: '1' },
  { label: '2x', value: '2' },
  { label: '3x', value: '3' },
  { label: '4x', value: '4' },
  { label: '5x', value: '5' },
  { label: '6x', value: '6' },
  { label: '7x', value: '7' }
];

export default function OnboardingScreen({ user, onUserChange, theme }) {
  const [step, setStep] = useState(1);
  const [nameInput, setNameInput] = useState(user.name || '');
  const [habitInput, setHabitInput] = useState(user.habit || '');
  const [selectedHabit, setSelectedHabit] = useState(user.habit || 'Deep Work');
  const [frequencyInput, setFrequencyInput] = useState(user.frequency ? String(user.frequency) : '4');
  const [selectedFrequency, setSelectedFrequency] = useState(user.frequency ? String(user.frequency) : '4');

  const handleSaveName = () => {
    if (!nameInput.trim()) {
      Alert.alert('Please enter your name');
      return;
    }
    const updatedUser = {
      ...user,
      name: nameInput.trim()
    };
    onUserChange(updatedUser);
    setStep(2);
  };

  const handleSaveHabit = () => {
    const nextHabit = habitInput.trim() || selectedHabit;
    if (!nextHabit) {
      Alert.alert('Please enter or select a habit');
      return;
    }
    const updatedUser = {
      ...user,
      habit: nextHabit
    };

    if (updatedUser.activities[0]) {
      updatedUser.activities = [
        {
          ...updatedUser.activities[0],
          name: nextHabit,
          role: 'focus'
        },
        ...updatedUser.activities.slice(1).map((activity) => ({
          ...activity,
          role: 'supplementary'
        }))
      ];
    } else {
      updatedUser.activities = [
        {
          id: 'focus',
          role: 'focus',
          name: nextHabit,
          targetCount: 1,
          loggedCount: 0,
          timeGoal: 30,
          timeLogged: 0
        }
      ];
    }

    onUserChange(updatedUser);
    setStep(3);
  };

  const handleSaveFrequency = () => {
    const nextFrequency = Number(frequencyInput) || Number(selectedFrequency);
    if (!nextFrequency) {
      Alert.alert('Please select a frequency');
      return;
    }

    const currentDay = user.currentDay ?? 0;
    const updatedUser = {
      ...user,
      frequency: nextFrequency,
      theme: user.theme || 'aqua',
      logDayIndex: currentDay,
      activities: [
        {
          ...user.activities[0],
          role: 'focus',
          targetCount: nextFrequency
        },
        ...user.activities.slice(1).map((activity) => ({ ...activity, role: 'supplementary' }))
      ]
    };
    onUserChange(updatedUser);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme?.bgBase || '#1d1a46' }]}>
      <AmbientGlow theme={theme} mode="onboarding" />
      <OnboardingBackdrop theme={theme} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.shell}>
          <FadeInView style={styles.hero}>
            <View style={styles.titleRow}>
              <Text style={styles.brandMark}>ReptraK</Text>
            </View>
            <Text style={styles.header}>
              {step === 1 ? 'Welcome' : step === 2 ? 'Focus Habit' : 'Weekly Target'}
            </Text>
            <Text style={styles.subheader}>
              {step === 1
                ? 'Build habits in a polished, glossy system'
                : step === 2
                  ? 'Master one main habit and keep momentum'
                  : 'Choose a cadence you can sustain'}
            </Text>
          </FadeInView>

          {step === 1 && (
            <FadeInView delay={80}>
              <GlassSurface style={styles.card} radius={24} fillColor={glass.colors.panelDeep}>
                <Text style={styles.stepTitle}>Let&apos;s set up your account</Text>
                <Text style={styles.stepHint}>Start with your display name.</Text>
                <Text style={styles.label}>What&apos;s your name?</Text>
                <GlassSurface style={styles.inputContainer} radius={16} fillColor={glass.colors.panel}>
                  <TextInput
                    style={styles.input}
                    placeholder="Type your name..."
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    value={nameInput}
                    onChangeText={setNameInput}
                  />
                </GlassSurface>
                <GlassButton title="Continue" onPress={handleSaveName} style={styles.buttonSpacing} />
              </GlassSurface>
            </FadeInView>
          )}

          {step === 2 && (
            <FadeInView delay={80}>
              <GlassSurface style={styles.card} radius={24} fillColor={glass.colors.panelDeep}>
                <Text style={styles.stepTitle}>Choose your focus</Text>
                <Text style={styles.stepHint}>This becomes your primary mastery track.</Text>
                <Text style={styles.label}>Popular habits</Text>
                <View style={styles.optionContainer}>
                  {HABIT_CHOICES.map((habit) => (
                    <TouchableOpacity
                      key={habit}
                      style={[
                        styles.optionButton,
                        selectedHabit === habit && styles.optionButtonActive
                      ]}
                      onPress={() => {
                        setSelectedHabit(habit);
                        setHabitInput('');
                      }}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedHabit === habit && styles.optionTextActive
                        ]}
                      >
                        {habit}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.label}>Or custom habit</Text>
                <GlassSurface style={styles.inputContainer} radius={16} fillColor={glass.colors.panel}>
                  <TextInput
                    style={styles.input}
                    placeholder="Custom habit..."
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    value={habitInput}
                    onChangeText={(text) => {
                      setHabitInput(text);
                      if (text) setSelectedHabit(text);
                    }}
                  />
                </GlassSurface>
                <GlassButton title="Continue" onPress={handleSaveHabit} style={styles.buttonSpacing} />
              </GlassSurface>
            </FadeInView>
          )}

          {step === 3 && (
            <FadeInView delay={80}>
              <GlassSurface style={styles.card} radius={24} fillColor={glass.colors.panelDeep}>
                <Text style={styles.stepTitle}>Set weekly target</Text>
                <Text style={styles.stepHint}>Adjust anytime in settings later.</Text>
                <Text style={styles.label}>How many sessions per week?</Text>
                <View style={styles.optionContainer}>
                  {FREQUENCY_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionButton,
                        selectedFrequency === option.value && styles.optionButtonActive
                      ]}
                      onPress={() => {
                        setSelectedFrequency(option.value);
                        setFrequencyInput('');
                      }}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedFrequency === option.value && styles.optionTextActive
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <GlassButton title="Start Tracking" onPress={handleSaveFrequency} style={styles.buttonSpacing} />
              </GlassSurface>
            </FadeInView>
          )}
          <View style={styles.footerSpacing} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
