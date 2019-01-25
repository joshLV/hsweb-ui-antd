import React, { Component, Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import {
  Divider,
  Form,
  Modal,
  Steps,
  message,
  Table,
  Input,
  Select,
  Popconfirm,
  InputNumber,
  Tabs,
  Icon,
  Switch,
} from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import StandardTable from '../../components/StandardTable';
const { TextArea } = Input;
const { Option } = Select;
const TabPane = Tabs.TabPane;

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

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
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
class UpdateForm extends PureComponent {
  static defaultProps = {
    hanldeUpdate: () => {},
    handleEditModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formValues: {
        name: props.values.name,
        id: props.values.id,
        describe: props.values.describe,
        supportDataAccessTypes: props.values.supportDataAccessTypes || [],
      },
      editingKey: '',
      values: props.values.actions,
    };
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

  handleSelect = value => {};

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
    console.log(this.state.values, 'values');
  }

  edit(key) {
    this.setState({
      editingKey: key,
    });
  }

  render() {
    const { editModalVisible, handleEditModalVisible, values } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 20 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 14 },
      },
    };

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
        <Option key={allSupportDataAccessTypes[i].id}>{allSupportDataAccessTypes[i].text}</Option>
      );
    }
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { formValues } = this.state;

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
        width={800}
        bodyStyle={{ padding: 'auto' }}
        destroyOnClose
        title="编辑权限"
        visible={editModalVisible}
        onCancel={() => handleEditModalVisible(false, values)}
        afterClose={() => handleEditModalVisible()}
        onOk={this.handleSave}
      >
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <Icon type="profile" />
                基本信息
              </span>
            }
            key="1"
          >
            <Form>
              <Form.Item {...formItemLayout} label="权限标识(ID)">
                {getFieldDecorator('id', {
                  initialValue: formValues.id,
                })(<Input />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="权限名称">
                {getFieldDecorator('name', {
                  initialValue: formValues.name,
                })(<Input />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="备注">
                {getFieldDecorator('describe', {})(
                  <TextArea placeholder="" autosize={{ minRows: 2, maxRows: 6 }} />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="支持的数据权限控制方式">
                {getFieldDecorator('supportDataAccessTypes', {})(
                  <Select mode="multiple" style={{ width: '100%' }} onChange={this.handleSelect}>
                    {selectChildren}
                  </Select>
                )}
              </Form.Item>
            </Form>

            <Table
              components={components}
              bordered
              rowKey={record => record.action}
              dataSource={this.state.values}
              columns={columns}
              rowClassName="editable-row"
            />
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="area-chart" />
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

@connect(({ permission, loading }) => ({
  permission,
  loading: loading.models.permission,
}))
@Form.create()
class Permission extends PureComponent {
  state = {
    selectedRows: [],
    editModalVisible: false,
    editFormValues: {},
  };

  columns = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text, record) => {
        return 1 === text ? '正常' : '';
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleEditModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <a href="">删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'permission/fetchList',
    });
  }

  handleEditModalVisible = (flag, record) => {
    this.setState({
      editModalVisible: !!flag,
      editFormValues: record || {},
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    console.log(pagination, filtersArg, sorter, '翻页');
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}}`;
    }

    dispatch({
      type: 'permission/fetchList',
      payload: params,
    });
  };

  render() {
    const { selectedRows, editFormValues, editModalVisible } = this.state;

    const {
      permission: { data },
      loading,
    } = this.props;
    const updateMethods = {
      handleEditModalVisible: this.handleEditModalVisible,
    };
    return (
      <PageHeaderWrapper title="权限管理">
        <StandardTable
          rowKey={record => record.id}
          selectedRows={selectedRows}
          onSelectRow={this.handleSelectRows}
          data={data}
          loading={loading}
          columns={this.columns}
          onChange={this.handleStandardTableChange}
        />
        {editFormValues && Object.keys(editFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            editModalVisible={editModalVisible}
            values={editFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Permission;
