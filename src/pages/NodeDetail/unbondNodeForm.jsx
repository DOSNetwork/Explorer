import React from "react";
import { Form, Input, Button } from "antd";

const unbondNode = Form.create({ name: "form_in_modal" })(
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
            })(<Input placeholder="100.0" suffix="DOS" />)}
          </Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Submit
          </Button>
        </Form>
      );
    }
  }
);
export default unbondNode;
