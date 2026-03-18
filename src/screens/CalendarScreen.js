import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { getZoneConfig, DAY_LABELS } from '../lib/reptrak';

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
  viewToggle: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center'
  },
  toggleButtonActive: {
    backgroundColor: 'rgba(136, 239, 255, 0.2)',
    borderColor: 'rgba(136, 239, 255, 0.5)'
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)'
  },
  toggleTextActive: {
    color: '#88efff',
    fontWeight: '600'
  },
  cellGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  monthCell: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 8,
    padding: 8,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cellDay: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)'
  },
  cellPercent: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff'
  }
});

export default function CalendarScreen({ user, onUserChange }) {
  const [viewMode, setViewMode] = useState(user.calendarView || 'month');

  const handleCellPress = (dayIndex) => {
    onUserChange({
      ...user,
      currentDay: dayIndex,
      calendarView: viewMode
    });
  };

  const handleViewChange = (newView) => {
    onUserChange({
      ...user,
      calendarView: newView
    });
    setViewMode(newView);
  };

  const selectedDayIndex = user.currentDay || 0;
  let displayDays = [];
  let dayLabels = [];

  if (viewMode === 'week') {
    const weekStart = Math.floor(selectedDayIndex / 7) * 7;
    displayDays = user.month.slice(weekStart, weekStart + 7);
    dayLabels = DAY_LABELS;
  } else if (viewMode === 'day') {
    displayDays = [user.month[selectedDayIndex] || 0];
    dayLabels = ['Today'];
  } else {
    displayDays = user.month;
    dayLabels = user.month.map((_, i) => String(i + 1));
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        <Text style={styles.title}>Calendar</Text>

        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'day' && styles.toggleButtonActive]}
            onPress={() => handleViewChange('day')}
          >
            <Text style={[styles.toggleText, viewMode === 'day' && styles.toggleTextActive]}>
              Day
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'week' && styles.toggleButtonActive]}
            onPress={() => handleViewChange('week')}
          >
            <Text style={[styles.toggleText, viewMode === 'week' && styles.toggleTextActive]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'month' && styles.toggleButtonActive]}
            onPress={() => handleViewChange('month')}
          >
            <Text style={[styles.toggleText, viewMode === 'month' && styles.toggleTextActive]}>
              Month
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cellGrid}>
          {displayDays.map((percentValue, index) => {
            const actualIndex = viewMode === 'week'
              ? Math.floor(selectedDayIndex / 7) * 7 + index
              : viewMode === 'day'
                ? selectedDayIndex
                : index;

            const zoneConfig = getZoneConfig(percentValue);
            const isSelected = actualIndex === selectedDayIndex;

            return (
              <TouchableOpacity
                key={`${viewMode}-${actualIndex}`}
                style={[
                  styles.monthCell,
                  {
                    backgroundColor: zoneConfig.lightColor,
                    opacity: isSelected ? 1 : 0.7,
                    borderWidth: isSelected ? 2 : 1,
                    borderColor: isSelected ? zoneConfig.color : `${zoneConfig.color}40`
                  }
                ]}
                onPress={() => handleCellPress(actualIndex)}
              >
                <Text style={styles.cellDay}>
                  {dayLabels[index]}
                </Text>
                <Text style={styles.cellPercent}>{percentValue}%</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
