import React, { Component, Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { Divider, Form, Modal, Steps, message, Table, Input, Select } from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import StandardTable from '../../components/StandardTable';
const {TextArea} = Input;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@Form.create()
class UpdateForm extends PureComponent {

  static defaultProps = {
    hanldeUpdate: () => {
    },
    handleEditModalVisible: () => {
    },
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
    }
  };

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
      editable: true,
      render: (text, record) => (
        text ? '是' : '否'
      ),
    },
    {
      title: '操作',
      dataIndex: '',
      render: (text, record) => (
        <Fragment>
          <a href="">编辑</a>
          <Divider type="vertical"/>
          <a href="">删除</a>
        </Fragment>
      ),
    },

  ];

  handleSave = () => {
    const { handleEditModalVisible,form,values } = this.props;
    console.log(values,"table");
    console.log(form.getFieldsValue(),"values");
    //保存数据
    message.success('配置成功');
    handleEditModalVisible();
  };

  handleSelect = value =>{
  };

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
      {id: "DENY_FIELDS", text: "禁止访问字段"},
      {id: "ONLY_SELF", text: "仅限本人"},
      {id: "POSITION_SCOPE", text: "仅限本人及下属"},
      {id: "DEPARTMENT_SCOPE", text: "所在部门"},
      {id: "ORG_SCOPE", text: "所在机构"},
      {id: "CUSTOM_SCOPE_ORG_SCOPE_", text: "自定义设置-机构"},
      {id: "CUSTOM_SCOPE_DEPARTMENT_SCOPE_", text: "自定义设置-部门"},
      {id: "CUSTOM_SCOPE_POSITION_SCOPE_", text: "自定义设置-岗位"}
    ];
    const selectChildren = [];
    for (let i = 1; i < allSupportDataAccessTypes.length; i++) {
      selectChildren.push(
        <Option key={allSupportDataAccessTypes[i].id}>
          {allSupportDataAccessTypes[i].text}
        </Option>
      );
    }
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { formValues } = this.state;
    return (
      <Modal
        width={800}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="编辑权限"
        visible={editModalVisible}
        onCancel={() => handleEditModalVisible(false, values)}
        afterClose={() => handleEditModalVisible()}
        onOk={this.handleSave}
      >
        <Form>
          <Form.Item
            {...formItemLayout}
            label="权限标识(ID)"
          >
            {getFieldDecorator('id', {
              initialValue: formValues.id,
            })
            (<Input/>)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="权限名称"
          >
            {getFieldDecorator('name', {
              initialValue: formValues.name,
            })
            (<Input/>)}

          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="备注"
          >
            {getFieldDecorator('describe', {})
            (<TextArea placeholder="" autosize={{ minRows: 2, maxRows: 6 }} />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="支持的数据权限控制方式"
          >
            {getFieldDecorator('supportDataAccessTypes', {})
            (<Select
              mode="multiple"
              style={{width:'100%'}}
              onChange={this.handleSelect}
            >
              {selectChildren}
            </Select>)}
          </Form.Item>
        </Form>

        <Table
          rowKey={record => record.action}
          dataSource={values.actions}
          columns={this.columns}
        />
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
          <Divider type="vertical"/>
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

  handleStandardTableChange = (pagination,filtersArg,sorter) =>{
    console.log(pagination,filtersArg,sorter,"翻页");
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

    if (sorter.field){
      params.sorter = `${sorter.field}_${sorter.order}}`;
    }

    dispatch({
      type:'permission/fetchList',
      payload: params,
    });
  };

  render() {

    const { selectedRows, editFormValues, editModalVisible } = this.state;

    const { permission: { data } ,loading} = this.props;
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
            values={editFormValues}/>
        ) : null}

      </PageHeaderWrapper>

    );
  }
}

export default Permission;


