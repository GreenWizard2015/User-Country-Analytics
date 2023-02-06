// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// fix warning in echarts-for-react during tests
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";

ReactECharts.prototype.getEchartsInstance = function() {
  const _this = this;
  const e = _this.echarts; // Access the protected property.
  // Explicitly add width and height in opts.
  const opts = { width: "400px", height: "400px", ..._this.props.opts };
  return (
    e.getInstanceByDom(_this.ele) || e.init(_this.ele, _this.props.theme, opts)
  );
};

jest.mock("components/CustomDatePicker"); // mock CustomDatePicker for testing purposes