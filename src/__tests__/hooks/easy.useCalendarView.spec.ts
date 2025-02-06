import { act, renderHook } from '@testing-library/react';

import { useCalendarView } from '../../hooks/useCalendarView.ts';

// fetchHolidays를 실제 유틸함수처럼 동작하도록 모킹
vi.mock('../../apis/fetchHolidays', () => ({
  fetchHolidays: vi.fn((date: Date) => {
    const HOLIDAY_RECORD = {
      '2024-01-01': '신정',
      '2024-02-09': '설날',
      '2024-02-10': '설날',
      '2024-02-11': '설날',
      '2024-03-01': '삼일절',
      '2024-05-05': '어린이날',
      '2024-06-06': '현충일',
      '2024-08-15': '광복절',
      '2024-09-16': '추석',
      '2024-09-17': '추석',
      '2024-09-18': '추석',
      '2024-10-03': '개천절',
      '2024-10-09': '한글날',
      '2024-12-25': '크리스마스',
    };

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');

    return Object.fromEntries(
      Object.entries(HOLIDAY_RECORD).filter(([key]) => key.startsWith(`${y}-${m}`))
    );
  }),
}));

describe('초기 상태', () => {
  it('view는 "month"이어야 한다', () => {
    const { result } = renderHook(() => useCalendarView());
    expect(result.current.view).toBe('month');
  });

  // useFakeTimers, setSytemTime: 모의 타이머를 설정하여 사용자가 시스템 시간 변경을 시뮬레이션한다.
  // useRealTimers: 모의 타이머를 활성화한다.
  it('currentDate는 오늘 날짜인 "2024-10-01"이어야 한다', () => {
    // const date = new Date('2024-10-01');
    // vi.useFakeTimers();
    // vi.setSystemTime(date);

    const { result } = renderHook(() => useCalendarView());
    expect(result.current.currentDate.toISOString().slice(0, 10)).toBe('2024-10-01');
  });

  // useEffect는 비동기적으로 실행되므로 setTimeout을 사용하여 값이 업데이트될 시간을 확보한다.
  it('holidays는 10월 휴일인 개천절, 한글날이 지정되어 있어야 한다', async () => {
    const { result } = renderHook(() => useCalendarView());

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(result.current.holidays).toEqual({
      '2024-10-03': '개천절',
      '2024-10-09': '한글날',
    });
  });
});

describe('동작 테스트', () => {
  it("view를 'week'으로 변경 시 적절하게 반영된다", () => {
    const { result } = renderHook(() => useCalendarView());

    act(() => {
      result.current.setView('week');
    });

    expect(result.current.view).toBe('week');
  });

  it("주간 뷰에서 다음으로 navigate시 7일 후 '2024-10-08' 날짜로 지정이 된다", () => {
    const { result } = renderHook(() => useCalendarView());

    act(() => {
      result.current.setView('week');
    });

    act(() => {
      result.current.navigate('next');
    });

    expect(result.current.currentDate.toISOString().slice(0, 10)).toBe('2024-10-08');
  });

  it("주간 뷰에서 이전으로 navigate시 7일 후 '2024-09-24' 날짜로 지정이 된다", () => {
    const { result } = renderHook(() => useCalendarView());

    act(() => {
      result.current.setView('week');
    });

    act(() => {
      result.current.navigate('prev');
    });

    expect(result.current.currentDate.toISOString().slice(0, 10)).toBe('2024-09-24');
  });

  it("월간 뷰에서 다음으로 navigate시 한 달 전 '2024-11-01' 날짜여야 한다", () => {
    const { result } = renderHook(() => useCalendarView());

    act(() => {
      result.current.setView('month');
    });

    act(() => {
      result.current.navigate('next');
    });

    expect(result.current.currentDate.toISOString().slice(0, 10)).toBe('2024-11-01');
  });

  it("월간 뷰에서 이전으로 navigate시 한 달 전 '2024-09-01' 날짜여야 한다", () => {
    const { result } = renderHook(() => useCalendarView());

    act(() => {
      result.current.setView('month');
    });

    act(() => {
      result.current.navigate('prev');
    });

    expect(result.current.currentDate.toISOString().slice(0, 10)).toBe('2024-09-01');
  });

  it("currentDate가 '2024-01-01' 변경되면 1월 휴일 '신정'으로 업데이트되어야 한다", async () => {
    const { result } = renderHook(() => useCalendarView());

    act(() => {
      result.current.setCurrentDate(new Date('2024-01-01'));
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(result.current.holidays).toEqual({
      '2024-01-01': '신정',
    });
  });
});
