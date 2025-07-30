import React from "react";
import fs from "fs";

import { render } from "./renderer";
import { isJsFile } from "../utils";
import { TemplateContext, TemplateFunction, TemplateRenderResult } from "../types";

/**
 * render a file with react. This function automatically transforms jsx to js before importing the component.
 * 
 * @param filepath the path to file to render
 */
export async function renderTemplate(filepath: string, context: TemplateContext): Promise<TemplateRenderResult[] | TemplateRenderResult | undefined> {
  if (!isJsFile(filepath)) {
    return undefined;
  }

  let data = undefined;
  try {
    const component = await importComponent(filepath);
    if (component === undefined) {
      return undefined;
    }
    data = await component(context);
  } catch(err) {
    throw err;
  }

  // undefined, null etc. cases
  if (!data) {
    return undefined;
  }

  if (Array.isArray(data)) {
    return data.map(file => file && renderFile(file)).filter(Boolean);
  }
  return renderFile(data);
}

/**
 * Imports a given file and return the imported component
 * 
 * @private
 * @param filepath to import
 */
function importComponent(filepath: string): Promise<TemplateFunction | undefined> {
  return new Promise((resolve, reject) => {
    try {
      // we should import component only in NodeJS
      if (require === undefined) resolve(undefined);

      let componentPath = filepath;
      
      // Check if the transpiled version of the template file exists and skip if doesn't
      //It is needed to support case where you have template files, but do not want to use them yet
      if (!fs.existsSync(componentPath)) resolve(undefined);

      // Remove from cache and require the file
      delete require.cache[require.resolve(componentPath)];
      const component = require(componentPath);

      if (typeof component === "function") resolve(component);
      if (typeof component.default === "function") resolve(component.default);
      resolve(undefined);
    } catch(err) {
      reject(err);
    }
  });
}

/**
 * Render a single File component.
 * 
 * @private
 * @param {React.ReactElement} file to import
 */
function renderFile(file: React.ReactElement): TemplateRenderResult | undefined {
  if (typeof file !== "object") {
    return undefined;
  }
  const { type, props = {} } = file;

  // if no File component is found as root, don't render it.
  if (typeof type !== "function" || type.name !== "File") {
    return undefined;
  }

  return {
    content: render(props.children),
    metadata: {
      fileName: props.name,
      permissions: props.permissions,
    }
  };
}
