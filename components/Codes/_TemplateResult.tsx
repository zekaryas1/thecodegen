import React, { useState } from "react";
import { engine } from "../../lib/engine";
import { Entity } from "../../lib/models/Entity";
import { Generator } from "../../lib/models/Generator";
import MyEditor from "../MyEditor";

interface Props {
  currentGenerator: Generator;
  currentEntity: Entity;
}

function TemplateResultComponent({ currentGenerator, currentEntity }: Props) {
  const [resultCode, setResultCode] = useState("");

  const regenerateResult = () => {
    const template = currentGenerator.template?.body;

    if (template) {
      engine
        .parseAndRender(template, {
          name: currentEntity.name,
          columns: currentEntity.columns,
        })
        .then((value) => {
          setResultCode(value);
        });
    }
  };

  return (
    <>
      <MyEditor
        height="100vh"
        defaultLanguage={currentGenerator.name?.split(".")[1] || "liquid"}
        defaultValue={resultCode}
      />
    </>
  );
}

// export default React.memo(TemplateResultComponent);
