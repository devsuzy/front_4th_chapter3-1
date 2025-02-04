import { Event } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    expect(parseDateTime('2024-07-01', '14:30').toISOString()).toBe('2024-07-01T14:30:00.000Z');
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    const result = parseDateTime('invalid-date', '14:30');
    expect(result.toString()).toBe('Invalid Date');
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    const result = parseDateTime('2024-07-01', 'invalid-time');
    expect(result.toString()).toBe('Invalid Date');
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const result = parseDateTime('', '14:30');
    expect(result.toString()).toBe('Invalid Date');
  });

  it('시간 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const result = parseDateTime('2024-07-01', '');
    expect(result.toString()).toBe('Invalid Date');
  });
});

describe('convertEventToDateRange', () => {
  const events: Event[] = [
    {
      id: '0',
      title: '생일 파티',
      date: '2025-02-28',
      startTime: '19:00',
      endTime: '22:00',
      description: '친구 생일 축하',
      location: '친구 집',
      category: '개인',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 1,
    },
    {
      id: '1',
      title: '프로젝트 마감',
      date: 'invalid-date',
      startTime: '25:80',
      endTime: '99:99',
      description: '분기별 프로젝트 마감',
      location: '사무실',
      category: '업무',
      repeat: { type: 'none', interval: 1 },
      notificationTime: 10,
    },
  ];

  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    expect(convertEventToDateRange(events[0]).start.toISOString()).toBe('2025-02-28T19:00:00.000Z');
    expect(convertEventToDateRange(events[0]).end.toISOString()).toBe('2025-02-28T22:00:00.000Z');
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    expect(isNaN(convertEventToDateRange(events[1]).start.getTime())).toBe(true);
    expect(isNaN(convertEventToDateRange(events[1]).end.getTime())).toBe(true);
  });

  // 위 코드와 상계 가능
  it.skip('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {});
});

describe('isOverlapping', () => {
  const event1: Event = {
    id: '0',
    title: '이벤트 1',
    date: '2024-07-01',
    startTime: '15:00',
    endTime: '18:00',
    description: '',
    location: '',
    category: '',
    repeat: { type: 'none', interval: 1 },
    notificationTime: 10,
  };

  const event2: Event = {
    id: '1',
    title: '이벤트 2',
    date: '2024-07-01',
    startTime: '15:30',
    endTime: '17:00',
    description: '',
    location: '',
    category: '',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  };

  const event3: Event = {
    id: '2',
    title: '이벤트 3',
    date: '2024-07-01',
    startTime: '12:30',
    endTime: '14:00',
    description: '',
    location: '',
    category: '',
    repeat: { type: 'none', interval: 10 },
    notificationTime: 10,
  };

  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    expect(isOverlapping(event1, event2)).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    expect(isOverlapping(event1, event3)).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  const events: Event[] = [
    {
      id: '0',
      title: '이벤트 1',
      date: '2024-07-01',
      startTime: '10:00',
      endTime: '12:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 1 },
      notificationTime: 10,
    },
    {
      id: '1',
      title: '이벤트 2',
      date: '2024-07-01',
      startTime: '13:00',
      endTime: '15:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '이벤트 3',
      date: '2024-07-01',
      startTime: '14:00',
      endTime: '16:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 10 },
      notificationTime: 10,
    },
  ];
  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const newEvent: Event = {
      id: '3',
      title: '이벤트 4',
      date: '2024-07-01',
      startTime: '14:00',
      endTime: '15:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 10 },
      notificationTime: 10,
    };

    const result = findOverlappingEvents(newEvent, events);

    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id)).toEqual(['1', '2']);
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const newEvent: Event = {
      id: '4',
      title: '이벤트 5',
      date: '2024-07-02',
      startTime: '10:00',
      endTime: '12:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 10 },
      notificationTime: 10,
    };

    const result = findOverlappingEvents(newEvent, events);

    expect(result).toHaveLength(0);
  });
});
