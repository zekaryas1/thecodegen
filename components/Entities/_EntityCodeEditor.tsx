import { Button } from "primereact/button";
import React from "react";
import { Entity, entityToString } from "../../lib/models/Entity";
import MyEditor from "../MyEditor";
import AdminOrOwner from "../AdminOrOwner";

interface Props {
  editorData: string;
}

const EntityCodeEditorComponent = ({
  editorData,
}: Props) => {
  return (
    <>
      <MyEditor
        height="100vh"
        defaultLanguage="json"
        defaultValue={editorData}
      />
    </>
  );
};

// export default React.memo(EntityCodeEditorComponent);
