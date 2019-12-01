import React from "react";
import { Form, Input, Button } from "antd";

const delegateNode = Form.create({ name: "form_in_modal" })(
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
          <Form.Item label="Delegate Amount">
            {getFieldDecorator("tokenAmount", {
              rules: [
                {
                  required: true,
                  message: "Please input the delegate token amount!"
                }
              ]
            })(<Input placeholder="50000.0" suffix='DOS' />)}
          </Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Submit
          </Button>
        </Form>
      );
    }
  }
);
export default delegateNode;
