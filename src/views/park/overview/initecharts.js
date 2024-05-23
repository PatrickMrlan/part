function chartColumn1(chartColumn, option) {
  option = JSON.parse(JSON.stringify(option));
  chartColumn.showLoading();
  option.series[0].data = [
    { value: 1048, name: "Ⅰ级风险", itemStyle: { color: "rgb(92, 181, 255)" } },
    { value: 735, name: "Ⅱ级风险", itemStyle: { color: "rgb(249, 223, 54)" } },
    { value: 580, name: "Ⅲ级风险", itemStyle: { color: "rgb(249, 156, 55)" } },
    { value: 484, name: "Ⅳ级风险", itemStyle: { color: "rgb(245, 34, 45)" } },
    { value: 300, name: "未知风险" }
  ];
  option.title.text = "20";
  option.title.subtext = "企业总数";
  chartColumn.hideLoading();
  chartColumn.setOption(option);
  window.addEventListener("resize", chartColumn.resize);
}

function chartColumn2(chartColumn, option) {
  option = JSON.parse(JSON.stringify(option));
  chartColumn.showLoading();
  option.xAxis.data = [
    "高危",
    "冶金",
    "有色",
    "建材",
    "机械",
    "轻工",
    "纺织",
    "烟草",
    "商贸"
  ];
  option.series[0].data = [6, 3, 4, 2, 1, 0, 2, 1, 1];
  chartColumn.hideLoading();
  chartColumn.setOption(option);
  window.addEventListener("resize", chartColumn.resize);
}

function chartColumn3(chartColumn, option) {
  option = JSON.parse(JSON.stringify(option));
  chartColumn.showLoading();
  option.series[0].data = [
    { value: 1048, name: "一级", itemStyle: { color: "rgb(92, 181, 255)" } },
    { value: 735, name: "二级", itemStyle: { color: "rgb(249, 223, 54)" } },
    { value: 580, name: "三级", itemStyle: { color: "rgb(249, 156, 55)" } },
    { value: 484, name: "四级", itemStyle: { color: "rgb(245, 34, 45)" } }
  ];
  option.title.text = "227";
  option.title.subtext = "总大危险源";
  chartColumn.hideLoading();
  chartColumn.setOption(option);
  window.addEventListener("resize", chartColumn.resize);
}

function chartColumn4(chartColumn, option) {
  option = JSON.parse(JSON.stringify(option));
  chartColumn.showLoading();
  option.series[0].data = [
    { value: 8, name: "一般风险", itemStyle: { color: "rgb(92, 181, 255)" } },
    { value: 8, name: "低风险", itemStyle: { color: "rgb(249, 223, 54)" } },
    { value: 7, name: "较大风险", itemStyle: { color: "rgb(249, 156, 55)" } },
    { value: 2, name: "重大风险", itemStyle: { color: "rgb(245, 34, 45)" } }
  ];
  option.title.text = "25";
  option.title.subtext = "公共风险";
  chartColumn.hideLoading();
  chartColumn.setOption(option);
  window.addEventListener("resize", chartColumn.resize);
}

function chartColumn5(chartColumn, option) {
  option = JSON.parse(JSON.stringify(option));
  chartColumn.showLoading();
  option.yAxis = {
    type: "category",
    data: [2022, 2023]
  };
  option.xAxis = {
    type: "value"
  };
  option.series = [
    {
      name: "已开展演练企业",
      data: [100, 150],
      type: "bar",
      label: {
        show: true,
        position: "right"
      },
      itemStyle: {
        color: "#5AD8A6"
      }
    },
    {
      name: "未开展演练企业",
      data: [110, 140],
      type: "bar",
      label: {
        show: true,
        position: "right"
      },
      itemStyle: {
        color: "#5D7092"
      }
    }
  ];
  chartColumn.hideLoading();
  chartColumn.setOption(option);
  window.addEventListener("resize", chartColumn.resize);
}

function chartColumn6(chartColumn, option) {
  option = JSON.parse(JSON.stringify(option));
  chartColumn.showLoading();
  option.xAxis.data = [
    "12月",
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月"
  ];
  option.legend.data = ["重大隐患", "一般隐患"];
  option.series[0] = {
    name: "一般隐患",
    type: "line",
    smooth: true,
    stack: "Total",
    data: [4, 3, 4, 2, 2, 6, 3, 5, 4, 7, 3, 6],
    itemStyle: { color: "rgb(92, 181, 255)" }
  };
  option.series[1] = {
    name: "重大隐患",
    type: "line",
    smooth: true,
    stack: "Total",
    data: [4, 2, 5, 3, 3, 2, 1, 2, 2, 6, 3, 4],
    itemStyle: { color: "rgb(249, 156, 55)" }
  };
  chartColumn.hideLoading();
  chartColumn.setOption(option);
  window.addEventListener("resize", chartColumn.resize);
}

function chartColumn7(chartColumn, option) {
  chartColumn.showLoading();
  const option1 = {
    tooltip: {
      formatter: "{a} <br/>{b} : {c}%"
    },
    series: [
      {
        name: "Pressure",
        type: "gauge",
        radius: "64%",
        center: ["24%", "50%"],
        detail: {
          formatter: "{value}"
        },
        axisLine: {
          show: true
        },
        data: [
          {
            value: 50,
            name: "SCORE"
          }
        ],
        itemStyle: {
          color: "#739FFA"
        }
      },
      {
        name: "Pressure1",
        type: "gauge",
        radius: "64%",
        center: ["76%", "50%"],
        detail: {
          formatter: "{value}"
        },
        axisLine: {
          show: true
        },
        data: [
          {
            value: 50,
            name: "SCORE"
          }
        ],
        itemStyle: {
          color: "#72DDB3"
        }
      }
    ]
  };
  chartColumn.hideLoading();
  chartColumn.setOption(option1);
  window.addEventListener("resize", chartColumn.resize);
}

function chartColumn8(chartColumn, option) {
  chartColumn.showLoading();
  const option1 = {
    tooltip: {
      trigger: "item"
    },
    title: {
      text: "36",
      x: "center",
      y: "center",
      textStyle: {
        fontWeight: "700",
        fontSize: "20"
      },
      subtext: "项目总数",
      subtextStyle: {
        fontSize: "14"
      },
      itemGap: 10,
      left: "center",
      top: "60%"
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "70%"],
        startAngle: 180,
        label: {
          show: true,
          formatter(param) {
            return param.name + " (" + param.percent * 2 + "%)";
          }
        },
        data: [
          { value: 1048, name: "前期", itemStyle: { color: "#5470C6" } },
          { value: 735, name: "设计", itemStyle: { color: "#91CC75" } },
          { value: 580, name: "施工", itemStyle: { color: "#FAC858" } },
          { value: 484, name: "验收", itemStyle: { color: "#EE6666" } },
          {
            value: 1048 + 735 + 580 + 484,
            itemStyle: {
              color: "none",
              decal: {
                symbol: "none"
              }
            },
            label: {
              show: false
            }
          }
        ]
      }
    ]
  };
  chartColumn.hideLoading();
  chartColumn.setOption(option1);
  window.addEventListener("resize", chartColumn.resize);
}

function chartColumn9(chartColumn, option) {
  option = JSON.parse(JSON.stringify(option));
  chartColumn.showLoading();
  option.xAxis.data = [2018, 2019, 2020, 2021, 2022, 2023];
  option.series[0] = {
    type: "line",
    data: [8, 6, 9, 7, 5, 3],
    itemStyle: { color: "#5B8FF9" }
  };
  chartColumn.hideLoading();
  chartColumn.setOption(option);
  window.addEventListener("resize", chartColumn.resize);
}

function chartColumn10(chartColumn, option) {
  option = JSON.parse(JSON.stringify(option));
  chartColumn.showLoading();
  option.xAxis.data = [
    "2019-01",
    "2019-02",
    "2019-03",
    "2019-04",
    "2019-05",
    "2019-06"
  ];
  option.legend.data = ["气象", "地震", "水务"];
  option.series[0] = {
    name: "气象",
    type: "line",
    data: [8, 6, 9, 7, 5, 3],
    itemStyle: { color: "#269A99" }
  };
  option.series[1] = {
    name: "地震",
    type: "line",
    data: [4, 7, 5, 3, 6, 9],
    itemStyle: { color: "#E8684A" }
  };
  option.series[2] = {
    name: "水务",
    type: "line",
    data: [7, 8, 6, 9, 5, 3],
    itemStyle: { color: "#5B8FF9" }
  };
  chartColumn.hideLoading();
  chartColumn.setOption(option);
  window.addEventListener("resize", chartColumn.resize);
}

function chartColumn11(chartColumn, option) {
  option = JSON.parse(JSON.stringify(option));
  chartColumn.showLoading();
  option.xAxis.data = [
    "2019-01",
    "2019-02",
    "2019-03",
    "2019-04",
    "2019-05",
    "2019-06"
  ];
  option.legend.data = ["园区履职预警", "企业主体责任预警"];
  option.series[0] = {
    name:"园区履职预警",
    type: "line",
    data: [8, 6, 9, 7, 5, 3],
    itemStyle: { color: "#269A99" }
  };
  option.series[1] = {
    name:"企业主体责任预警",
    type: "line",
    data: [4, 7, 5, 3, 6, 9],
    itemStyle: { color: "#5B8FF9" }
  };
  chartColumn.hideLoading();
  chartColumn.setOption(option);
  window.addEventListener("resize", chartColumn.resize);
}

function chartColumn13(chartColumn, option) {
  option = JSON.parse(JSON.stringify(option));
  chartColumn.showLoading();
  option.xAxis.data = [2017, 2018, 2019, 2020, 2021, 2022, 2023];
  option.legend.data = ["低风险", "一般风险", "较大风险", "重大风险"];
  option.series[0] = {
    name: "低风险",
    type: "line",
    stack: "Total",
    data: [4, 3, 4, 2, 2, 6, 3],
    itemStyle: { color: "rgb(92, 181, 255)" }
  };
  option.series[1] = {
    name: "一般风险",
    type: "line",
    stack: "Total",
    data: [4, 2, 5, 3, 3, 2, 1],
    itemStyle: { color: "rgb(249, 156, 55)" }
  };
  option.series[2] = {
    name: "较大风险",
    type: "line",
    stack: "Total",
    data: [4, 2, 1, 5, 2, 4, 3]
  };
  option.series[3] = {
    name: "重大风险",
    type: "line",
    stack: "Total",
    data: [2, 3, 1, 0, 2, 1, 4],
    itemStyle: { color: "rgb(245, 34, 45)" }
  };
  chartColumn.hideLoading();
  chartColumn.setOption(option);
  window.addEventListener("resize", chartColumn.resize);
}

function chartColumn15(chartColumn, option) {
  option = JSON.parse(JSON.stringify(option));
  chartColumn.showLoading();
  option.xAxis.data = [2018, 2019, 2020, 2021, 2022, 2023];
  option.series[0] = {
    type: "line",
    data: [60, 45, 56, 37, 29, 30],
    itemStyle: { color: "#5B8FF9" }
  };
  option.title.text = "项目建设历史统计";
  chartColumn.hideLoading();
  chartColumn.setOption(option);
  window.addEventListener("resize", chartColumn.resize);
}
export {
  chartColumn1,
  chartColumn2,
  chartColumn3,
  chartColumn4,
  chartColumn5,
  chartColumn6,
  chartColumn7,
  chartColumn8,
  chartColumn9,
  chartColumn10,
  chartColumn11,
  chartColumn13,
  chartColumn15
};
