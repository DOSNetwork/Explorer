import React from "react";
import { Form, Input, Button } from "antd";

const unbondOwnedNode = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
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
                  required: false,
                  message: "Please input the unbond token amount!"
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
          <Button type="primary" htmlType="submit" className="login-form-button">
            Submit
          </Button>
        </Form>
      );
    }
  }
);
export default unbondOwnedNode;
