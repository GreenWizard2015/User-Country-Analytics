import { act, fireEvent, render } from '@testing-library/react';
import { UsersChart, getPieChartOption } from 'components/UsersChart';

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

  it('should return the correct option for selected country', () => {
    const countries = [
      { id: 1, name: 'United States', users_count: 10 },
      { id: 2, name: 'Canada', users_count: 5 },
      { id: 3, name: 'Mexico', users_count: 0 },
    ];
    const { series: [{ selectedMap, selectedMode }] } = getPieChartOption(countries, 'Canada');
    expect(selectedMode).toEqual('single');
    expect(selectedMap).toEqual({ Canada: true });
  });

  // disabled because it's not working at all, due to the way echarts-for-react is implemented
  false && it('should call setCountry when a country is clicked', async () => {
    const setCountry = jest.fn();
    const countries = {
      data: [{ id: 1, name: 'United States', users_count: 10 },],
      loaded: true,
    };
    const chart = render(
      <UsersChart
        countries={countries}
        countriesUpdates={() => { }}
        setCountry={setCountry}
        activeCountry={null}
      />);
    // click at (200, 200) on the document
    await act(async () => {
      fireEvent.click(chart.container, { clientX: 200, clientY: 200 });
    });
    expect(setCountry).toHaveBeenCalledWith('United States');
  });
});
