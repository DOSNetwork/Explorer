import React from "react";
import { Modal, Form, Input } from "antd";

const delegateNode = Form.create({ name: "form_in_modal" })(
  // eslint-disable-next-line
  class extends React.Component {
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
          title="Delegate"
          okText="Sumbit"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="Delegate Amount">
              {getFieldDecorator("tokenAmount", {
                rules: [
                  {
                    required: true,
                    message: "Please input the delegate token amount!"
                  }
                ]
              })(<Input placeholder="60000.0" />)}
            </Form.Item>
          </Form>
          <p>{modalText}</p>
        </Modal>
      );
    }
  }
);
export default delegateNode;
