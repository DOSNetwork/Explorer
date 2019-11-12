import React, { Component } from 'react'
import { Drawer, Form, Button, Col, Row, Input, InputNumber, Tooltip, Icon } from 'antd';
const { TextArea } = Input

class DrawerForm extends Component {
    state = { visible: false };

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Button type="primary" icon="plus-square" onClick={this.showDrawer}>New Node</Button>
                <Drawer
                    title="Request to Add NewNode"
                    width={360}
                    onClose={this.onClose}
                    visible={this.state.visible}
                >
                    <Form layout="vertical" hideRequiredMark>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label={<span>
                                    Node Address&nbsp;
                                    <Tooltip title="dos is the first thousandfold-coin">
                                        <Icon type="question-circle-o" />
                                    </Tooltip>
                                </span>}>
                                    {getFieldDecorator('nodeAddress', {
                                        rules: [{ required: true, message: 'Please enter node address' }],
                                    })(<Input placeholder="Please enter node address" />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label={<span>
                                    Dos Amount&nbsp;
                                    <Tooltip title="dos is the first thousandfold-coin">
                                        <Icon type="question-circle-o" />
                                    </Tooltip>
                                </span>}>
                                    {getFieldDecorator('dosAmount', {
                                        rules: [{ required: true, message: 'Please input dos amount' }],
                                        initialValue: 0,
                                    })(
                                        <InputNumber min={1} max={100000000} />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label={<span>
                                    Drop Burn Amount&nbsp;
                                    <Tooltip title="dos is the first thousandfold-coin">
                                        <Icon type="question-circle-o" />
                                    </Tooltip>
                                </span>}>
                                    {getFieldDecorator('dropBurnAmount', {
                                        rules: [{ required: true, message: 'Please input drop burn amount' }],
                                        initialValue: 3,
                                    })(
                                        <InputNumber />
                                    )}
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label={<span>
                                    Reward Cut&nbsp;
                                    <Tooltip title="dos is the first thousandfold-coin">
                                        <Icon type="question-circle-o" />
                                    </Tooltip>
                                </span>}>
                                    {getFieldDecorator('rewardCut', {
                                        rules: [{ required: true, message: 'Please input reward cut' }],
                                        initialValue: 2,

                                    })(
                                        <InputNumber min={1} max={999} />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label={<span>
                                    Node Description&nbsp;
                                    <Tooltip title="dos is the first thousandfold-coin">
                                        <Icon type="question-circle-o" />
                                    </Tooltip>
                                </span>}>
                                    {getFieldDecorator('nodeDescription', {
                                        rules: [{ required: true, message: 'Please input node description' }],
                                        initialValue: 2,

                                    })(
                                        <TextArea placeholder="node  description"
                                            autosize={{ minRows: 3, maxRows: 5 }} />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <div
                        style={{
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            width: '100%',
                            borderTop: '1px solid #e9e9e9',
                            padding: '10px 16px',
                            background: '#fff',
                            textAlign: 'right',
                        }}
                    >
                        <Button onClick={this.onClose} style={{ marginRight: 8 }}>Cancel</Button>
                        <Button onClick={this.onClose} type="primary">Submit</Button>
                    </div>
                </Drawer>
            </div>
        );
    }
}
const newNode = Form.create({
    name: 'nodeList-newNode',
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        return {
            nodeAddress: Form.createFormField({
                ...props.nodeAddress,
                value: props.nodeAddress.value,
            }),
            dosAmount: Form.createFormField({
                ...props.dosAmount,
                value: props.dosAmount.value,
            }),
            dropBurnAmount: Form.createFormField({
                ...props.dropBurnAmount,
                value: props.dropBurnAmount.value,
            }),
            rewardCut: Form.createFormField({
                ...props.rewardCut,
                value: props.rewardCut.value,
            }), nodeDescription: Form.createFormField({
                ...props.nodeDescription,
                value: props.nodeDescription.value,
            }),
        };
    },
    onValuesChange(_, values) {
        console.log(values);
    },
})(DrawerForm);

export default newNode

