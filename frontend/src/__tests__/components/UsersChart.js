import UsersChart, { getPieChartOption } from 'components/UsersChart';

describe('getPieChartOption', () => {
  it('should return the correct option for the pie chart', () => {
    const countries = [
      { id: 1, name: 'United States', users_count: 10 },
      { id: 2, name: 'Canada', users_count: 5 },
      { id: 3, name: 'Mexico', users_count: 0 },
    ];
    const expectedOption = {
      title: {
        text: 'Number of Users by Country',
        left: 'center',
      },
      series: [
        {
          type: 'pie',
          data: [
            { value: 10, name: 'United States' },
            { value: 5, name: 'Canada' },
            { value: 0, name: 'Mexico' },
          ],
        },
      ],
    };
    const option = getPieChartOption(countries);
    expect(option.title).toEqual(expectedOption.title);
    expect(option.series.length).toEqual(expectedOption.series.length);
    expect(option.series[0].type).toEqual(expectedOption.series[0].type);
    expect(option.series[0].data).toEqual(expectedOption.series[0].data);
  });
});
