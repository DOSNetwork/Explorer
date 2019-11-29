import React from "react";
import { Form, Input, Button } from "antd";

const stakingNode = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const {
        onSubmit,
        form,
      } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Form onSubmit={onSubmit} layout="vertical">
          <Form.Item label="Add Delegate Amount">
            {getFieldDecorator("tokenAmount", {
              rules: [
                {
                  required: false,
                  message: "Please input the delegate token amount!"
                }
              ]
            })(<Input placeholder="0.0" />)}
          </Form.Item>
          <Form.Item label="Add Drop Burn Amount">
            {getFieldDecorator("dbAmount", {
              rules: [
                {
                  required: false,
                  value: "60",
                  message: "Please input the drop burn amount!"
                }
              ]
            })(<Input placeholder="0.0" />)}
          </Form.Item>
          <Form.Item label="Update Reward Cut">
            {getFieldDecorator("rewardCut", {
              rules: [
                {
                  required: true,
                  message: "Please input the new reward cut"
                }
              ]
            })(<Input placeholder="10.0" />)}
          </Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Submit
          </Button>
        </Form>
      );
    }
  }
);
export default stakingNode;
