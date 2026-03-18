import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { getZoneConfig, DAY_LABELS, getLogDayIndex, isVoidDay, toggleVoidDay } from '../lib/reptrak';
import { AmbientGlow } from '../components/AmbientGlow';
import { GlassButton } from '../components/GlassButton';
import { glass } from '../theme/glass';
import { layout } from '../theme/layout';

const CELL_GAP = 8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1a46'
  },
  scrollContent: {
    paddingHorizontal: layout.appHorizontalPadding,
    paddingVertical: layout.appVerticalPadding,
    paddingBottom: 122
  },
  topRow: {
    marginBottom: 14
  },
  title: {
    fontSize: 33,
    lineHeight: 36,
    letterSpacing: -1,
    fontWeight: '800',
    color: glass.colors.textMain
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: glass.colors.textSoft
  },
  heroCard: {
    backgroundColor: glass.colors.panelStrong,
    borderRadius: glass.radius.xl,
    borderWidth: 1,
    borderColor: glass.colors.borderSoft,
    padding: layout.cardPadding,
    marginBottom: layout.sectionGap,
    overflow: 'hidden',
    ...glass.shadow.soft
  },
  heroGloss: {
    position: 'absolute',
    left: 2,
    right: 2,
    top: 2,
    height: '35%',
    borderTopLeftRadius: glass.radius.xl,
    borderTopRightRadius: glass.radius.xl,
    backgroundColor: glass.colors.glare
  },
  cardKickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  cardKicker: {
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: '800',
    color: glass.colors.textSoft
  },
  cardHeading: {
    fontSize: 35,
    lineHeight: 38,
    letterSpacing: -1.1,
    fontWeight: '700',
    color: glass.colors.textMain,
    marginBottom: 10
  },
  viewToggle: {
    flexDirection: 'row',
    gap: 10
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: glass.colors.buttonSecondaryBottom,
    borderWidth: 1,
    borderColor: glass.colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  toggleButtonActive: {
    backgroundColor: glass.colors.buttonPrimaryBottom,
    borderColor: 'rgba(156, 241, 255, 0.6)'
  },
  toggleGloss: {
    position: 'absolute',
    left: 1,
    right: 1,
    top: 1,
    height: '56%',
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    backgroundColor: glass.colors.buttonSecondaryTop
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '700',
    color: glass.colors.textSoft
  },
  toggleTextActive: {
    color: '#13203e',
    fontWeight: '700'
  },
  strip: {
    flexDirection: 'row',
    gap: CELL_GAP,
    marginTop: 14
  },
  stripCell: {
    flex: 1,
    minHeight: 74,
    borderRadius: 17,
    paddingVertical: 9,
    paddingHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    overflow: 'hidden'
  },
  stripCellGloss: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    height: '44%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.22)'
  },
  stripSelected: {
    borderWidth: 2
  },
  stripDay: {
    fontSize: 11,
    letterSpacing: 0.4,
    fontWeight: '700',
    color: glass.colors.textSoft
  },
  stripPercent: {
    fontSize: 26,
    lineHeight: 29,
    letterSpacing: -0.7,
    fontWeight: '800',
    color: glass.colors.textMain
  },
  gridCard: {
    backgroundColor: glass.colors.panelDeep,
    borderRadius: glass.radius.xl,
    borderWidth: 1,
    borderColor: glass.colors.borderSoft,
    padding: layout.cardPadding,
    ...glass.shadow.soft
  },
  weekHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  weekHeaderCell: {
    flex: 1,
    alignItems: 'center'
  },
  weekHeaderText: {
    fontSize: 10,
    letterSpacing: 0.5,
    color: glass.colors.textSoft,
    fontWeight: '700'
  },
  cellGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -(CELL_GAP / 2)
  },
  monthCell: {
    width: '14.2857%',
    aspectRatio: 1,
    paddingHorizontal: CELL_GAP / 2,
    paddingVertical: CELL_GAP / 2
  },
  monthCellDayMode: {
    width: '100%',
    aspectRatio: 2.8
  },
  monthCellInner: {
    flex: 1,
    borderRadius: 14,
    padding: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden'
  },
  monthCellGloss: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    height: '48%',
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.2)'
  },
  monthCellSelected: {
    borderWidth: 2
  },
  cellDay: {
    fontSize: 10,
    fontWeight: '600',
    color: glass.colors.textSoft
  },
  cellPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: glass.colors.textMain
  },
  detailCard: {
    marginTop: 12,
    backgroundColor: glass.colors.panel,
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    ...glass.shadow.soft
  },
  detailTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: glass.colors.textMain,
    marginBottom: 4
  },
  detailCopy: {
    fontSize: 13,
    lineHeight: 19,
    color: glass.colors.textSoft
  }
});

export default function CalendarScreen({ user, onUserChange, theme }) {
  const viewMode = user.calendarView || 'month';
  const monthLength = user.month.length || 28;
  const selectedDayIndex = Math.min(Math.max(user.currentDay || 0, 0), monthLength - 1);
  const selectedDayLabel = viewMode === 'week'
    ? DAY_LABELS[selectedDayIndex % 7]
    : `Day ${selectedDayIndex + 1}`;

  const weekStart = Math.floor(selectedDayIndex / 7) * 7;
  const logDayIndex = getLogDayIndex(user);
  const weekDays = user.month.slice(weekStart, weekStart + 7);
  const greenDays = weekDays.filter((value) => value > 75).length;
  const selectedPercent = user.month[selectedDayIndex] || 0;
  const selectedZone = getZoneConfig(selectedPercent);
  const selectedIsVoid = isVoidDay(user, selectedDayIndex);

  const { displayDays, dayLabels } = useMemo(() => {
    if (viewMode === 'week') {
      return {
        displayDays: weekDays,
        dayLabels: DAY_LABELS
      };
    }
    if (viewMode === 'day') {
      return {
        displayDays: [user.month[selectedDayIndex] || 0],
        dayLabels: ['Today']
      };
    }
    return {
      displayDays: user.month,
      dayLabels: user.month.map((_, index) => String(index + 1))
    };
  }, [selectedDayIndex, user.month, viewMode, weekDays]);

  const handleCellPress = (dayIndex) => {
    onUserChange({
      ...user,
      currentDay: Math.min(Math.max(dayIndex, 0), monthLength - 1)
    });
  };

  const handleViewChange = (newView) => {
    onUserChange({
      ...user,
      calendarView: newView
    });
  };

  const handleToggleVoidDay = () => {
    const next = toggleVoidDay(user, selectedDayIndex);
    onUserChange(next);
  };

  const getDetailCopy = () => {
    if (selectedPercent >= 100) {
      return 'Bright blue day. You hit full completion across count and optional time goals.';
    }
    if (selectedPercent > 75) {
      return 'Strong green day. You are in the high-consistency range.';
    }
    if (selectedPercent >= 50) {
      return 'Yellow day. Momentum is real, but there is still room to close.';
    }
    return 'Red-orange day. Start with one activity and build momentum from there.';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme?.bgBase || '#1d1a46' }]}>
      <AmbientGlow theme={theme} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topRow}>
          <Text style={styles.title}>Calendar</Text>
          <Text style={styles.subtitle}>Month, week, and day views</Text>
        </View>

        <View style={styles.heroCard}>
          <View pointerEvents="none" style={styles.heroGloss} />
          <View style={styles.cardKickerRow}>
            <Text style={styles.cardKicker}>BASIC TRACKING</Text>
            <Text style={styles.cardKicker}>FREE FEATURE</Text>
          </View>
          <Text style={styles.cardHeading}>Completion map</Text>

          <View style={styles.viewToggle}>
            {['month', 'week', 'day'].map((mode) => {
              const active = viewMode === mode;
              return (
                <TouchableOpacity
                  key={mode}
                  style={[styles.toggleButton, active && styles.toggleButtonActive]}
                  onPress={() => handleViewChange(mode)}
                >
                  <View pointerEvents="none" style={styles.toggleGloss} />
                  <Text style={[styles.toggleText, active && styles.toggleTextActive]}>
                    {mode[0].toUpperCase() + mode.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.strip}>
            {DAY_LABELS.map((day, index) => {
              const actualIndex = weekStart + index;
              const value = user.month[actualIndex] || 0;
              const zoneConfig = getZoneConfig(value);
              const isSelected = actualIndex === selectedDayIndex;

              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.stripCell,
                    {
                      backgroundColor: `${zoneConfig.color}30`,
                      borderColor: isSelected ? zoneConfig.color : `${zoneConfig.color}55`
                    },
                    isSelected && styles.stripSelected
                  ]}
                  onPress={() => handleCellPress(actualIndex)}
                >
                  <View pointerEvents="none" style={styles.stripCellGloss} />
                  <Text style={styles.stripDay}>{day}</Text>
                  <Text style={styles.stripPercent}>{value}%</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.gridCard}>
          {viewMode !== 'day' && (
            <View style={styles.weekHeaderRow}>
              {DAY_LABELS.map((day) => (
                <View key={day} style={styles.weekHeaderCell}>
                  <Text style={styles.weekHeaderText}>{day}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.cellGrid}>
            {displayDays.map((percentValue, index) => {
              const actualIndex = viewMode === 'week'
                ? weekStart + index
                : viewMode === 'day'
                  ? selectedDayIndex
                  : index;

              const zoneConfig = getZoneConfig(percentValue);
              const isSelected = actualIndex === selectedDayIndex;

              return (
                <TouchableOpacity
                  key={`${viewMode}-${actualIndex}`}
                  style={[styles.monthCell, viewMode === 'day' && styles.monthCellDayMode]}
                  onPress={() => handleCellPress(actualIndex)}
                >
                  <View
                    style={[
                      styles.monthCellInner,
                      {
                        backgroundColor: `${zoneConfig.color}35`,
                        opacity: isSelected ? 1 : 0.75,
                        borderColor: isSelected ? zoneConfig.color : `${zoneConfig.color}45`
                      },
                      isSelected && styles.monthCellSelected
                    ]}
                  >
                    <View pointerEvents="none" style={styles.monthCellGloss} />
                    <Text style={styles.cellDay}>{dayLabels[index]}</Text>
                    <Text style={styles.cellPercent}>{percentValue}%</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View
          style={[
            styles.detailCard,
            {
              borderColor: `${selectedZone.color}66`,
              backgroundColor: `${selectedZone.color}1f`
            }
          ]}
        >
          <Text style={styles.detailTitle}>
            {selectedDayLabel} · {selectedPercent}%
          </Text>
          <Text style={styles.detailCopy}>
            {selectedIsVoid
              ? 'This day is excluded from streak and average calculations.'
              : `${getDetailCopy()} This week has ${greenDays}/7 green days.`}
          </Text>
          <Text style={[styles.detailCopy, { marginTop: 6, fontSize: 12 }]}>
            Logging currently updates {DAY_LABELS[logDayIndex % 7]} (Day {logDayIndex + 1}) for showcase consistency.
          </Text>
          {user.premium && (
            <GlassButton
              title={selectedIsVoid ? 'Remove Sick/Travel Void Day' : 'Mark Sick/Travel Void Day'}
              onPress={handleToggleVoidDay}
              variant="secondary"
              style={{ marginTop: 10 }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
