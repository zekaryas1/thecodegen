import { Generator } from "../../lib/models/Generator";
import { Template } from "../../lib/models/Template";
import MyEditor from "../MyEditor";
import React from "react";
import { ZIndexUtils } from "primereact/utils";
import set = ZIndexUtils.set;

interface Props {
  currentGenerator: Generator;
  onSaveTemplateClick: (newTemplate: Template) => void;
  onTemplateBodyChange: (value: string) => any;
}

function TemplateEditorComponent({
  currentGenerator,
  onSaveTemplateClick,
  onTemplateBodyChange,
}: Props) {
  return (
    <div className="">
      <MyEditor
        height="100vh"
        defaultLanguage="liquid"
        defaultValue={currentGenerator.template?.body || ""}
        onChange={(value) => {
          onTemplateBodyChange(value || "");
        }}
      />
    </div>
  );
}

// export default React.memo(TemplateEditorComponent);
