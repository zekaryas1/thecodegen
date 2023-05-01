import { engine } from "../../lib/engine";
import { MARKDOWN_INDICATOR } from "../../lib/fixed";
import { Entity } from "../../lib/models/Entity";
import { Generator } from "../../lib/models/Generator";
import { Template } from "../../lib/models/Template";
import { GeneratorService } from "../../lib/services/GeneratorService";
import { TemplateService } from "../../lib/services/TemplateService";

export class CodeUtils {
  static regenerateResult = async (template: string, entity: Entity) => {
    let result = "";
    if (template) {
      try {
        const renderedTemplate = await engine.parseAndRender(template, {
          name: entity.name,
          columns: entity.columns,
        });
        result = renderedTemplate;
      } catch (error) {
        console.log(error);
        result = `[//]: # "markdown"
              ***🔴ERROR => ${error}***
              `;
      }
    }
    return result;
  };

  static updateTemplate = async (input: {
    newTemplate: Template;
    body: string;
    projectId: string;
    onSuccess: () => void;
    onError: () => void;
  }) => {
    const updatedTemplate = {
      ...input.newTemplate,
      body: input.body,
    };
    const res = await TemplateService.update(updatedTemplate, input.projectId);

    if (res.statusText === "OK") {
      input.onSuccess();
    } else {
      input.onError();
    }
  };

  static saveNewGenerator = async (input: {
    newGenerator: Generator;
    projectId: string;
    onSuccess: (result: Generator) => void;
  }) => {
    if (input.newGenerator.id) {
      const response = await GeneratorService.update(
        input.newGenerator,
        input.projectId
      ).then((res) => res.data);
      input.onSuccess(response);
    } else {
      const response = await GeneratorService.create(
        input.newGenerator,
        input.projectId
      ).then((res) => res.data);
      input.onSuccess(response);
    }
  };

  static deleteGenerator = async (input: {
    id: string;
    projectId: string;
    onSuccess: (result: Generator) => void;
  }) => {
    const response = await GeneratorService.delete(
      input.id,
      input.projectId
    ).then((res) => res.data);
    if (response) {
      input.onSuccess(response);
    }
  };

  static onRegenerateButtonClick = async (input: {
    template: string;
    entity: Entity;
    onShowMarkdown: (markDownCode: string) => void;
    onShowCode: (codeOutPut: string) => void;
  }) => {
    const generatedCode = await CodeUtils.regenerateResult(
      input.template,
      input.entity
    );

    if (generatedCode && generatedCode.startsWith(MARKDOWN_INDICATOR)) {
      input.onShowMarkdown(generatedCode);
    } else {
      input.onShowCode(generatedCode);
    }
  };
}
