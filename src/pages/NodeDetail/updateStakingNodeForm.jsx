import React from "react";
import { Form, Input, Button } from "antd";
import { injectIntl } from 'react-intl'
const stakingNode = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const {
        onSubmit,
        form,
      } = this.props;
      let { formatMessage: f } = this.props.intl;
      const { getFieldDecorator } = form;
      return (
        <Form onSubmit={onSubmit} layout="vertical">
          <Form.Item label={f({ id: 'Form.Lable.AddDelegateAmount' })}>
            {getFieldDecorator("tokenAmount", {
              rules: [
                {
                  required: false,
                  message: f({ id: 'Form.Message.InputDelegateAmount' })
                }
              ]
            })(<Input placeholder="5,000" suffix='DOS' />)}
          </Form.Item>
          <Form.Item label={f({ id: 'Form.Lable.AddDropBurnAmount' })}>
            {getFieldDecorator("dbAmount", {
              rules: [
                {
                  required: false,
                  message: f({ id: "Form.Message.InputDropBurnAmount" })
                }
              ]
            })(<Input placeholder="1" suffix='DOS' />)}
          </Form.Item>
          <Form.Item label={f({ id: 'Form.Lable.UpdateRewardCut' })}>
            {getFieldDecorator("rewardCut", {
              rules: [
                {
                  required: false,
                  message: f({ id: 'Form.Message.InputRewardCut' })
                }
              ]
            })(<Input placeholder="10" suffix='%' />)}
          </Form.Item>
          <Form.Item label={f({ id: 'Form.Lable.UpdateNodeDescription' })}>
            {getFieldDecorator("nodeDesc", {
              rules: [
                {
                  required: false,
                  message: f({ id: 'Form.Message.InputNodeDescription' })
                }
              ]
            })(<Input maxLength={32} placeholder={f({ id: 'Form.Message.InputNodeDescription' })} />)}
          </Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            {f({ id: 'Form.Button.Submit' })}
          </Button>
        </Form>
      );
    }
  }
);
export default injectIntl(stakingNode);
