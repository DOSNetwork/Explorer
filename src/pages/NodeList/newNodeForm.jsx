import React from "react";
import { Modal, Form, Input } from "antd";
const ETHAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/
const newNode = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    validateAddress = (rule, value, callback) => {
      if (value) {
        if (!ETHAddressRegex.test(value)) {
          callback('Please enter a valid address')
        }
      }
      callback();
    };
    validateTokenAmount = (rule, value, callback) => {
      if (value) {
        let result = Number(value)
        if (Number.isNaN(result)) {
          callback('Please enter a valid number')
        }
        else if (result < 100000) {
          callback('Please enter a amount bigger than 100,000')
        }
      }
      callback()
    };
    validatCutRate = (rule, value, callback) => {
      if (value) {
        let result = Number(value)
        if (Number.isNaN(result)) {
          callback('Please enter a valid number')
        }
        else if (result > 100 || result < 0) {
          callback('Please enter a valid percentage')
        }
      }
      callback()
    };
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
            <Form.Item label="Name">
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "Please name your node"
                  }
                ]
              })(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label="Node Address">
              {getFieldDecorator("nodeAddr", {
                rules: [
                  {
                    required: true,
                    message: "Please enter your node address"
                  },
                  {
                    validator: this.validateAddress,
                  }
                ]
              })(<Input placeholder="0x" />)}
            </Form.Item>
            <Form.Item label="Staking Amount">
              {getFieldDecorator("tokenAmount", {
                rules: [
                  {
                    required: true,
                    message: "Please enter your staking amount"
                  },
                  {
                    validator: this.validateTokenAmount,
                  }
                ]
              })(<Input placeholder="minimum 10,0000.0" suffix='DOS' />)}
            </Form.Item>
            <Form.Item label="Drop Burn Amount(Optional)">
              {getFieldDecorator("dbAmount", {
                rules: [
                  {
                    required: false,
                    message: "Please enter your burn token amount"
                  }
                ]
              })(<Input placeholder="0.0" suffix='DOS' />)}
            </Form.Item>
            <Form.Item label="Reward Cut Rate">
              {getFieldDecorator("cutRate", {
                rules: [
                  {
                    required: true,
                    message: "Please enter your reward cut rate"
                  }, {
                    validator: this.validatCutRate
                  }
                ]
              })(<Input placeholder="10" suffix='%' />)}
            </Form.Item>
          </Form>
          <p>{modalText}</p>
        </Modal>
      );
    }
  }
);
export default newNode;
