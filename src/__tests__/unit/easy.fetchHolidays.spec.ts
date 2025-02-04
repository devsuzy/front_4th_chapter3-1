import { fetchHolidays } from '../../apis/fetchHolidays';

describe('fetchHolidays', () => {
  it('주어진 월의 공휴일만 반환한다', () => {
    const result = fetchHolidays(new Date('2024-02-01'));
    expect(result).toEqual({
      '2024-02-09': '설날',
      '2024-02-10': '설날',
      '2024-02-11': '설날',
    });
  });

  it('공휴일이 없는 월에 대해 빈 객체를 반환한다', () => {
    const result = fetchHolidays(new Date('2024-04-01'));
    expect(result).toEqual({});
  });

  it('여러 공휴일이 있는 월에 대해 모든 공휴일을 반환한다', () => {
    const result = fetchHolidays(new Date('2024-10-01'));
    expect(result).toEqual({
      '2024-10-03': '개천절',
      '2024-10-09': '한글날',
    });
  });

  it('한 개의 공휴일만 있는 월에 대해 공휴일을 반환한다', () => {
    const result = fetchHolidays(new Date('2024-03-01'));
    expect(result).toEqual({
      '2024-03-01': '삼일절',
    });
  });
});
