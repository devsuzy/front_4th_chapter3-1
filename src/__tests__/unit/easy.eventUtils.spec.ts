import { Event } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';

describe('getFilteredEvents', () => {
  const events: Event[] = [
    {
      id: '0',
      title: '주간 미팅',
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
      title: '이벤트 2',
      date: '2024-07-10',
      startTime: '14:00',
      endTime: '15:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 1 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: 'EVENT MEETING',
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

  it("검색어 '이벤트 2'에 맞는 이벤트만 반환한다", () => {
    const result = getFilteredEvents(events, '이벤트 2', new Date('2024-07-01'), 'month');

    expect(result).toHaveLength(1);
    expect(result.map((e) => e.id)).toEqual(['1']);
  });

  it('주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', () => {
    const result = getFilteredEvents(events, '', new Date('2024-07-01'), 'week');

    expect(result).toHaveLength(1);
    expect(result.map((e) => e.id)).toEqual(['0']);
  });
  it('월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다', () => {
    const result = getFilteredEvents(events, '', new Date('2024-07-01'), 'month');

    expect(result).toHaveLength(3);
    expect(result.map((e) => e.id)).toEqual(['0', '1', '2']);
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const result = getFilteredEvents(events, '이벤트', new Date('2024-07-10'), 'week');

    expect(result).toHaveLength(1);
    expect(result.map((e) => e.id)).toEqual(['1']);
  });

  it('검색어가 없을 때 모든 이벤트를 반환한다', () => {
    const result = getFilteredEvents(events, '', new Date('2024-07-20'), 'month');

    expect(result).toHaveLength(3);
    expect(result.map((e) => e.id)).toEqual(['0', '1', '2']);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const result = getFilteredEvents(events, 'meeting', new Date('2024-07-01'), 'month');

    expect(result).toHaveLength(1);
    expect(result.map((e) => e.id)).toEqual(['2']);
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    const result = getFilteredEvents(events, '', new Date('2024-07-30'), 'month');

    expect(result).toHaveLength(3);
    expect(result.map((e) => e.id)).toEqual(['0', '1', '2']);
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    // 날짜
    const resultDate = getFilteredEvents(events, '', new Date('2024-06-30'), 'month');

    expect(resultDate).toHaveLength(0);
    expect(resultDate.map((e) => e.id)).toEqual([]);

    // 검색어
    const resultSearch = getFilteredEvents(events, '월간', new Date('2024-07-30'), 'month');

    expect(resultSearch).toHaveLength(0);
    expect(resultSearch.map((e) => e.id)).toEqual([]);
  });
});
