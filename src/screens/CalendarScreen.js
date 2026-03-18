import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { DAY_LABELS, getZoneConfig, getLogDayIndex, isVoidDay, toggleVoidDay } from '../lib/reptrak';
import { AmbientGlow } from '../components/AmbientGlow';
import { FadeInView } from '../components/FadeInView';
import { GlassButton } from '../components/GlassButton';
import { GlassSurface } from '../components/GlassSurface';
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
    paddingBottom: 136
  },
  topRow: {
    marginBottom: 14
  },
  title: {
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -0.9,
    fontWeight: '800',
    color: glass.colors.textMain
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: glass.colors.textSoft
  },
  heroCard: {
    padding: layout.cardPadding,
    marginBottom: layout.sectionGap,
    gap: 14
  },
  cardKickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10
  },
  cardKicker: {
    fontSize: 11,
    letterSpacing: 1.6,
    fontWeight: '800',
    color: glass.colors.textSoft
  },
  cardHeading: {
    fontSize: 31,
    lineHeight: 35,
    letterSpacing: -1,
    fontWeight: '800',
    color: glass.colors.textMain
  },
  heroCopy: {
    fontSize: 13,
    lineHeight: 19,
    color: glass.colors.textSoft
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10
  },
  summaryPill: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: glass.colors.borderSoft,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  summaryLabel: {
    fontSize: 10,
    letterSpacing: 0.8,
    fontWeight: '800',
    color: glass.colors.textSoft,
    marginBottom: 4
  },
  summaryValue: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    color: glass.colors.textMain
  },
  viewToggle: {
    flexDirection: 'row',
    gap: 10
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
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
    borderColor: 'rgba(156, 241, 255, 0.58)'
  },
  toggleGloss: {
    position: 'absolute',
    left: 1,
    right: 1,
    top: 1,
    height: '54%',
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    backgroundColor: glass.colors.buttonSecondaryTop
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '800',
    color: glass.colors.textSoft
  },
  toggleTextActive: {
    color: '#13203e'
  },
  mapCard: {
    padding: layout.cardPadding
  },
  mapHeader: {
    marginBottom: 14
  },
  mapHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: glass.colors.textMain,
    marginBottom: 4
  },
  mapHint: {
    fontSize: 12,
    lineHeight: 18,
    color: glass.colors.textSoft
  },
  weekHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  weekHeaderCell: {
    flex: 1,
    alignItems: 'center'
  },
  weekHeaderText: {
    fontSize: 10,
    letterSpacing: 0.8,
    color: glass.colors.textSoft,
    fontWeight: '800'
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -(CELL_GAP / 2)
  },
  monthCell: {
    width: '14.2857%',
    paddingHorizontal: CELL_GAP / 2,
    paddingVertical: CELL_GAP / 2
  },
  monthCellInner: {
    minHeight: 58,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'space-between',
    borderWidth: 1
  },
  weekGrid: {
    flexDirection: 'row',
    gap: CELL_GAP
  },
  weekCell: {
    flex: 1,
    minHeight: 90,
    borderRadius: 18,
    paddingHorizontal: 7,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1
  },
  dayCell: {
    width: '100%',
    minHeight: 180,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 20,
    borderWidth: 1,
    justifyContent: 'space-between'
  },
  cellDay: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '800',
    color: glass.colors.textSoft
  },
  cellPercent: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    color: glass.colors.textMain
  },
  cellPercentLarge: {
    fontSize: 44,
    lineHeight: 48,
    letterSpacing: -1.5,
    fontWeight: '800',
    color: glass.colors.textMain
  },
  cellDetail: {
    fontSize: 11,
    lineHeight: 15,
    color: glass.colors.textSoft
  },
  cellVoid: {
    fontSize: 10,
    letterSpacing: 0.8,
    fontWeight: '800',
    color: 'rgba(234, 239, 247, 0.68)'
  },
  detailCard: {
    marginTop: 14,
    padding: 18,
    gap: 6
  },
  detailTitle: {
    fontSize: 23,
    lineHeight: 28,
    fontWeight: '800',
    color: glass.colors.textMain
  },
  detailCopy: {
    fontSize: 14,
    lineHeight: 21,
    color: glass.colors.textSoft
  },
  detailFoot: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 18,
    color: glass.colors.textSoft
  }
});

function getCellState({ percent, zoneConfig, selected, voided }) {
  if (voided) {
    return {
      backgroundColor: glass.colors.voidFill,
      borderColor: selected ? 'rgba(228, 236, 246, 0.76)' : glass.colors.voidEdge,
      opacity: selected ? 1 : 0.82
    };
  }

  return {
    backgroundColor: `${zoneConfig.color}${selected ? '2f' : '22'}`,
    borderColor: selected ? zoneConfig.color : `${zoneConfig.color}55`,
    opacity: selected ? 1 : 0.9
  };
}

export default function CalendarScreen({ user, onUserChange, theme }) {
  const viewMode = user.calendarView || 'month';
  const monthLength = user.month.length || 28;
  const selectedDayIndex = Math.min(Math.max(user.currentDay || 0, 0), monthLength - 1);
  const selectedWeekday = DAY_LABELS[selectedDayIndex % 7];
  const selectedPercent = user.month[selectedDayIndex] || 0;
  const selectedZone = getZoneConfig(selectedPercent);
  const selectedIsVoid = isVoidDay(user, selectedDayIndex);
  const weekStart = Math.floor(selectedDayIndex / 7) * 7;
  const weekDays = user.month.slice(weekStart, weekStart + 7);
  const greenDays = weekDays.filter((value) => value > 75).length;
  const logDayIndex = getLogDayIndex(user);
  const logWeekday = DAY_LABELS[logDayIndex % 7];

  const mapHeading = viewMode === 'month'
    ? 'Monthly map'
    : viewMode === 'week'
      ? 'Week at a glance'
      : 'Focused day';

  const handleCellPress = (dayIndex) => {
    onUserChange({
      ...user,
      currentDay: Math.min(Math.max(dayIndex, 0), monthLength - 1)
    });
  };

  const handleViewChange = (nextView) => {
    onUserChange({
      ...user,
      calendarView: nextView
    });
  };

  const handleToggleVoidDay = () => {
    onUserChange(toggleVoidDay(user, selectedDayIndex));
  };

  const monthCells = useMemo(() => (
    user.month.map((percentValue, index) => {
      const zoneConfig = getZoneConfig(percentValue);
      const selected = index === selectedDayIndex;
      const voided = isVoidDay(user, index);

      return (
        <TouchableOpacity
          key={`month-${index}`}
          style={styles.monthCell}
          onPress={() => handleCellPress(index)}
        >
          <View style={[styles.monthCellInner, getCellState({ percent: percentValue, zoneConfig, selected, voided })]}>
            <Text style={styles.cellDay}>{index + 1}</Text>
            {voided ? (
              <Text style={styles.cellVoid}>VOID</Text>
            ) : (
              <Text style={styles.cellPercent}>{percentValue}%</Text>
            )}
          </View>
        </TouchableOpacity>
      );
    })
  ), [selectedDayIndex, user]);

  const weekCells = useMemo(() => (
    DAY_LABELS.map((day, index) => {
      const actualIndex = weekStart + index;
      const percentValue = user.month[actualIndex] || 0;
      const zoneConfig = getZoneConfig(percentValue);
      const selected = actualIndex === selectedDayIndex;
      const voided = isVoidDay(user, actualIndex);

      return (
        <TouchableOpacity
          key={`week-${day}`}
          style={{ flex: 1 }}
          onPress={() => handleCellPress(actualIndex)}
        >
          <View style={[styles.weekCell, getCellState({ percent: percentValue, zoneConfig, selected, voided })]}>
            <Text style={styles.cellDay}>{day}</Text>
            {voided ? (
              <Text style={styles.cellVoid}>VOID</Text>
            ) : (
              <Text style={styles.cellPercent}>{percentValue}%</Text>
            )}
            <Text style={styles.cellDetail}>{selected ? 'Selected' : 'Tap'}</Text>
          </View>
        </TouchableOpacity>
      );
    })
  ), [selectedDayIndex, user, weekStart]);

  const detailCopy = (() => {
    if (selectedIsVoid) {
      return 'This day is excluded from streaks, averages, and progress color states so you can protect the signal when travel or illness interrupts the rhythm.';
    }
    if (selectedPercent >= 100) {
      return 'Bright blue closeout. Count goals and optional time goals are both locked in.';
    }
    if (selectedPercent > 75) {
      return 'Green day. This is strong, reliable follow-through with only a small gap left to close.';
    }
    if (selectedPercent >= 50) {
      return 'Yellow day. Momentum is real, but the system is still asking for a clean finish.';
    }
    return 'Red-orange day. The priority is one simple rep to re-establish consistency.';
  })();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme?.bgBase || '#1d1a46' }]}>
      <AmbientGlow theme={theme} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FadeInView style={styles.topRow}>
          <Text style={styles.title}>Calendar</Text>
          <Text style={styles.subtitle}>Track month, week, and day progress without crowding the numbers.</Text>
        </FadeInView>

        <FadeInView delay={60}>
          <GlassSurface style={styles.heroCard} radius={glass.radius.xl} fillColor={glass.colors.panelStrong}>
            <View style={styles.cardKickerRow}>
              <Text style={styles.cardKicker}>BASIC TRACKING</Text>
              <Text style={styles.cardKicker}>{selectedIsVoid ? 'VOID DAY' : 'FREE FEATURE'}</Text>
            </View>
            <Text style={styles.cardHeading}>Completion map</Text>
            <Text style={styles.heroCopy}>
              Tap any day to inspect it, keep the visual rhythm clean, and move between views without stretching the data.
            </Text>

            <View style={styles.summaryRow}>
              <View style={styles.summaryPill}>
                <Text style={styles.summaryLabel}>Selected</Text>
                <Text style={styles.summaryValue}>{selectedIsVoid ? `${selectedWeekday} · Void` : `${selectedWeekday} · ${selectedPercent}%`}</Text>
              </View>
              <View style={styles.summaryPill}>
                <Text style={styles.summaryLabel}>Green Days</Text>
                <Text style={styles.summaryValue}>{greenDays}/7 this week</Text>
              </View>
              <View style={styles.summaryPill}>
                <Text style={styles.summaryLabel}>Logging To</Text>
                <Text style={styles.summaryValue}>{logWeekday} · Day {logDayIndex + 1}</Text>
              </View>
            </View>

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
          </GlassSurface>
        </FadeInView>

        <FadeInView delay={140}>
          <GlassSurface style={styles.mapCard} radius={glass.radius.xl} fillColor={glass.colors.panelDeep}>
            <View style={styles.mapHeader}>
              <Text style={styles.mapHeading}>{mapHeading}</Text>
              <Text style={styles.mapHint}>
                Void days wash into neutral grey, while active days keep the mastery color scale.
              </Text>
            </View>

            {viewMode === 'month' && (
              <>
                <View style={styles.weekHeaderRow}>
                  {DAY_LABELS.map((day) => (
                    <View key={day} style={styles.weekHeaderCell}>
                      <Text style={styles.weekHeaderText}>{day}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.monthGrid}>{monthCells}</View>
              </>
            )}

            {viewMode === 'week' && <View style={styles.weekGrid}>{weekCells}</View>}

            {viewMode === 'day' && (
              <TouchableOpacity onPress={() => handleCellPress(selectedDayIndex)}>
                <View style={[styles.dayCell, getCellState({ percent: selectedPercent, zoneConfig: selectedZone, selected: true, voided: selectedIsVoid })]}>
                  <View>
                    <Text style={styles.cellDay}>{selectedWeekday} · Day {selectedDayIndex + 1}</Text>
                    <Text style={styles.cellDetail}>
                      {selectedIsVoid ? 'Excluded from scoring' : 'Focused readout for the currently selected day'}
                    </Text>
                  </View>
                  {selectedIsVoid ? (
                    <Text style={styles.cellVoid}>VOID DAY</Text>
                  ) : (
                    <Text style={styles.cellPercentLarge}>{selectedPercent}%</Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          </GlassSurface>
        </FadeInView>

        <FadeInView delay={220}>
          <GlassSurface
            style={styles.detailCard}
            radius={22}
            fillColor={selectedIsVoid ? glass.colors.voidFill : `${selectedZone.color}14`}
            accentColor={selectedIsVoid ? '#d4dbe8' : selectedZone.color}
            borderColor={selectedIsVoid ? glass.colors.voidEdge : `${selectedZone.color}55`}
          >
            <Text style={styles.detailTitle}>
              {selectedWeekday} · {selectedIsVoid ? 'Void day' : `${selectedPercent}%`}
            </Text>
            <Text style={styles.detailCopy}>{detailCopy}</Text>
            <Text style={styles.detailFoot}>
              Logging currently updates {logWeekday} (Day {logDayIndex + 1}) for showcase consistency.
            </Text>
            {user.premium && (
              <GlassButton
                title={selectedIsVoid ? 'Remove Void Day' : 'Mark Sick/Travel Void Day'}
                onPress={handleToggleVoidDay}
                variant="secondary"
                style={{ marginTop: 6 }}
              />
            )}
          </GlassSurface>
        </FadeInView>
      </ScrollView>
    </SafeAreaView>
  );
}
