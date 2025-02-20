# 항해 플러스 프론트엔드 4기 과제 7주차 <br/>: Chapter 3-1. 프론트엔드 테스트코드 (1)
- [난이도 선택 가이드](#난이도-선택-가이드)
  - [Easy](#easy)
  - [Medium](#medium)
  - [Hard](#hard)
- [과제 체크포인트](#과제-체크포인트)
    - [기본과제](#기본과제)
      - [Medium 질문](#medium-질문)
    - [심화과제](#심화과제)
- [과제 셀프회고](#과제-셀프회고)
  - [기술적 성장](#기술적-성장)
  - [학습 효과 분석](#학습-효과-분석)

## 난이도 선택 가이드

### Easy

- https://github.com/hanghae-plus/front_4th_chapter3-1/tree/easy
- 테스트를 처음 작성해보시는 분들을 위한 과제입니다. 가벼운 유틸함수, 훅 기반 단위 테스트를 작성해보면서 컴포넌트를 개선해보세요.
- 모든 테스트케이스, 설정이 제공됩니다.
- 작성을 해보고 피어 리뷰와 멘토들의 피드백을 받아보세요!
- **하지만, 모두 통과를 하더라도 합격을 받을 수는 없습니다. 가능하면 이 난이도를 선택하지 마세요**

### Medium

- https://github.com/hanghae-plus/front_4th_chapter3-1/tree/medium
- Easy에 비해 추가로 작성할 여러 통합 테스트가 존재합니다.
- PR template에 있는 여러 질문에 답을 해보면서 문제를 풀어보세요
- **Best가 불가능합니다**

### Hard

- https://github.com/hanghae-plus/front_4th_chapter3-1/tree/hard
- Medium과 동일한 TC를 작성하지만, 과제를 작성하기 위한 여러가지 설정을 제공드리지 않습니다.
- PR template에 있는 여러 질문에 답을 해보면서 문제를 풀어보세요!
- **적절하게 목적에 맞게 작성하셨을 경우 Best가 가능합니다.**

## 과제 체크포인트

### 기본과제

#### Medium 질문

- [x] 총 11개의 파일, 115개의 단위 테스트를 무사히 작성하고 통과시킨다.

#### 질문

> Q. medium.useEventOperations.spec.tsx > 아래 toastFn과 mock과 이 fn은 무엇을 해줄까요?
```javascript
const toastFn = vi.fn();

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => toastFn,
  };
});
```

- `toastFn`: 모의함수로 호출 여부나 호출된 인자 등을 추적할 수 있습니다.
- 실제 `@chakra-ui/react` 라이브러리 모듈을 가져와서 `actual`변수에 저장합니다.
- 기존의 모듈 내용은 유지하면서 `useToast` 훅을 `toastFn`을 반환하는 함수로 덮어씌웁니다.
- `toastFn`으로 라이브러리 모듈의 `useToast` 기능을 구현하며 테스트 해볼 수 있습니다.

> Q. medium.integration.spec.tsx > 여기서 ChakraProvider로 묶어주는 동작은 의미있을까요? 있다면 어떤 의미일까요?
```typescript
const setup = (element: ReactElement) => {
  const user = userEvent.setup();

  return { ...render(<ChakraProvider>{element}</ChakraProvider>), user }; // ? Medium: 여기서 ChakraProvider로 묶어주는 동작은 의미있을까요? 있다면 어떤 의미일까요?
};
```

- Chakra UI의 테마와 스타일 컨텍스트를 애플리케이션 전반에 제공하기 위해서 `<ChakraProvider />`로 `<APP />`을 감싸줘야 합니다.
- Chakra UI의 `useToast`, `extendTheme` 등의 기능을 사용하기 위한 필수 설정입니다.

> Q. handlersUtils > 아래 여러가지 use 함수는 어떤 역할을 할까요? 어떻게 사용될 수 있을까요?
```typescript
export const setupMockHandlerCreation = (initEvents = [] as Event[]) => {
  const mockEvents: Event[] = [...initEvents];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.post('/api/events', async ({ request }) => {
      const newEvent = (await request.json()) as Event;
      newEvent.id = String(mockEvents.length + 1); // 간단한 ID 생성
      mockEvents.push(newEvent);
      return HttpResponse.json(newEvent, { status: 201 });
    })
  );
};
```

- msw에서 제공해주는 API인 `setupServer`는 Node.js 환경에서 API 요청을 가로채는 서버를 설정하는 함수입니다.
- `use` 메소드는 실행 중인 서버에 새로운 요청 핸들러를 동적으로 추가하는 역할을 합니다.
- `use` 메소드를 사용하여 특정 테스트에서만 필요한 API 응답을 변경해줄 수 있습니다.

> Q. setupTests.ts > 왜 이 시간을 설정해주는 걸까요?
```javascript
beforeEach(() => {
  expect.hasAssertions();

  vi.setSystemTime(new Date('2024-10-01'));
});
```

- `vi.setSystemTime`는 테스트에서 현재 시간을 고정해주는 함수입니다.
- 테스트 실행 중에 `new Date`와 같은 시간 API를 호출했을 때, 원하는 특정 날짜/시간을 반환하도록 설정할 수 있습니다.
- 날짜나 시간 기능을 테스트 할 때 유용하게 쓸 수 있습니다.

### 심화과제

- [ ] App 컴포넌트 적절한 단위의 컴포넌트, 훅, 유틸 함수로 분리했는가?
- [ ] 해당 모듈들에 대한 적절한 테스트를 2개 이상 작성했는가?

## 과제 셀프회고

### 기술적 성장

> 🌐 msw 개념 학습

#### MSW
- API Mocking 라이브러리
- 서버향의 네트워크 요청을 가로채서 모의 응답을 보내주는 역할을 합니다.
- Mock 서버를 구축하지 않아도 API를 네트워크 수준에서 Mocking할 수 있습니다.

#### Service Worker
- 웹 애플리케이션 메인 스레드와 분리된 별도의 백그라운드 스레드에서 실행시킬 수 있는 기술 중 하나입니다.
- 애플리케이션과 서버 사이의 Request를 가로채서 직접 Fetch에 대한 컨트롤을 할 수 있습니다.

#### MSW 동작 방식
1) 브라우저에 service worker 설치
2) 브라우저에서 실제 이루어지는 http요청을 service worker가 가로챔
3) service worker는 실제 요청을 복사해서 msw에게 해당 요청과 일치하는 모의 응답을 받고, 이를 브라우저에게 전달
=> 이렇게 mocking이 가능해지면 API가 아직 준비되지 않아도 프론트엔드 개발자는 애플리케이션 개발을 할 수 있습니다.

> 🐙 테스트 코드 작성 시 가장 많이 사용한 테스팅 라이브러리 API

```javascript
import {render, screen} from '@testing-library/react'

test('should show login form', () => {
  render(<Login />)
  const input = screen.getByLabelText('Username')
})
```
1) `render` : 리액트 렌더링 수행
2) `screen` : 렌더링된 화면처럼 인터페이스가 구현된 객체에 접근

3) `waitFor` : 비동기적 인터렉션이나 요소의 생성/수정/삭제 등을 기다려야하는 상황에서 사용
4) `userEvent` : 사용자가 실제로 수행할 수 있는 상호작용을 시뮬레이션함

5) `getByText()` : 텍스트를 기반으로 대상 가져오기
6) `getByRole()` : 접근성 트리에서 role 기반으로 대상 가져오기
7) `getByTestId()` : test용 id 속성을 넣어 대상 가져오기
8) `getByLabelText()` : label 속을 기반으로 대상 가져오기

> ⚡ 테스트 코드 작성 시 가장 많이 사용한 vitest API

1) `beforeEach` : 각각 테스트가 실행되기 전에 호출되는 훅
2) `afterEach`: 각각 테스트가 실행된 후 호출되는 훅
3) `beforeAll` : 모든 테스트가 실행되기 전에 호출되는 훅
4) `afterAll` : 모든 테스트가 실행된 후 호출되는 

5) `expect` : 기대값과 비교하기 위해 객체를 생성하는 훅
6) `toBe` : `===` 비교
7) `toEqual` : `===` 비교 이면서 재귀적으로 깊은 비교를 진행
8) `toHaveLength` : `length` 프로퍼티를 비교
9) `toHaveBeenCalled` : 함수가 호출되었는지 확인하는 

10) `vi.fn()` : 모의 함수 생성
11) `vi.mock()` : 모듈을 모의화 진행
12) `vi.spyOn()` : 객체의 메서드를 감시

### 학습 효과 분석

> 🚀 msw로 API 모킹하고 테스트 코드 작성하기

- msw를 사용하여 이벤트 관련 API를 처리하는 `setupMockHandler~` 함수들이 미리 제공되어 있었습니다.
- 위 함수들을 통해 mock 이벤트 데이터를 생성/수정/삭제하여 백엔드 없이 테스트 코드에서 이벤트 API를 모킹할 수 있습니다.

```typescript
export const setupMockHandlerCreation = (initEvents = [] as Event[]) => {
  const mockEvents: Event[] = [...initEvents];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.post('/api/events', async ({ request }) => {
      const newEvent = (await request.json()) as Event;
      newEvent.id = String(mockEvents.length + 1); // 간단한 ID 생성
      mockEvents.push(newEvent);
      return HttpResponse.json(newEvent, { status: 201 });
    })
  );
};
```

- `setup` 유틸 함수를 사용하여 `App` 컴포넌트를 렌더링하고,
- `saveSchedule` 유틸 함수를 사용하여 일정을 저장합니다.

```typescript
const setup = (element: ReactElement) => {
  const user = userEvent.setup();

  return { ...render(<ChakraProvider>{element}</ChakraProvider>), user }; 
};

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
```

- 처음에 `App` 컴포넌트가 렌더링 되면, 저장된 일정이 없으므로 '검색 결과가 없습니다' 라는 텍스트가 노출되어야 합니다.
- `saveSchedule` 함수를 통해 원하는 일정을 등록 및 저장합니다.
- `event-list`라는 test용 id를 찾아 화면에 잘 뜨는지 확인합니다.
- 테스트가 정상 작동하는지 실행합니다.

```javascript
describe('일정 CRUD 및 기본 기능', () => {
  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
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
};
```
