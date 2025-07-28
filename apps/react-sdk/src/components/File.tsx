import PropTypes from 'prop-types';

import { FunctionComponent } from "../types";

export interface FileProps {
  /**
   * `name` prop describes the filename for which should be used when generating the file. If none is specified the filename for the template are used.
   */
  name?: string;
  /**
   * `permissions` prop describes the permissions the file should be created with. This is interpreted as an octal number such as 0o777
   */
  permissions?: number;
}

export const FilePropTypes = {
  /**
   * `name` prop describes the filename for which should be used when generating the file. If none is specified the filename for the template are used.
   */
  name: PropTypes.string,
  /**
   * `permissions` prop describes the permissions the file should be created with. This is interpreted as an octal number such as 0o777
   */
  permissions: PropTypes.number,
};

/**
 * Component is used to describe to the generator that you want a file to be created and rendered based on the defined children.
 * 
 * @component
 * @example
 * const name = "test.js"
 * const permissions = 0o777
 * return (
 *   <File name={name} permissions={permissions}>Test</File>
 * )
 */
const File: FunctionComponent<FileProps> = ({ children }) => {
  return <>{children}</>;
};

File.propTypes = {
  ...FilePropTypes,
};
export default File;
