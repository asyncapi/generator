import PropTypes from 'prop-types';

import { IndentationTypes, withIndendation, withNewLines } from "../utils";
import { FunctionComponent } from "../types";

export interface TextProps {
  /**
   * `indent` prop represents the number of `type`'s to indent each content. Default to no indentation.
   */
  indent?: number,
  /**
   * `type` prop expects a string, you can use the `IndentationTypes` enum, as either `TABS` or `SPACES`. The `type` defaults to `SPACES`. 
   */
  type?: IndentationTypes;
  /**
   * `newLines` prop represents the number of appended new lines. Default to one new line.
   */
  newLines?: number;
}

export const TextPropTypes = {
  /**
   * `size` prop expects a string which format should be a number which represent the number of `type`'s to indent each content. Default to no indentation.
   */
  size: PropTypes.number,
  /**
   * `type` prop expects a string, you can use the `IndentationTypes` enum, as either `TABS` or `SPACES`. The `type` defaults to `SPACES`. 
   */
  type: PropTypes.oneOf(Object.values(IndentationTypes)),
  /**
   * `newLines` prop represents the number of appended new lines. Default to one new line.
   */
  newLines: PropTypes.number,
};

/**
 * Component is for defining a group of text which should be rendered on the same line.
 *
 * @component
 * @example
 * const indent = 4
 * const type = IndentationTypes.SPACES
 * const newLines = 2
 * return (
 *   <Text indent={size} type={type} newLines={newLines}>Test</Text>
 * )
 */
const Text: FunctionComponent<TextProps> = ({ indent = 0, type = IndentationTypes.SPACES, newLines = 1, childrenContent }) => {
  const contentWithLines = withNewLines(childrenContent, newLines);
  return <>{withIndendation(contentWithLines, indent, type)}</>;
};

Text.propTypes = {
  ...TextPropTypes,
};
export default Text;
