import PropTypes from 'prop-types';

import { IndentationTypes, withIndendation } from "../utils";
import { FunctionComponent } from "../types";

export interface IndentProps {
  /**
   * `size` prop expects a string which format should be a number which represent the number of `type`'s to indent each content. Default to no indentation.
   */
  size?: number,
  /**
   * `type` prop expects a string, you can use the `IndentationTypes` enum, as either `TABS` or `SPACES`. The `type` defaults to `SPACES`. 
   */
  type?: IndentationTypes;
}

export const IndentPropTypes = {
  /**
   * `size` prop expects a string which format should be a number which represent the number of `type`'s to indent each content. Default to no indentation.
   */
  size: PropTypes.number,
  /**
   * `type` prop expects a string, you can use the `IndentationTypes` enum, as either `TABS` or `SPACES`. The `type` defaults to `SPACES`. 
   */
  type: PropTypes.oneOf(Object.values(IndentationTypes)),
};

/**
 * Component is for wrapping multiple components and apply an indentation on those. 
 * 
 * It supports any form of nested components as well, meaning you can have as many nested `Indent` components as you would like.
 * 
 * @component
 * @example
 * const size = 4
 * const type = IndentationTypes.SPACES
 * return (
 *   <Indent size={size} type={type}>test</Indent>
 * )
 */
const Indent: FunctionComponent<IndentProps> = ({ size = 0, type = IndentationTypes.SPACES, childrenContent }) => {
  return <>{withIndendation(childrenContent, size, type)}</>;
};

Indent.propTypes = {
  ...IndentPropTypes,
};
export default Indent;
