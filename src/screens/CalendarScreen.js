import React, { useEffect, useMemo, useRef } from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';
import {
  DAY_LABELS,
  DAYS_IN_MONTH_VIEW,
  getAvailableMonthKeys,
  getCurrentMonthKey,
  getLogDayIndex,
  getMonthLabel,
  getMonthRecord,
  getSelectedMonthKey,
  getZoneConfig,
  isFutureMonthKey,
  isVoidDay,
  selectMonth,
  toggleVoidDay
} from '../lib/reptrak';
import { AmbientGlow } from '../components/AmbientGlow';
import { AppIcon } from '../components/AppIcon';
import { FadeInView } from '../components/FadeInView';
import { GlassButton } from '../components/GlassButton';
import { GlassSurface } from '../components/GlassSurface';
import { ReptraKMark } from '../components/BrandLogo';
import { ScreenTransitionView } from '../components/ScreenTransitionView';
import { glass } from '../theme/glass';
import { layout } from '../theme/layout';

const CELL_GAP = 8;
const WEEK_COLUMNS = 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1a46'
  },
  scrollContent: {
    paddingHorizontal: layout.appHorizontalPadding,
    paddingVertical: layout.appVerticalPadding,
    paddingBottom: 152
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16
  },
  headerTitle: {
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -0.9,
    fontWeight: '800',
    color: glass.colors.textMain
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
    color: glass.colors.textSoft
  },
  heroCard: {
    padding: layout.cardPadding,
    marginBottom: layout.sectionGap,
    gap: 14
  },
  kickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: '800',
    color: glass.colors.textSoft
  },
  heroTitle: {
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -1,
    fontWeight: '800',
    color: glass.colors.textMain
  },
  heroCopy: {
    fontSize: 14,
    lineHeight: 21,
    color: glass.colors.textSoft
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10
  },
  summaryPill: {
    flex: 1,
    minHeight: 76,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: glass.colors.borderSoft,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'space-between'
  },
  summaryLabel: {
    fontSize: 10,
    letterSpacing: 0.8,
    fontWeight: '800',
    color: glass.colors.textSoft
  },
  summaryValue: {
    fontSize: 17,
    lineHeight: 21,
    fontWeight: '800',
    color: glass.colors.textMain
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  monthButton: {
    width: 46,
    height: 46,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: glass.colors.borderSoft,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  monthLabelWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12
  },
  monthLabel: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    color: glass.colors.textMain,
    textAlign: 'center'
  },
  monthHint: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 15,
    color: glass.colors.textSoft,
    textAlign: 'center'
  },
  toggleRow: {
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
    justifyContent: 'center'
  },
  toggleButtonActive: {
    backgroundColor: 'rgba(111, 217, 255, 0.24)',
    borderColor: 'rgba(169, 237, 255, 0.48)'
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '800',
    color: glass.colors.textSoft
  },
  toggleTextActive: {
    color: '#142447'
  },
  boardCard: {
    padding: layout.cardPadding,
    marginBottom: layout.sectionGap,
    gap: 14
  },
  boardHeader: {
    gap: 4
  },
  boardTitle: {
    fontSize: 19,
    lineHeight: 23,
    fontWeight: '800',
    color: glass.colors.textMain
  },
  boardHint: {
    fontSize: 13,
    lineHeight: 19,
    color: glass.colors.textSoft
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -(CELL_GAP / 2)
  },
  monthCellWrap: {
    width: '20%',
    paddingHorizontal: CELL_GAP / 2,
    paddingVertical: CELL_GAP / 2
  },
  monthCell: {
    minHeight: 74,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    justifyContent: 'space-between'
  },
  monthCellDay: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '800',
    color: glass.colors.textSoft
  },
  monthCellValue: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '800',
    color: glass.colors.textMain
  },
  weekCarousel: {
    marginHorizontal: -layout.cardPadding
  },
  weekSlide: {
    paddingHorizontal: layout.cardPadding
  },
  weekSlideGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: CELL_GAP
  },
  weekDayCard: {
    aspectRatio: 1,
    borderRadius: 18,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  weekLabel: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '800',
    color: glass.colors.textSoft,
    textAlign: 'center'
  },
  weekPercent: {
    fontSize: 17,
    lineHeight: 20,
    fontWeight: '800',
    color: glass.colors.textMain,
    textAlign: 'center'
  },
  weekMeta: {
    fontSize: 10,
    lineHeight: 13,
    color: glass.colors.textSoft,
    textAlign: 'center'
  },
  carouselDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8
  },
  carouselDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  carouselDotActive: {
    width: 24,
    backgroundColor: 'rgba(169, 237, 255, 0.9)'
  },
  dayCard: {
    minHeight: 210,
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 22,
    borderWidth: 1,
    justifyContent: 'space-between'
  },
  dayTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
    color: glass.colors.textSoft
  },
  dayHint: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: glass.colors.textSoft
  },
  dayPercent: {
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: -1.6,
    fontWeight: '800',
    color: glass.colors.textMain
  },
  voidText: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.9,
    fontWeight: '800',
    color: 'rgba(240, 245, 252, 0.82)'
  },
  detailCard: {
    padding: 18,
    gap: 8
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
    fontSize: 12,
    lineHeight: 18,
    color: glass.colors.textSoft
  }
});

function getCellState({ zoneConfig, selected, voided, accentStrong }) {
  if (voided) {
    return {
      backgroundColor: glass.colors.voidFill,
      borderColor: selected ? 'rgba(230, 238, 247, 0.78)' : glass.colors.voidEdge
    };
  }

  return {
    backgroundColor: selected ? `${zoneConfig.color}33` : `${zoneConfig.color}1d`,
    borderColor: selected ? accentStrong || zoneConfig.color : `${zoneConfig.color}66`
  };
}

function getDetailCopy({ percent, isVoid, isFuture }) {
  if (isVoid && isFuture) {
    return 'This day is reserved as a future recovery day, so your showcase streak will stay honest when life gets busy!';
  }

  if (isVoid) {
    return 'This day is washed into a soft grey, so travel or sick time never muddies your real progress!';
  }

  if (percent >= 100) {
    return 'Boom! This one is fully sealed and glowing bright blue! That is a clean mastery closeout!';
  }

  if (percent > 75) {
    return 'Awesome work! This day is already in the green and only needs a tiny extra push to fully close!';
  }

  if (percent >= 50) {
    return 'Nice energy! You are over halfway there, and one more focused rep could really brighten the board!';
  }

  return 'Fresh start! One solid action here can flip the whole vibe of the day and get momentum rolling again!';
}

export default function CalendarScreen({ user, onUserChange, theme }) {
  const weekListRef = useRef(null);
  const { width } = useWindowDimensions();
  const viewMode = user.calendarView || 'month';
  const selectedMonthKey = getSelectedMonthKey(user);
  const monthValues = getMonthRecord(user, selectedMonthKey);
  const availableMonthKeys = useMemo(
    () => getAvailableMonthKeys(user.accountCreatedAt),
    [user.accountCreatedAt]
  );
  const selectedMonthIndex = Math.max(availableMonthKeys.indexOf(selectedMonthKey), 0);
  const selectedDayIndex = Math.min(Math.max(user.currentDay || 0, 0), DAYS_IN_MONTH_VIEW - 1);
  const selectedPercent = monthValues[selectedDayIndex] || 0;
  const selectedZone = getZoneConfig(selectedPercent);
  const selectedIsVoid = isVoidDay(user, selectedDayIndex, selectedMonthKey);
  const monthAverageBase = monthValues.filter((_, index) => !isVoidDay(user, index, selectedMonthKey));
  const monthAverage = monthAverageBase.length
    ? Math.round(monthAverageBase.reduce((sum, value) => sum + value, 0) / monthAverageBase.length)
    : 0;
  const greenDays = monthValues.filter((value, index) => !isVoidDay(user, index, selectedMonthKey) && value > 75).length;
  const currentMonthKey = getCurrentMonthKey();
  const viewingFuture = isFutureMonthKey(selectedMonthKey);
  const logDayIndex = getLogDayIndex(user);
  const weekSlides = useMemo(
    () => Array.from({ length: Math.ceil(DAYS_IN_MONTH_VIEW / 7) }, (_, slideIndex) => (
      Array.from({ length: 7 }, (_, itemIndex) => {
        const dayIndex = (slideIndex * 7) + itemIndex;
        if (dayIndex >= DAYS_IN_MONTH_VIEW) {
          return null;
        }

        return {
          dayIndex,
          label: DAY_LABELS[itemIndex],
          percent: monthValues[dayIndex] || 0,
          isVoid: isVoidDay(user, dayIndex, selectedMonthKey)
        };
      })
    )),
    [monthValues, selectedMonthKey, user]
  );
  const selectedWeekSlide = Math.floor(selectedDayIndex / 7);
  const slideWidth = Math.max(width - ((layout.appHorizontalPadding + layout.cardPadding) * 2), 260);
  const weekGridWidth = slideWidth - (layout.cardPadding * 2);
  const weekCellSize = Math.floor((weekGridWidth - (CELL_GAP * (WEEK_COLUMNS - 1))) / WEEK_COLUMNS);

  useEffect(() => {
    if (viewMode === 'week' && weekListRef.current) {
      weekListRef.current.scrollToOffset({
        animated: true,
        offset: selectedWeekSlide * slideWidth
      });
    }
  }, [selectedWeekSlide, slideWidth, viewMode]);

  const handleDaySelect = (dayIndex) => {
    onUserChange({
      ...user,
      currentDay: dayIndex
    });
  };

  const handleViewChange = (nextView) => {
    onUserChange({
      ...user,
      calendarView: nextView
    });
  };

  const handleShiftMonth = (delta) => {
    const nextIndex = selectedMonthIndex + delta;
    if (nextIndex < 0 || nextIndex >= availableMonthKeys.length) {
      return;
    }
    onUserChange(selectMonth(user, availableMonthKeys[nextIndex]));
  };

  const commitVoidToggle = () => {
    onUserChange(toggleVoidDay(user, selectedDayIndex, selectedMonthKey));
  };

  const handleToggleVoidDay = () => {
    if (!user.premium) {
      Alert.alert('Premium feature!', 'Void days live in Premium so your streak rules stay intentional and protected!');
      return;
    }

    if (viewingFuture && !selectedIsVoid) {
      Alert.alert(
        'Reserve a future void day?!',
        'This will grey out the day ahead of time for travel, recovery, or a planned break. Want to lock it in?!',
        [
          { text: 'Not yet', style: 'cancel' },
          { text: 'Reserve it!', onPress: commitVoidToggle }
        ]
      );
      return;
    }

    commitVoidToggle();
  };

  const detailCopy = getDetailCopy({
    percent: selectedPercent,
    isVoid: selectedIsVoid,
    isFuture: viewingFuture
  });

  const selectedMonthLabel = getMonthLabel(selectedMonthKey);
  const loggingMonthLabel = getMonthLabel(currentMonthKey);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme?.bgBase || '#1d1a46' }]}>
      <AmbientGlow theme={theme} />
      <ScreenTransitionView axis="x">
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <FadeInView style={styles.header}>
          <ReptraKMark width={36} height={34} />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Calendar</Text>
            <Text style={styles.headerSubtitle}>Friendly 30-day tracking, week slides, and day-by-day coaching!</Text>
          </View>
        </FadeInView>

        <FadeInView delay={60}>
          <GlassSurface style={styles.heroCard} radius={glass.radius.xl} fillColor={glass.colors.panelStrong}>
            <View style={styles.kickerRow}>
              <Text style={styles.kicker}>30-DAY BOARD</Text>
              <Text style={styles.kicker}>{viewingFuture ? 'PLANNING AHEAD' : 'SHOWCASE READY'}</Text>
            </View>
            <Text style={styles.heroTitle}>Keep the rhythm clear!</Text>
            <Text style={styles.heroCopy}>
              Browse every month from your start date, swipe through weekly slides, and tap any day for a clean focused readout!
            </Text>

            <View style={styles.summaryRow}>
              <View style={styles.summaryPill}>
                <Text style={styles.summaryLabel}>Selected Day</Text>
                <Text style={styles.summaryValue}>{selectedIsVoid ? `Day ${selectedDayIndex + 1} · Void` : `Day ${selectedDayIndex + 1} · ${selectedPercent}%`}</Text>
              </View>
              <View style={styles.summaryPill}>
                <Text style={styles.summaryLabel}>Month Avg</Text>
                <Text style={styles.summaryValue}>{monthAverage}%</Text>
              </View>
              <View style={styles.summaryPill}>
                <Text style={styles.summaryLabel}>Green Days</Text>
                <Text style={styles.summaryValue}>{greenDays}/30</Text>
              </View>
            </View>

            <View style={styles.monthRow}>
              <TouchableOpacity
                style={[styles.monthButton, selectedMonthIndex === 0 && { opacity: 0.42 }]}
                onPress={() => handleShiftMonth(-1)}
                disabled={selectedMonthIndex === 0}
              >
                <AppIcon name="chevron-left" size={18} color={glass.colors.textSoft} strokeWidth={2.2} />
              </TouchableOpacity>
              <View style={styles.monthLabelWrap}>
                <Text style={styles.monthLabel}>{selectedMonthLabel}</Text>
                <Text style={styles.monthHint}>
                  {selectedMonthKey === currentMonthKey
                    ? 'Live month! Logging updates here right now!'
                    : viewingFuture
                      ? 'Future month! Great for planned void days and prep!'
                      : 'Past month! Scroll back through your story any time!'}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.monthButton, selectedMonthIndex === availableMonthKeys.length - 1 && { opacity: 0.42 }]}
                onPress={() => handleShiftMonth(1)}
                disabled={selectedMonthIndex === availableMonthKeys.length - 1}
              >
                <AppIcon name="chevron-right" size={18} color={glass.colors.textSoft} strokeWidth={2.2} />
              </TouchableOpacity>
            </View>

            <View style={styles.toggleRow}>
              {['month', 'week', 'day'].map((mode) => {
                const active = mode === viewMode;
                return (
                  <TouchableOpacity
                    key={mode}
                    style={[styles.toggleButton, active && styles.toggleButtonActive]}
                    onPress={() => handleViewChange(mode)}
                  >
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
          <GlassSurface style={styles.boardCard} radius={glass.radius.xl} fillColor={glass.colors.panelDeep}>
            <View style={styles.boardHeader}>
              <Text style={styles.boardTitle}>
                {viewMode === 'month' ? '30-day board!' : viewMode === 'week' ? 'Weekly slide carousel!' : 'Focused day card!'}
              </Text>
              <Text style={styles.boardHint}>
                {viewMode === 'month'
                  ? 'The month view stays compact and readable, so percentages never stretch awkwardly again!'
                  : viewMode === 'week'
                    ? 'Swipe left and right to move through the month in seven-day chunks, with easier square cards for quick scanning!'
                    : 'This is your close-up look at one day, with the coach readout right below!'}
              </Text>
            </View>

            {viewMode === 'month' && (
              <View style={styles.monthGrid}>
                {monthValues.map((percentValue, index) => {
                  const zoneConfig = getZoneConfig(percentValue);
                  const selected = index === selectedDayIndex;
                  const voided = isVoidDay(user, index, selectedMonthKey);

                  return (
                    <TouchableOpacity
                      key={`month-${selectedMonthKey}-${index}`}
                      style={styles.monthCellWrap}
                      onPress={() => handleDaySelect(index)}
                    >
                      <View style={[styles.monthCell, getCellState({ zoneConfig, selected, voided, accentStrong: theme?.accentStrong })]}>
                        <Text style={styles.monthCellDay}>Day {index + 1}</Text>
                        <Text style={styles.monthCellValue}>{voided ? 'VOID' : `${percentValue}%`}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {viewMode === 'week' && (
              <>
                <FlatList
                  ref={weekListRef}
                  data={weekSlides}
                  horizontal
                  pagingEnabled
                  decelerationRate="fast"
                  keyExtractor={(_, index) => `week-slide-${selectedMonthKey}-${index}`}
                  showsHorizontalScrollIndicator={false}
                  style={styles.weekCarousel}
                  renderItem={({ item, index }) => (
                    <View style={[styles.weekSlide, { width: slideWidth }]}>
                      <View style={styles.weekSlideGrid}>
                        {item.map((day, dayIndex) => {
                          if (!day) {
                            return (
                              <View
                                key={`empty-${index}-${dayIndex}`}
                                style={[
                                  styles.weekDayCard,
                                  {
                                    width: weekCellSize,
                                    backgroundColor: 'rgba(255,255,255,0.02)',
                                    borderColor: 'rgba(255,255,255,0.05)',
                                    opacity: 0.28
                                  }
                                ]}
                              />
                            );
                          }

                          const zoneConfig = getZoneConfig(day.percent);
                          const selected = day.dayIndex === selectedDayIndex;

                          return (
                            <TouchableOpacity
                              key={`week-${day.dayIndex}`}
                              onPress={() => handleDaySelect(day.dayIndex)}
                            >
                              <View
                                style={[
                                  styles.weekDayCard,
                                  { width: weekCellSize },
                                  getCellState({
                                    zoneConfig,
                                    selected,
                                    voided: day.isVoid,
                                    accentStrong: theme?.accentStrong
                                  })
                                ]}
                              >
                                <Text style={styles.weekLabel}>{day.label}</Text>
                                <Text style={styles.weekPercent}>{day.isVoid ? 'VOID' : `${day.percent}%`}</Text>
                                <Text style={styles.weekMeta}>Day {day.dayIndex + 1}</Text>
                              </View>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  )}
                />

                <View style={styles.carouselDots}>
                  {weekSlides.map((_, index) => (
                    <View
                      key={`dot-${index}`}
                      style={[
                        styles.carouselDot,
                        index === selectedWeekSlide && styles.carouselDotActive
                      ]}
                    />
                  ))}
                </View>
              </>
            )}

            {viewMode === 'day' && (
              <View
                style={[
                  styles.dayCard,
                  getCellState({
                    zoneConfig: selectedZone,
                    selected: true,
                    voided: selectedIsVoid,
                    accentStrong: theme?.accentStrong
                  })
                ]}
              >
                <View>
                  <Text style={styles.dayTitle}>{DAY_LABELS[selectedDayIndex % 7]} · Day {selectedDayIndex + 1}</Text>
                  <Text style={styles.dayHint}>
                    {selectedMonthKey === currentMonthKey
                      ? 'Live day! This is the score your current session is chasing!'
                      : viewingFuture
                        ? 'Future planning day! Great for setting expectations and recovery!'
                        : 'Past day! A quick look back at how that session landed!'}
                  </Text>
                </View>
                {selectedIsVoid ? (
                  <Text style={styles.voidText}>VOID DAY</Text>
                ) : (
                  <Text style={styles.dayPercent}>{selectedPercent}%</Text>
                )}
              </View>
            )}
          </GlassSurface>
        </FadeInView>

        <FadeInView delay={220}>
          <GlassSurface
            style={styles.detailCard}
            radius={22}
            fillColor={selectedIsVoid ? glass.colors.voidFill : `${selectedZone.color}16`}
            accentColor={selectedIsVoid ? '#d4dbe8' : selectedZone.color}
            borderColor={selectedIsVoid ? glass.colors.voidEdge : `${selectedZone.color}5e`}
          >
            <Text style={styles.detailTitle}>
              {selectedMonthLabel} · Day {selectedDayIndex + 1}
            </Text>
            <Text style={styles.detailCopy}>{detailCopy}</Text>
            <Text style={styles.detailFoot}>
              {selectedMonthKey === currentMonthKey
                ? `Live logging is feeding ${loggingMonthLabel} Day ${logDayIndex + 1} right now, so the showcase always feels active!`
                : `You are browsing ${selectedMonthLabel}, while live logging still lands in ${loggingMonthLabel} Day ${logDayIndex + 1}!`}
            </Text>
            <GlassButton
              title={selectedIsVoid ? 'Remove Void Day' : viewingFuture ? 'Reserve Future Void Day' : 'Mark Sick / Travel Void Day'}
              onPress={handleToggleVoidDay}
              variant="secondary"
              style={{ marginTop: 6 }}
            />
          </GlassSurface>
        </FadeInView>
        </ScrollView>
      </ScreenTransitionView>
    </SafeAreaView>
  );
}
