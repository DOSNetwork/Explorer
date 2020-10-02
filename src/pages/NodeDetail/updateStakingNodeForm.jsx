import React from "react";
import { Form, Input, Button } from "antd";
import { injectIntl } from 'react-intl'
const { Search } = Input
const stakingNode = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
    setMaxBalance = () => {
      let { maxBalance } = this.props
      setTimeout(() => {
        this.props.form.setFieldsValue({
          tokenAmount: maxBalance
        });
      }, 0)
    }
    validatCutRate = (rule, value, callback) => {
      if (value) {
        let result = Number(value)
        if (Number.isNaN(result)) {
          callback(this.props.intl.formatMessage({ id: 'Form.Error.cutRate' }))
        }
        else if (result > 100 || result < 0) {
          callback(this.props.intl.formatMessage({ id: 'Form.Error.cutRate2' }))
        }
      }
      callback()
    };
    validateTokenAmount = (rule, value, callback) => {
      if (value) {
        let result = Number(value)
        if (Number.isNaN(result)) {
          callback(this.props.intl.formatMessage({ id: 'Form.Error.tokenAmount' }))
        }
      }
      callback()
    };
    validateLogoUrl = (rule, value, callback) => {
      if (value) {
        new Promise(function (resolve, reject) {
          var ImgObj = new Image(); //判断图片是否存在
          ImgObj.src = value;
          ImgObj.onload = function (res) {
            resolve(res);
          }
          ImgObj.onerror = function (err) {
            reject(err)
          }
        }).then(callback())
          .catch((e) => {
            callback(this.props.intl.formatMessage({ id: 'Form.Error.LogoUrl' }))
          });
      } else {
        callback()
      }
    };
    render() {
      const {
        onSubmit,
        form
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
                },
                {
                  validator: this.validateTokenAmount,
                }
              ]
            })(<Search placeholder="5,000.0" suffix='DOS' enterButton='MAX' onSearch={this.setMaxBalance} />)}
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
                }, {
                  validator: this.validatCutRate
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
          <Form.Item label={f({ id: 'Form.Lable.UpdateLogoUrl' })}>
            {getFieldDecorator("logoUrl", {
              rules: [
                {
                  required: false,
                }, {
                  validator: this.validateLogoUrl
                }
              ]
            })(<Input placeholder={f({ id: 'Form.Placeholder.InputLogoUrl' })} />)}
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
