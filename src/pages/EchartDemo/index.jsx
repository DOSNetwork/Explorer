import React, { Component } from 'react';
import EchartReact from 'echarts-for-react'
import deepClone from 'lodash.clonedeep'
class EchartDemo extends Component {
    constructor(props) {
        super(props)
        this.randomData = this.randomData.bind(this)
        this.getData = this.getData.bind(this)
        this.state = this.getInitialState()
    }
    timeTicket = null;

    now = +new Date(1997, 9, 3);
    oneDay = 24 * 3600 * 1000;
    getInitialState = () => {
        var data = [];
        for (var i = 0; i < 1000; i++) {
            data.push(this.randomData());
        }
        return {
            option: {
                title: {
                    text: '动态数据 + 时间坐标轴'
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        params = params[0];
                        var date = new Date(params.name);
                        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
                    },
                    axisPointer: {
                        animation: false
                    }
                },
                xAxis: {
                    type: 'time',
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    splitLine: {
                        show: false
                    }
                },
                series: [{
                    name: '模拟数据',
                    type: 'line',
                    showSymbol: false,
                    hoverAnimation: false,
                    data: data
                }]
            }
        }
    }
    componentDidMount() {
        if (this.timeTicket) {
            clearInterval(this.timeTicket);
        }
        this.timeTicket = setInterval(this.getData, 1000);
    }
    componentWillUnmount() {
        clearInterval(this.timeTicket);
        this.timeTicket = null
    }
    getData() {
        let option = deepClone(this.state.option)
        for (var i = 0; i < 5; i++) {
            option.series[0].data.shift();
            option.series[0].data.push(this.randomData());
        }
        this.setState({ option })
    }
    randomData() {
        let value = Math.random() * 1000;
        this.now = new Date(+this.now + this.oneDay);
        let now = this.now;
        value = value + Math.random() * 21 - 10;
        return {
            name: now.toString(),
            value: [
                [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
                Math.round(value)
            ]
        }
    }
    render() {
        return (
            <div>
                <p>Echart Demo</p>
                <EchartReact ref='echarts_react'
                    option={this.state.option} />
            </div>
        )
    }
}

export default EchartDemo
