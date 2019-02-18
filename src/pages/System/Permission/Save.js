import React, { Component, PureComponent } from 'react';
import { Icon, Input, Form, InputNumber, message, Modal, Popconfirm, Select, Switch, Table, Tabs } from 'antd';

const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const formItemLayout = {
  labelCol: {
    xs: { span: 20 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 14 },
  },
  style: {
    height: 20,
  },
};
const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber/>;
    }
    return <Input/>;
  };

  render() {
    const { editing, dataIndex, title, inputType, record, index, ...restProps } = this.props;
    return (
      <EditableContext.Consumer>
        {form => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <Form.Item style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `Please Input ${title}!`,
                      },
                    ],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </Form.Item>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

@Form.create()
class Save extends PureComponent {
  static defaultProps = {
    hanldeUpdate: () => {
    },
    handleEditModalVisible: () => {
    },
    values: {},
    title: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      formValues: {},
    };
    const {editFormValues} =this.state;
  }


  columns = [
    {
      title: '操作类型',
      dataIndex: 'action',
      width: '30%',
      editable: true,
    },
    {
      title: '描述',
      dataIndex: 'describe',
      editable: true,
    },
    {
      title: '默认选中',
      dataIndex: 'defaultCheck',
      // editable: true,
      render: (text, record) => (
        // text ? "是":"否",
        <Switch
          checkedChildren="是"
          unCheckedChildren="否"
          defaultChecked={text}
          onChange={this.onChange}
        />
      ),
    },
    {
      title: '操作',
      dataIndex: '',
      render: (text, record) => {
        const editable = this.isEditing(record);
        return (
          <div>
            {editable ? (
              <span>
                <EditableContext.Consumer>
                  {form => (
                    <a
                      href="javascript:;"
                      onClick={() => this.save(form, record.action)}
                      style={{ marginRight: 8 }}
                    >
                      保存
                    </a>
                  )}
                </EditableContext.Consumer>
                <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.action)}>
                  <a>取消</a>
                </Popconfirm>
              </span>
            ) : (
              <a onClick={() => this.edit(record.action)}>编辑</a>
            )}
          </div>
        );
      },
    },
  ];

  defaultActionData = [
    { 'action': 'query', 'describe': '查询列表', defaultCheck: true },
    { 'action': 'get', 'describe': '查询明细', defaultCheck: true },
    { 'action': 'add', 'describe': '新增', defaultCheck: true },
    { 'action': 'update', 'describe': '修改', defaultCheck: true },
    { 'action': 'delete', 'describe': '删除', defaultCheck: false },
  ];

  onChange = (record, checked) => {
    console.log(record, checked, '是否选中');
  };

  handleSave = () => {
    const { handleEditModalVisible, form, values } = this.props;
    console.log(values, 'table');
    console.log(form.getFieldsValue(), 'values');
    //保存数据
    message.success('配置成功');
    handleEditModalVisible();
  };

  handleSelect = value => {
  };

  isEditing = record => record.action === this.state.editingKey;

  cancel = () => {
    this.setState({
      editingKey: '',
    });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.values];
      const index = newData.findIndex(item => key === item.action);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ values: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ values: newData, editingKey: '' });
      }
    });
  }

  edit(key) {
    this.setState({
      editingKey: key,
    });
  };

  getEditData(values){
  };

  render() {

    const { editModalVisible, handleEditModalVisible, values } = this.props;

    this.getEditData(values);

    const allSupportDataAccessTypes = [
      { id: 'DENY_FIELDS', text: '禁止访问字段' },
      { id: 'ONLY_SELF', text: '仅限本人' },
      { id: 'POSITION_SCOPE', text: '仅限本人及下属' },
      { id: 'DEPARTMENT_SCOPE', text: '所在部门' },
      { id: 'ORG_SCOPE', text: '所在机构' },
      { id: 'CUSTOM_SCOPE_ORG_SCOPE_', text: '自定义设置-机构' },
      { id: 'CUSTOM_SCOPE_DEPARTMENT_SCOPE_', text: '自定义设置-部门' },
      { id: 'CUSTOM_SCOPE_POSITION_SCOPE_', text: '自定义设置-岗位' },
    ];
    const selectChildren = [];
    for (let i = 1; i < allSupportDataAccessTypes.length; i++) {
      selectChildren.push(
        <Option key={allSupportDataAccessTypes[i].id}>{allSupportDataAccessTypes[i].text}</Option>,
      );
    }
    const {
      form: { getFieldDecorator },
    } = this.props;


    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <Modal
        width={700}
        bodyStyle={{ padding: 'auto' }}
        destroyOnClose
        title={values.id?"编辑":"新建"}
        visible={editModalVisible}
        onCancel={() => handleEditModalVisible(false, values)}
        afterClose={() => handleEditModalVisible()}
        onOk={this.handleSave}
      >
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <Icon type="profile"/>
                基本信息
              </span>
            }
            key="1"
          >
            <Form style={{ marginBottom: 50 }}>
              <Form.Item {...formItemLayout} label="权限标识(ID)">
                {getFieldDecorator('id', {
                  initialValue: values.id,
                })(<Input/>)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="权限名称">
                {getFieldDecorator('name', {
                  initialValue: values.name,
                })(<Input/>)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="备注">
                {getFieldDecorator('describe', {})(
                  <TextArea placeholder="" autosize={{ minRows: 2, maxRows: 6 }}/>,
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="支持的数据权限控制方式">
                {getFieldDecorator('supportDataAccessTypes', {})(
                  <Select mode="multiple" style={{ width: '100%' }} onChange={this.handleSelect}>
                    {selectChildren}
                  </Select>,
                )}
              </Form.Item>
            </Form>

            <Table
              components={components}
              bordered
              size="small"
              rowKey={record => record.action}
              dataSource={values.action || this.defaultActionData}
              columns={columns}
              rowClassName="editable-row"
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="area-chart"/>
                数据视图
              </span>
            }
            key="2"
          >
            数据视图
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default Save;
