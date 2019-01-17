import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: 'Hs-web 首页',
          title: 'Hs-web 首页',
          href: 'https://github.com/hs-web',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <Icon type="github" />,
          href: 'https://github.com/hsweb-pro',
          blankTarget: true,
        },
        {
          key: 'Hs-web Pro',
          title: 'Hs-web Pro',
          href: 'https://github.com/hsweb-pro',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2019 Hs-web Pro技术部出品
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
