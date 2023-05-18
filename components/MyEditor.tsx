import Editor from "@monaco-editor/react";
import React from "react";

interface MyEditorProps {
  height: string | number;
  defaultLanguage: string;
  defaultValue: string;
  onChange?: (value: string | undefined) => void;
  isReadOnly?: boolean;
}

function MyEditor({
  height,
  defaultLanguage,
  defaultValue,
  onChange,
  isReadOnly,
}: MyEditorProps) {
  const options: any = {
    automaticLayout: true,
    readOnly: isReadOnly ? true : false,
  };

  return (
    <Editor
      options={options}
      theme={"vs-dark"}
      height={height}
      onChange={onChange}
      className="border-gray-400 border-1"
      language={defaultLanguage}
      value={defaultValue}
    />
  );
}

export default MyEditor;
