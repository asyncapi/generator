import { FileHeaderInfo } from '../../components/FileHeaderInfo';

describe('testing of FileHeaderInfo function', () => {
  jest.setTimeout(100000);

  const mockData = {
    info: {
      title: () => 'Test AsyncAPI Service',
      version: () => '1.0.0'
    },
    server: {
      protocol: () => 'mqtt',
      host: () => 'test.mosquitto.org',
      pathname: () => '/mqtt',
      hasPathname: () => true
    },
    serverWithoutPath: {
      protocol: () => 'mqtt',
      host: () => 'test.mosquitto.org',
      pathname: () => '',
      hasPathname: () => false
    }
  };

  test('render websockets file header info correctly', () => {
    const wrapper = FileHeaderInfo({ info: mockData.info, server: mockData.server });
    expect(wrapper).toMatchSnapshot();
  });

  test('render websockets file header when path is missing', () => {
    const wrapper = FileHeaderInfo({ info: mockData.info, server: mockData.serverWithoutPath });
    expect(wrapper).toMatchSnapshot();
  });
});
