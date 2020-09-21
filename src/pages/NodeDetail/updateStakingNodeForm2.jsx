import React, { useContext } from "react";
import { Form, Input, Button } from "antd";
import { AppContext, NodeDetailContext } from './context'
const { Search } = Input
const StakingNode = () => {
  const { f } = useContext(AppContext)

  const setMaxBalance = () => {
    let { maxBalance } = this.props
    setTimeout(() => {
      this.props.form.setFieldsValue({
        tokenAmount: maxBalance
      });
    }, 0)
  }

  const validateTokenAmount = (_, value) => {
    if (value) {
      let result = Number(value)
      if (Number.isNaN(result)) {
        Promise.reject(f({ id: 'Form.Error.tokenAmount' }))
      }
    }
    Promise.resolve()
  };

  const submit = (values) => {
    console.log(values)
  }
  // const { pageInfos, nodeDetail, handleEmmiterEvents } = useContext(NodeDetailContext)
  const [form] = Form.useForm()
  return (
    <Form form={form} onSubmit={submit} layout="vertical">
      <Form.Item
        name="tokenAmount"
        label={f({ id: 'Form.Lable.AddDelegateAmount' })}
        rules={[
          {
            required: false,
            message: f({ id: 'Form.Message.InputDelegateAmount' })
          },
          {
            validator: validateTokenAmount,
          }
        ]}
      >
        <Search placeholder="5,000.0" suffix='DOS' enterButton='MAX' onSearch={setMaxBalance} />
      </Form.Item>
      <Button type="primary" htmlType="submit" className="login-form-button">
        {f({ id: 'Form.Button.Submit' })}
      </Button>
    </Form>
  )
}
export default StakingNode;
