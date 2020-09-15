/* eslint-disable no-lonely-if */
/* eslint-disable no-mixed-operators */
import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

const pipelineWidth = 300;
const pipelineHeight = 200;
const colorBox = {
  SUCCESS: 'green',
  FAILURE: 'red',
  TODO: 'rgb(192,192,192)',
};

class Pipeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCheckedBox: 1,
    };
  }
    onChartClick=(e) => {
      const { onChartClick } = this.props;
      if (onChartClick) onChartClick(e);
      this.setState({ currentCheckedBox: e.data.toolId });
    }
    getData=(pipelineJson, pipeline, x, y) => {
      const { nodeOrNodeList, nodeList, runType, name, toolId } = pipelineJson;
      let [w, h] = [1, 0];
      if (nodeOrNodeList === 'nodeList') {
        let [myx, myy] = [x, y];
        nodeList.forEach((node, index) => {
          if (node.nodeOrNodeList === 'node') {
            if (runType === 'serial') {
              myx = x + w * pipelineWidth;
              w += 1;
            } else {
              if (index > 0) {
                myy = y + h * pipelineHeight;
              }
              myx = x + pipelineWidth;
              h += 1;
            }
            this.getData(node, pipeline, myx, myy);
          } else {
            if (runType === 'serial') {
              w += 1;
              this.getData(node, pipeline, myx, myy);
            } else {
              if (index > 0) {
                myy = y + h * pipelineHeight;
              }
              h += 1;
              w += this.getData(node, pipeline, x, myy).w;
            }
          }
        });
      } else {
        let data = { name, x, y, toolId };
        const { toolResult } = this.props;
        if (toolResult) {
          const status = toolResult[toolId] ? toolResult[toolId].status : null;
          data = {
            ...data,
            label: {
              normal: {
                color: status ? colorBox[status] : 'black',
                // backgroundColor: '#fff',
                borderColor: status ? colorBox[status] : 'black',
              },
            },
          };
        }
        if (toolId === this.state.currentCheckedBox) {
          if (!data.label) {
            data = {
              ...data,
              label: {},
            };
          }
          data.label.normal = {
            ...data.label.normal,
            borderWidth: 1.2,
            borderColor: '#00b4ed',
          };
        }
        pipeline.push(data);
      }
      return { pipeline, w };
    }
    getSeriesData=(pipelineJson) => {
      const pipeline = [{
        name: '开始',
        x: 100,
        y: 100,
      }];
      if (pipelineJson) {
        let pipelineData = [];
        if (pipelineJson.nodeOrNodeList === 'nodeList') {
          const data = this.getData(pipelineJson, pipeline, 100, 100).pipeline;
          pipelineData = [...data];
          pipelineData.push({
            name: '结束',
            x: this.getMaxX(data) + pipelineWidth,
            y: 100,
          });
        } else {
          pipelineData = [
            ...pipeline,
            {
              name: pipelineJson.name,
              x: 400,
              y: 100,
              toolId: pipelineJson.toolId,
            },
            {
              name: '结束',
              x: 700,
              y: 100,
            },
          ];
        }
        return pipelineData;
      } else {
        return [
          ...pipeline,
          {
            name: '结束',
            x: 400,
            y: 100,
          },
        ];
      }
    }
    getLinks=(pipelineJson, links, source, target, end = false) => {
      if (pipelineJson && pipelineJson.nodeOrNodeList === 'nodeList') {
        const { nodeList, runType } = pipelineJson;
        if (runType === 'parallel') {
          nodeList.forEach((node) => {
            this.getLinks(node, links, source, target, true);
          });
        } else {
          let parent = source;
          nodeList.forEach((node, index) => {
            let myTargetName = target;
            if (nodeList.length > index + 1) {
              let myTarget = { ...nodeList[index + 1] };
              while (myTarget.nodeOrNodeList === 'nodeList') {
                myTarget = { ...myTarget.nodeList[0] };
              }
              myTargetName = myTarget.name;
            }
            this.getLinks(node, links, parent, myTargetName, nodeList.length === index + 1);
            parent = node.name;
          });
        }
      } else if (pipelineJson) {
        links.push({
          source,
          target: pipelineJson.name,
        });
        if (end) {
          links.push({
            source: pipelineJson.name,
            target,
          });
        }
      } else {
        return [
          { source: '开始',
            target: '结束' },
        ];
      }
      return links;
    }
    getSeriesLinks=(pipelineJson) => {
      const links = [];
      return this.getLinks(pipelineJson, links, '开始', '结束',
        pipelineJson ? pipelineJson.nodeOrNodeList === 'node' : false);
    }
    getMaxX=(data) => {
      const xList = typeof data === 'object' ? data.map(item => item.x) : [];
      return Math.max(...xList);
    }
    render() {
      const { record, widthSize, heightSize } = this.props;
      const option = {
        //   color: ['#aed4c3', '#dea38f'],
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            type: 'graph',
            layout: 'none',
            roam: true,
            edgeLabel: {
              normal: {
                textStyle: {
                  fontSize: 20,
                },
              },
            },
            data: this.getSeriesData(record),
            links: this.getSeriesLinks(record),
            symbol: 'rect',
            symbolSize: [86, 30],
            // edgeSymbol: ['none', 'arrow'],
            edgeSymbolSize: [4, 6],
            lineStyle: {
              normal: {
                opacity: 0.8,
                type: 'dashed',
                width: 1,
                curveness: 0,
              },
            },
            itemStyle: {
              normal: {
                color: 'transparent',
                borderColor: 'transparent',
                //   borderWidth: 1,
              },
            },
            label: {
              normal: {
                show: true,
                color: '#737373',
                backgroundColor: '#fff',
                borderColor: '#9a9a9a',
                borderWidth: 1,
                borderRadius: 20,
                padding: [8, 20],
              },
            },
          },
        ],
      };
      const onEvents = {
        click: this.onChartClick,
      };
      return (
        <div>
          <ReactEcharts
            option={option}
            onEvents={onEvents}
            style={{ height: heightSize || '280px', width: widthSize || '100%' }}
          />
        </div>
      );
    }
}
export default Pipeline;
