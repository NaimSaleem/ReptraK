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
import { persistUser, syncDerivedState, isOnboarded } from '../lib/reptrak';
import { GlassButton } from '../components/GlassButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1220',
    paddingHorizontal: 16
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginVertical: 24,
    textAlign: 'center'
  },
  subheader: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 16,
    textAlign: 'center'
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 12
  },
  input: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500'
  },
  label: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8
  },
  optionContainer: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    marginVertical: 8
  },
  optionButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  optionButtonActive: {
    backgroundColor: 'rgba(136, 239, 255, 0.2)',
    borderColor: 'rgba(136, 239, 255, 0.5)'
  },
  optionText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '500'
  },
  optionTextActive: {
    color: '#88efff',
    fontWeight: '600'
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

export default function OnboardingScreen({ user, setUser }) {
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
    setUser(syncDerivedState(updatedUser));
    persistUser(updatedUser);
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
      habit: nextHabit,
      activities: [
        { ...user.activities[0], name: nextHabit },
        ...user.activities.slice(1)
      ]
    };
    setUser(syncDerivedState(updatedUser));
    persistUser(updatedUser);
    setStep(3);
  };

  const handleSaveFrequency = () => {
    const nextFrequency = Number(frequencyInput) || Number(selectedFrequency);
    if (!nextFrequency) {
      Alert.alert('Please select a frequency');
      return;
    }
    const updatedUser = {
      ...user,
      frequency: nextFrequency,
      activities: [
        { ...user.activities[0], targetCount: nextFrequency },
        ...user.activities.slice(1)
      ]
    };
    setUser(syncDerivedState(updatedUser));
    persistUser(updatedUser);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {step === 1 && (
          <>
            <Text style={styles.header}>Welcome to ReptraK</Text>
            <Text style={styles.subheader}>Build habits in a polished, glossy system</Text>
            <Text style={styles.label}>What's your name?</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type your name..."
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                value={nameInput}
                onChangeText={setNameInput}
              />
            </View>
            <GlassButton title="Continue" onPress={handleSaveName} />
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.header}>Pick your primary habit</Text>
            <Text style={styles.subheader}>Or create a custom one</Text>
            <Text style={styles.label}>Popular habits:</Text>
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
            <Text style={styles.label}>Or enter a custom habit:</Text>
            <View style={styles.inputContainer}>
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
            </View>
            <GlassButton title="Continue" onPress={handleSaveHabit} />
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.header}>How often per week?</Text>
            <Text style={styles.subheader}>Target frequency for your habit</Text>
            <Text style={styles.label}>Select frequency:</Text>
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
            <GlassButton title="Start Tracking" onPress={handleSaveFrequency} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
