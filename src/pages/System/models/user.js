import { queryPermission,queryUser } from '@/services/api';

export default {
  namespace: 'users',

  state: {
    data: {
      list:[],
      pagination:{},
    },
  },

  effects: {
    * fetchList({ payload }, { call, put }) {
      let params = payload||{pageIndex: 0,pageSize:10};
      const response = yield call(queryUser,params);
      console.log(response,"resp");
      const dataList = {
        list:response.result.data,
        pagination:{
          total:response.result.total,
          pageSize:params.pageSize,
          current: params.pageIndex
        }
      };
      yield put({
        type: 'save',
        payload: dataList,
      });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        data:action.payload,
      };
    },
  },
};
