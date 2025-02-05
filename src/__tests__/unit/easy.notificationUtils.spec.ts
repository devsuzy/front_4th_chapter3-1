import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

describe('getUpcomingEvents', () => {
  const now = new Date('2024-07-01T12:00:00');

  const events: Event[] = [
    {
      id: '0',
      title: '이벤트 1',
      date: '2024-07-01',
      startTime: '12:30',
      endTime: '13:30',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 30,
    },
    {
      id: '1',
      title: '이벤트 2',
      date: '2024-07-01',
      startTime: '13:00',
      endTime: '14:00',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 1 },
      notificationTime: 60,
    },
    {
      id: '2',
      title: '이벤트 3',
      date: '2024-07-01',
      startTime: '15:30',
      endTime: '16:30',
      description: '',
      location: '',
      category: '',
      repeat: { type: 'none', interval: 1 },
      notificationTime: 30,
    },
  ];

  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const result = getUpcomingEvents(events, now, []);

    expect(result).toHaveLength(2);
    expect(result.map((e) => e.id)).toEqual(['0', '1']);
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const result = getUpcomingEvents(events, now, ['0']);

    expect(result).toHaveLength(1);
    expect(result.map((e) => e.id)).toEqual(['1']);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const result = getUpcomingEvents(events, now, []);

    expect(result.some((e) => e.id === '2')).toBe(false);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const pastNow = new Date('2024-07-01T12:45:00');

    const result = getUpcomingEvents(events, pastNow, []);

    expect(result.some((e) => e.id === '0')).toBe(false);
    expect(result.some((e) => e.id === '1')).toBe(true);
  });
});

describe('createNotificationMessage', () => {
  const event: Event = {
    id: '0',
    title: '이벤트 1',
    date: '2024-07-01',
    startTime: '12:30',
    endTime: '13:30',
    description: '',
    location: '',
    category: '',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 30,
  };

  it('올바른 알림 메시지를 생성해야 한다', () => {
    const result = createNotificationMessage(event);
    expect(result).toBe('30분 후 이벤트 1 일정이 시작됩니다.');
  });
});
