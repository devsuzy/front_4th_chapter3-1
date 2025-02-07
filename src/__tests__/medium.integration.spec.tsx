import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within, waitFor } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';
// import { http, HttpResponse } from 'msw';
import { ReactElement } from 'react';

import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../__mocks__/handlersUtils';
import App from '../App';
// import { server } from '../setupTests';
import { Event } from '../types';

afterEach(() => {
  vi.useRealTimers();
});

// ! HINT. 이 유틸을 사용해 리액트 컴포넌트를 렌더링해보세요.
const setup = (element: ReactElement) => {
  const user = userEvent.setup();

  return { ...render(<ChakraProvider>{element}</ChakraProvider>), user }; // ? Medium: 여기서 ChakraProvider로 묶어주는 동작은 의미있을까요? 있다면 어떤 의미일까요?
};

// ! HINT. 이 유틸을 사용해 일정을 저장해보세요.
const saveSchedule = async (
  user: UserEvent,
  form: Omit<Event, 'id' | 'notificationTime' | 'repeat'>
) => {
  const { title, date, startTime, endTime, location, description, category } = form;

  await user.click(screen.getAllByText('일정 추가')[0]);

  await user.type(screen.getByLabelText('제목'), title);
  await user.type(screen.getByLabelText('날짜'), date);
  await user.type(screen.getByLabelText('시작 시간'), startTime);
  await user.type(screen.getByLabelText('종료 시간'), endTime);
  await user.type(screen.getByLabelText('설명'), description);
  await user.type(screen.getByLabelText('위치'), location);
  await user.selectOptions(screen.getByLabelText('카테고리'), category);

  await user.click(screen.getByTestId('event-submit-button'));
};

// Events
const octoberEvents: Event[] = [
  {
    id: '1',
    title: '새로운 일정',
    date: '2024-10-01',
    startTime: '10:00',
    endTime: '11:00',
    description: '새로운 일정입니다.',
    location: '사무실',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 0,
  },
  {
    id: '2',
    title: '기존 일정',
    date: '2024-10-08',
    startTime: '10:00',
    endTime: '11:00',
    description: '기존 일정입니다.',
    location: '회의실',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 0,
  },
  {
    id: '3',
    title: '삭제할 이벤트',
    date: '2024-10-15',
    startTime: '09:00',
    endTime: '10:00',
    description: '삭제할 이벤트입니다',
    location: '어딘가',
    category: '기타',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '4',
    title: '팀 회의',
    date: '2024-10-22',
    startTime: '10:00',
    endTime: '11:00',
    description: '개발팀 회의',
    location: '회의실',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
  {
    id: '5',
    title: '겹치는 일정',
    date: '2024-10-01',
    startTime: '10:30',
    endTime: '11:30',
    description: '겹치는 일정입니다.',
    location: '사무실',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 0,
  },
  {
    id: '6',
    title: '충돌하는 일정',
    date: '2024-10-08',
    startTime: '11:30',
    endTime: '12:30',
    description: '충돌하는 일정입니다.',
    location: '회의실',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 0,
  },
];

const decemberEvents: Event[] = [
  {
    id: '1',
    title: '12월 일정',
    date: '2024-12-01',
    startTime: '10:00',
    endTime: '11:00',
    description: '12월 일정입니다.',
    location: '카페',
    category: '개인',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  },
];

// ! HINT. "검색 결과가 없습니다"는 초기에 노출되는데요. 그럼 검증하고자 하는 액션이 실행되기 전에 검증해버리지 않을까요? 이 테스트를 신뢰성있게 만드려면 어떻게 할까요?
describe('일정 CRUD 및 기본 기능', () => {
  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
    // ! HINT. event를 추가 제거하고 저장하는 로직을 잘 살펴보고, 만약 그대로 구현한다면 어떤 문제가 있을 지 고민해보세요.
    setupMockHandlerCreation();

    const { user } = setup(<App />);

    await waitFor(() => {
      expect(screen.getByText(/검색 결과가 없습니다/)).toBeInTheDocument();
    });

    await saveSchedule(user, octoberEvents[0]);

    const eventList = await screen.getByTestId('event-list');

    await waitFor(async () => {
      expect(within(eventList).getByText('새로운 일정')).toBeInTheDocument();
      expect(within(eventList).getByText('2024-10-01')).toBeInTheDocument();
      expect(within(eventList).getByText('10:00 - 11:00')).toBeInTheDocument();
      expect(within(eventList).getByText('새로운 일정입니다.')).toBeInTheDocument();
      expect(within(eventList).getByText('사무실')).toBeInTheDocument();
      expect(within(eventList).getByText('카테고리: 업무')).toBeInTheDocument();
    });
  });

  it('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', async () => {
    setupMockHandlerUpdating([octoberEvents[1]]);

    const { user } = setup(<App />);

    const eventList = screen.getByTestId('event-list');

    await waitFor(() => {
      expect(within(eventList).getByText('기존 일정')).toBeInTheDocument();
      expect(within(eventList).getByText('2024-10-08')).toBeInTheDocument();
      expect(within(eventList).getByText(/10:00/)).toBeInTheDocument();
      expect(within(eventList).getByText(/11:00/)).toBeInTheDocument();
      expect(within(eventList).getByText('기존 일정입니다.')).toBeInTheDocument();
      expect(within(eventList).getByText('회의실')).toBeInTheDocument();
      expect(within(eventList).getByText(/업무/)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Edit event/i }));

    await user.clear(screen.getByLabelText(/제목/));
    await user.type(screen.getByLabelText(/제목/), '수정된 일정');
    await user.clear(screen.getByLabelText(/날짜/));
    await user.type(screen.getByLabelText(/날짜/), '2024-10-18');
    await user.clear(screen.getByLabelText(/시작 시간/));
    await user.type(screen.getByLabelText(/시작 시간/), '13:00');
    await user.clear(screen.getByLabelText(/종료 시간/));
    await user.type(screen.getByLabelText(/종료 시간/), '14:00');
    await user.clear(screen.getByLabelText(/설명/));
    await user.type(screen.getByLabelText(/설명/), '수정된 일정입니다.');
    await user.clear(screen.getByLabelText(/위치/));
    await user.type(screen.getByLabelText(/위치/), '카페');
    await user.selectOptions(screen.getByLabelText(/카테고리/), '개인');

    await user.click(screen.getByRole('button', { name: /일정 수정/ }));

    const updatedEventList = await screen.findByTestId('event-list');

    await waitFor(() => {
      expect(within(updatedEventList).getByText('수정된 일정')).toBeInTheDocument();
      expect(within(updatedEventList).getByText('2024-10-18')).toBeInTheDocument();
      expect(within(updatedEventList).getByText(/13:00/)).toBeInTheDocument();
      expect(within(updatedEventList).getByText(/14:00/)).toBeInTheDocument();
      expect(within(updatedEventList).getByText('수정된 일정입니다.')).toBeInTheDocument();
      expect(within(updatedEventList).getByText('카페')).toBeInTheDocument();
      expect(within(updatedEventList).getByText(/개인/)).toBeInTheDocument();
    });
  });

  it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
    setupMockHandlerDeletion([octoberEvents[2]]);

    const { user } = setup(<App />);

    const eventList = screen.getByTestId('event-list');

    await waitFor(() => {
      expect(within(eventList).getByText('삭제할 이벤트')).toBeInTheDocument();
      expect(within(eventList).getByText('2024-10-15')).toBeInTheDocument();
      expect(within(eventList).getByText(/09:00/)).toBeInTheDocument();
      expect(within(eventList).getByText(/10:00/)).toBeInTheDocument();
      expect(within(eventList).getByText('삭제할 이벤트입니다')).toBeInTheDocument();
      expect(within(eventList).getByText('어딘가')).toBeInTheDocument();
      expect(within(eventList).getByText(/기타/)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /delete event/i }));

    await waitFor(() => {
      expect(within(eventList).getByText(/검색 결과가 없습니다/)).toBeInTheDocument();
    });
  });
});

describe('일정 뷰', () => {
  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {
    vi.setSystemTime(new Date('2024-11-01'));

    setupMockHandlerCreation();

    const { user } = setup(<App />);

    await user.selectOptions(screen.getByLabelText(/view/), 'week');

    const eventList = screen.getByTestId('event-list');

    expect(within(eventList).getByText(/검색 결과가 없습니다/)).toBeInTheDocument();
  });

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {
    vi.setSystemTime(new Date('2024-10-01'));

    setupMockHandlerCreation();

    const { user } = setup(<App />);

    await saveSchedule(user, octoberEvents[0]);

    await user.selectOptions(screen.getByLabelText(/view/), 'week');

    const eventList = screen.getByTestId('event-list');

    expect(within(eventList).getByText('새로운 일정')).toBeInTheDocument();
    expect(within(eventList).getByText('2024-10-01')).toBeInTheDocument();
    expect(within(eventList).getByText(/10:00/)).toBeInTheDocument();
    expect(within(eventList).getByText(/11:00/)).toBeInTheDocument();
    expect(within(eventList).getByText('새로운 일정입니다.')).toBeInTheDocument();
    expect(within(eventList).getByText('사무실')).toBeInTheDocument();
    expect(within(eventList).getByText(/업무/)).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {
    vi.setSystemTime(new Date('2024-11-01'));

    setupMockHandlerCreation();

    const { user } = setup(<App />);

    await user.selectOptions(screen.getByLabelText(/view/), 'month');

    const eventList = screen.getByTestId('event-list');

    expect(within(eventList).getByText(/검색 결과가 없습니다/)).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
    vi.setSystemTime(new Date('2024-12-01'));

    setupMockHandlerCreation();

    const { user } = setup(<App />);

    await saveSchedule(user, decemberEvents[0]);

    await user.selectOptions(screen.getByLabelText(/view/), 'month');

    const eventList = screen.getByTestId('event-list');

    expect(within(eventList).getByText('12월 일정')).toBeInTheDocument();
    expect(within(eventList).getByText('2024-12-01')).toBeInTheDocument();
    expect(within(eventList).getByText(/10:00/)).toBeInTheDocument();
    expect(within(eventList).getByText(/11:00/)).toBeInTheDocument();
    expect(within(eventList).getByText('12월 일정입니다.')).toBeInTheDocument();
    expect(within(eventList).getByText('카페')).toBeInTheDocument();
    expect(within(eventList).getByText(/개인/)).toBeInTheDocument();
  });

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
    vi.setSystemTime(new Date('2024-01-01'));

    const { user } = setup(<App />);

    await user.selectOptions(screen.getByLabelText(/view/), 'month');

    const monthView = await screen.getByTestId('month-view');

    expect(within(monthView).getByText(/신정/)).toBeInTheDocument();
  });
});

describe('검색 기능', () => {
  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {
    setupMockHandlerCreation(octoberEvents);

    const { user } = setup(<App />);

    await user.type(screen.getByLabelText('일정 검색'), '홍길동');

    expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
  });

  it("'팀 회의'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {
    setupMockHandlerCreation(octoberEvents);

    const { user } = setup(<App />);

    const eventList = await screen.findByTestId('event-list');

    await user.type(screen.getByLabelText('일정 검색'), '팀 회의');

    await waitFor(() => expect(within(eventList).getByText('팀 회의')).toBeInTheDocument());

    await waitFor(() => {
      expect(within(eventList).getByText('팀 회의')).toBeInTheDocument();
      expect(within(eventList).getByText('2024-10-22')).toBeInTheDocument();
      expect(within(eventList).getByText(/10:00/)).toBeInTheDocument();
      expect(within(eventList).getByText(/11:00/)).toBeInTheDocument();
      expect(within(eventList).getByText('개발팀 회의')).toBeInTheDocument();
      expect(within(eventList).getByText('회의실')).toBeInTheDocument();
      expect(within(eventList).getByText(/업무/)).toBeInTheDocument();
    });
  });

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
    vi.setSystemTime(new Date('2024-10-01'));

    setupMockHandlerCreation(octoberEvents);

    const { user } = setup(<App />);

    await user.type(screen.getByLabelText('일정 검색'), '홍길동');

    expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument();

    await user.clear(screen.getByLabelText('일정 검색'));

    const eventItems = screen.getAllByTestId('event-item');
    expect(eventItems.length).toBe(octoberEvents.length);
  });
});

describe('일정 충돌', () => {
  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {
    setupMockHandlerCreation();

    const { user } = setup(<App />);

    await saveSchedule(user, octoberEvents[0]);
    await saveSchedule(user, octoberEvents[4]);

    expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
  });

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {
    setupMockHandlerCreation(octoberEvents);

    const { user } = setup(<App />);

    await user.type(screen.getByLabelText(/일정 검색/), '기존 일정');

    await user.click(screen.getByRole('button', { name: /Edit event/i }));

    await user.clear(screen.getByLabelText(/시작 시간/));
    await user.type(screen.getByLabelText(/시작 시간/), '11:00');
    await user.clear(screen.getByLabelText(/종료 시간/));
    await user.type(screen.getByLabelText(/종료 시간/), '12:00');

    await user.click(screen.getByRole('button', { name: /일정 수정/ }));

    expect(screen.getByText('일정 겹침 경고')).toBeInTheDocument();
    expect(screen.getByText(/다음 일정과 겹칩니다:/)).toBeInTheDocument();
    expect(screen.getByText(/계속 진행하시겠습니까?/)).toBeInTheDocument();
  });
});

it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {
  vi.setSystemTime(new Date('2024-12-01T09:50:00'));

  setupMockHandlerCreation(decemberEvents);

  const { user } = setup(<App />);

  await saveSchedule(user, decemberEvents[0]);

  await waitFor(() => {
    expect(screen.getByText(/일정이 시작됩니다./)).toBeInTheDocument();
    expect(screen.getByText('10분 전')).toBeInTheDocument();
  });

  vi.useRealTimers();
});
