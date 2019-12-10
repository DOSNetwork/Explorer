import React from "react";
import { Form, Input, Button } from "antd";
import { injectIntl } from 'react-intl'
const unbondOwnedNode = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    validateTokenAmount = (rule, value, callback) => {
      let { formatMessage } = this.props.intl;
      if (value) {
        let result = Number(value)
        if (Number.isNaN(result)) {
          callback(formatMessage({ id: 'Form.Error.tokenAmount' }))
        }
      }
      callback()
    };
    render() {
      const {
        form,
        onSubmit
      } = this.props;
      let { formatMessage: f } = this.props.intl;
      const { getFieldDecorator } = form;
      return (
        <Form onSubmit={onSubmit} layout="vertical">
          <Form.Item label={f({ id: 'Form.Lable.UnbondAmount' })}>
            {getFieldDecorator("tokenAmount", {
              rules: [
                {
                  required: true,
                  message: f({ id: 'Form.Message.InputUnbondAmount' })
                },
                {
                  validator: this.validateTokenAmount,
                }
              ]
            })(<Input placeholder="10,0000.0" suffix="DOS" />)}
          </Form.Item>
          <Form.Item label={f({ id: 'Form.Lable.DropBurnAmount' })}>
            {getFieldDecorator("dbAmount", {
              rules: [
                {
                  required: false,
                  message: f({ id: 'Form.Message.InputDropBurnAmount' })
                }
              ]
            })(<Input placeholder="0.0" suffix='DOS' />)}
          </Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            {f({ id: 'Form.Button.Submit' })}
          </Button>
        </Form>
      );
    }
  }
);
export default injectIntl(unbondOwnedNode);
