import React from "react";
import { Modal, Form, Input } from "antd";

const newNode = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const {
        visible,
        confirmLoading,
        onCancel,
        onCreate,
        form,
        modalText
      } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          confirmLoading={confirmLoading}
          title="Staking a new node"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="Node Address">
              {getFieldDecorator("nodeAddr", {
                rules: [
                  {
                    required: true,
                    message: "Please input the address of node!"
                  }
                ]
              })(<Input placeholder="0x" />)}
            </Form.Item>
            <Form.Item label="Staking Amount">
              {getFieldDecorator("tokenAmount", {
                rules: [
                  {
                    required: true,
                    message: "Please input the staking token amount!"
                  }
                ]
              })(<Input placeholder="50000.0" />)}
            </Form.Item>
            <Form.Item label="Drop Burn Amount">
              {getFieldDecorator("dbAmount", {
                rules: [
                  {
                    required: false,
                    message: "Please input drop burn token amount"
                  }
                ]
              })(<Input placeholder="0.0" />)}
            </Form.Item>
            <Form.Item label="Reward Cut Rate">
              {getFieldDecorator("cutRate", {
                rules: [
                  {
                    required: true,
                    message: "Please input the reward cut rate"
                  }
                ]
              })(<Input placeholder="10" />)}
            </Form.Item>
            <Form.Item label="Description">
              {getFieldDecorator("description")(<Input type="textarea" />)}
            </Form.Item>
          </Form>
          <p>{modalText}</p>
        </Modal>
      );
    }
  }
);
export default newNode;
