import { act, renderHook } from '@testing-library/react';

import { useNotifications } from '../../hooks/useNotifications.ts';
import { Event } from '../../types.ts';
import { formatDate } from '../../utils/dateUtils.ts';
import { createNotificationMessage } from '../../utils/notificationUtils.ts';
import { parseHM } from '../utils.ts';

const events: Event[] = [
  {
    id: '1',
    title: '기존 회의',
    date: '2024-10-01',
    startTime: '10:00',
    endTime: '11:00',
    description: '기존 팀 미팅',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '2',
    title: '기존 회의 2',
    date: '2024-10-01',
    startTime: '10:00',
    endTime: '10:30',
    description: '프로젝트 회의',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 5,
  },
];

it('초기 상태에서는 알림이 없어야 한다', () => {
  const { result } = renderHook(() => useNotifications(events));
  expect(result.current.notifications).toEqual([]);
});

it('지정된 시간이 된 경우 알림이 새롭게 생성되어 추가된다', () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2024-10-01T09:50:00'));

  const { result } = renderHook(() => useNotifications(events));

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(result.current.notifications).toEqual([
    { id: '1', message: createNotificationMessage(events[0]) },
  ]);

  vi.useRealTimers();
});

it('index를 기준으로 알림을 적절하게 제거할 수 있다', () => {
  const { result } = renderHook(() => useNotifications(events));

  act(() => {
    result.current.setNotifications([
      { id: '1', message: createNotificationMessage(events[0]) },
      { id: '2', message: createNotificationMessage(events[1]) },
    ]);
  });

  expect(result.current.notifications).toHaveLength(2);
  expect(result.current.notifications).toEqual([
    { id: '1', message: createNotificationMessage(events[0]) },
    { id: '2', message: createNotificationMessage(events[1]) },
  ]);

  act(() => {
    result.current.removeNotification(0);
  });

  expect(result.current.notifications).toHaveLength(1);
  expect(result.current.notifications).toEqual([
    { id: '2', message: createNotificationMessage(events[1]) },
  ]);

  vi.useRealTimers();
});

it('이미 알림이 발생한 이벤트에 대해서는 중복 알림이 발생하지 않아야 한다', () => {
  const { result } = renderHook(() => useNotifications(events));

  act(() => {
    result.current.setNotifications([
      { id: '1', message: createNotificationMessage(events[0]) },
      { id: '2', message: createNotificationMessage(events[1]) },
    ]);
  });

  expect(result.current.notifications).toHaveLength(2);
  expect(result.current.notifications).toEqual([
    { id: '1', message: createNotificationMessage(events[0]) },
    { id: '2', message: createNotificationMessage(events[1]) },
  ]);

  act(() => {
    result.current.setNotifications([
      { id: '1', message: createNotificationMessage(events[0]) },
      { id: '2', message: createNotificationMessage(events[1]) },
    ]);
  });

  expect(result.current.notifications).toHaveLength(2);
  expect(result.current.notifications).toEqual([
    { id: '1', message: createNotificationMessage(events[0]) },
    { id: '2', message: createNotificationMessage(events[1]) },
  ]);
});
