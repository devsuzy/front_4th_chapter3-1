import { act, renderHook } from '@testing-library/react';

import { useSearch } from '../../hooks/useSearch.ts';
import { Event } from '../../types.ts';

describe('동작 테스트', () => {
  const events: Event[] = [
    {
      id: '0',
      title: '주간 회의',
      date: '2024-07-01',
      startTime: '19:00',
      endTime: '22:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    },
    {
      id: '1',
      title: '점심',
      date: '2024-07-10',
      startTime: '14:00',
      endTime: '15:00',
      description: '점심 약속',
      location: '식당',
      category: '',
      repeat: { type: 'none', interval: 1 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: 'MEETING',
      date: '2024-07-30',
      startTime: '10:00',
      endTime: '11:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 1 },
      notificationTime: 1,
    },
  ];

  it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
    const { result } = renderHook(() => useSearch(events, new Date('2024-07-01'), 'month'));

    expect(result.current.searchTerm).toBe('');
    expect(result.current.filteredEvents).toEqual(events);
  });

  it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
    const { result } = renderHook(() => useSearch(events, new Date('2024-07-01'), 'month'));

    act(() => {
      result.current.setSearchTerm('주간 회의');
    });

    expect(result.current.filteredEvents).toHaveLength(1);
    expect(result.current.filteredEvents).toEqual([events[0]]);
  });

  it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
    const { result } = renderHook(() => useSearch(events, new Date('2024-07-01'), 'month'));

    // 제목
    act(() => {
      result.current.setSearchTerm('점심');
    });

    // 위치
    act(() => {
      result.current.setSearchTerm('식당');
    });

    // 설명
    act(() => {
      result.current.setSearchTerm('약속');
    });

    expect(result.current.filteredEvents).toHaveLength(1);
    expect(result.current.filteredEvents).toEqual([events[1]]);
  });

  it('현재 뷰(월간)에 해당하는 이벤트만 반환해야 한다', () => {
    // 월간
    const { result } = renderHook(() => useSearch(events, new Date('2024-07-01'), 'month'));

    expect(result.current.filteredEvents).toHaveLength(3);
    expect(result.current.filteredEvents.map((e) => e.id)).toEqual(['0', '1', '2']);
  });

  it('현재 뷰(주간)에 해당하는 이벤트만 반환해야 한다', () => {
    // 주간
    const { result } = renderHook(() => useSearch(events, new Date('2024-07-01'), 'week'));

    expect(result.current.filteredEvents).toHaveLength(1);
    expect(result.current.filteredEvents.map((e) => e.id)).toEqual(['0']);
  });

  it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
    const { result } = renderHook(() => useSearch(events, new Date('2024-07-20'), 'month'));

    act(() => {
      result.current.setSearchTerm('회의');
    });

    expect(result.current.filteredEvents).toHaveLength(1);
    expect(result.current.filteredEvents.map((e) => e.id)).toEqual(['0']);

    act(() => {
      result.current.setSearchTerm('점심');
    });

    expect(result.current.filteredEvents).toHaveLength(1);
    expect(result.current.filteredEvents.map((e) => e.id)).toEqual(['1']);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const { result } = renderHook(() => useSearch(events, new Date('2024-07-30'), 'week'));

    act(() => {
      result.current.setSearchTerm('meeting');
    });

    expect(result.current.filteredEvents).toHaveLength(1);
    expect(result.current.filteredEvents.map((e) => e.id)).toEqual(['2']);
  });
});
