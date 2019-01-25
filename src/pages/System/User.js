import React, { Component, Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Icon,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Table,
} from 'antd';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import styles from '../List/TableList.less';
const { Option } = Select;

@connect(({ users, loading }) => ({
  users,
  loading: loading.models.users,
}))
@Form.create()
class User extends Component{

  state={
    editModalVisible: false,
    editFormValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'users/fetchList',
    });
  }

  columns = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '是否启用',
      dataIndex: 'status',
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

  handleEditModalVisible = (flag, record) => {
    this.setState({
      editModalVisible: !!flag,
      editFormValues: record || {},
    });
  };

  handleFormReset = ()=>{
    const {form,dispatch} = this.props;
    form.resetFields();
    this.setState({
      formValues:{},
    });
    dispatch({
      type:'users/fetchList',
      payload: {},
    });
  };

  handleAdd = ()=>{
    console.log("添加用户");
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="用户名">
              {getFieldDecorator('username')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button icon="search" type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>

              <Button type="primary" icon="plus" style={{ marginLeft: 8 }} onClick={this.handleAdd}>
                添加用户
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm(){
    return this.renderSimpleForm();
  }

  render() {
    const {users: {data},loading} = this.props;
    const {editFormValues,editModalVisible} = this.state;
    const editMethods = {
      handleEditModalVisible:this.handleEditModalVisible,
    };
    return (
      <PageHeaderWrapper title="用户管理">
        <div className={styles.tableListForm}>{this.renderForm()}</div>
        <Card bordered={false}>

          <Table
            rowKey={record => record.id}
            loading={loading}
            dataSource={data.list}
            columns={this.columns}
          />
          {editFormValues && Object.keys(editFormValues).length?(
            <EditForm
              {...editMethods}
              editModalVisible={editModalVisible}
              values={editFormValues}
            />
          ):null}
        </Card>

      </PageHeaderWrapper>
    );
  }
}

export default User;


class EditForm extends PureComponent {

  static defaultProps = {
    handleEditModalVisible:()=>{},
  };

  constructor(props){
    super(props);
    this.state = {

    }
  };

  handleSave=()=>{
    console.log("保存成功");
    const {handleEditModalVisible} = this.props;
    handleEditModalVisible();
  };

  render() {
    const {editModalVisible,handleEditModalVisible,values} = this.props;
    return (
      <Modal
        title="编辑用户"
        visible={editModalVisible}
        onCancel={()=>handleEditModalVisible(false,values)}
        afterClose={()=>handleEditModalVisible()}
        onOk={this.handleSave}
      >
      编辑用户
      </Modal>
    );
  }
}
