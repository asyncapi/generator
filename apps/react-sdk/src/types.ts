import React from "react";
import { AsyncAPIDocumentInterface, OldAsyncAPIDocument as AsyncAPIDocument } from "@asyncapi/parser";

export type PropsWithChildrenContent<P> = P & {
  childrenContent?: string;
}

export type FC<P = {}> = FunctionComponent<P>;
export type FunctionComponent<P = {}> = React.FunctionComponent<PropsWithChildrenContent<P>>;
export class Component<P = {}> extends React.Component<PropsWithChildrenContent<P>> {}

/**
 * Shape of the context passed to template
 */
export interface TemplateContext<P = Record<string, any>>{
  asyncapi: AsyncAPIDocumentInterface | AsyncAPIDocument,
  params: P,
  originalAsyncAPI: string,
  [key: string]: any,
}

/**
 * Signature for template function
 */
export type TemplateFunction<R = React.ReactElement | undefined> = (context: TemplateContext) => R | Promise<R>;

/**
 * Options for transpiling files.
 */
export type TranspileFilesOptions = {
  /**
   * Should all files in a directory including those in subdirectories be included
   */
  recursive?: boolean
}

export type TemplateRenderMetadata = {
  fileName?: string;
  permissions?: string;
}

export type TemplateRenderResult = {
  metadata: TemplateRenderMetadata;
  content: string;
}