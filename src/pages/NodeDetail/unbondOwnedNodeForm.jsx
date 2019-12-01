import React from "react";
import { Form, Input, Button } from "antd";

const unbondOwnedNode = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    validateTokenAmount = (rule, value, callback) => {
      if (value) {
        let result = Number(value)
        if (Number.isNaN(result)) {
          callback('Please enter a valid number')
        }
      }
      callback()
    };
    render() {
      const {
        form,
        onSubmit
      } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Form onSubmit={onSubmit} layout="vertical">
          <Form.Item label="Unbond Amount">
            {getFieldDecorator("tokenAmount", {
              rules: [
                {
                  required: true,
                  message: "Please input the unbond token amount"
                },
                {
                  validator: this.validateTokenAmount,
                }
              ]
            })(<Input placeholder="10,0000.0" suffix="DOS" />)}
          </Form.Item>
          <Form.Item label="Drop Burn Amount">
            {getFieldDecorator("dbAmount", {
              rules: [
                {
                  required: false,
                  message: "Please input drop burn token amount"
                }
              ]
            })(<Input placeholder="0.0" suffix='DOS' />)}
          </Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Submit
          </Button>
        </Form>
      );
    }
  }
);
export default unbondOwnedNode;
