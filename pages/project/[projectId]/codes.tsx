import { useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { Generator } from "../../../lib/models/Generator";
import { Template } from "../../../lib/models/Template";
import { TemplateService } from "../../../lib/services/TemplateService";
import { Entity } from "../../../lib/models/Entity";
import { GeneratorService } from "../../../lib/services/GeneratorService";
import { useRouter } from "next/router";
import { EntityService } from "../../../lib/services/EntityService";
import ManageGeneratorDialog from "../../../components/Codes/ManageGeneratorDialog";
import GeneratorListComponent from "../../../components/Codes/GeneratorList";
import { LoadingIndicator } from "../../../components/LoadingIndicator";
import { Toast } from "primereact/toast";
import { Splitter, SplitterPanel } from "primereact/splitter";
import MyEditor from "../../../components/MyEditor";
import { engine } from "../../../lib/engine";
import CodesToolBar from "../../../components/Codes/CodesToolBar";
import { Divider } from "primereact/divider";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css";
import Conditional from "../../../components/Conditional";
import { MARKDOWN_INDICATOR } from "../../../lib/fixed";

function Codes() {
  const router = useRouter();
  const { projectId } = router.query;

  const {
    data: generators,
    isLoading,
    mutate: refreshGenerators,
  } = useSWR(GeneratorService.getBaseUrl(projectId));
  const { data: entities } = useSWR(EntityService.getBaseUrl(projectId));

  const [showManageGeneratorDialog, setShowManageGeneratorDialog] =
    useState(false);
  const [selectedGenerator, setSelectedGenerator] = useState<Generator>({});
  const [selectedEntity, setSelectedEntity] = useState<Entity>({});

  const [dialogData, setDialogData] = useState<Generator>({});

  const [generatedCode, setGeneratedCode] = useState("");
  const [showMarkDown, setShowMarkDown] = useState(false);

  const toast = useRef(null);

  useEffect(() => {
    setSelectedGenerator((prevState) => {
      const res = generators?.data?.find(
        (generator: Generator) => generator.id === prevState.id
      );
      return res || {};
    });
  }, [generators?.data]);

  const saveNewGenerator = async (newGenerator: Generator) => {
    if (newGenerator.id) {
      await GeneratorService.update(newGenerator, projectId);
      refreshGenerators();
    } else {
      const response = await GeneratorService.create(
        newGenerator,
        projectId
      ).then((res) => res.data);
      refreshGenerators({ ...generators, response });
    }
  };

  /**
   * Call api to Updates a template and displays a success message if successful
   * @param {Template} newTemplate - The new template to update
   */
  const updateTemplate = async (newTemplate: Template) => {
    const updatedTemplate = {
      ...newTemplate,
      body: selectedGenerator?.template?.body || "",
    };
    const res = await TemplateService.update(updatedTemplate, projectId);

    if (res.statusText === "OK") {
      show({
        severity: "success",
        summary: "Template saved",
        detail: "",
      });
      refreshGenerators();
    } else {
      show({
        severity: "error",
        summary: "Template can not be saved",
        detail: "Something went wrong",
      });
    }
  };

  /**
   * Updates the generator template by setting the body to the provided value.
   *
   * @param {string | undefined} newValue - The new value for the template body.
   * @return {void} This function does not return anything.
   */

  const updateGeneratorTemplate = (newValue: string | undefined) => {
    setSelectedGenerator((prevState) => ({
      ...prevState,
      template: {
        ...prevState.template,
        body: newValue || "",
      },
    }));
  };

  const show = (message: {
    severity: "success" | "error";
    summary: string;
    detail: string;
  }) => {
    //@ts-ignore
    toast.current.show(message);
  };

  const deleteGenerator = async (id: string) => {
    const response = await GeneratorService.delete(id, projectId);
    if (response.statusText == "OK") {
      setSelectedGenerator({});
      refreshGenerators({
        ...generators.data.filter((it: Generator) => it.id != id),
      });
    }
  };

  const openGeneratorDialogWith = (generator: Generator) => {
    setDialogData(generator);
    setShowManageGeneratorDialog(true);
  };

  const regenerateResult = async (template: string, entity: Entity) => {
    if (template) {
      const result = await engine
        .parseAndRender(template, {
          name: entity.name,
          columns: entity.columns,
        })
        .catch((err) => {
          console.log(err);
        });
      return result;
    }
    return "";
  };

  const codeBlockToShow = () => {
    const editor = (
      <MyEditor
        height="100%"
        defaultLanguage={selectedGenerator.name?.split(".")[1] || "liquid"}
        defaultValue={generatedCode}
      />
    );
    const markDown = (
      <ReactMarkdown
        remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
        className="markdown-body bg-transparent h-full px-3 py-4 border-gray-400 border-1"
      >
        {generatedCode}
      </ReactMarkdown>
    );

    return <Conditional if={showMarkDown} show={markDown} else={editor} />;
  };

  const onRegenerateButtonClick = async () => {
    const template = selectedGenerator.template?.body || "";
    const generatedCode = await regenerateResult(template, selectedEntity);

    if (generatedCode && generatedCode.startsWith(MARKDOWN_INDICATOR)) {
      setShowMarkDown(true);
    } else {
      setShowMarkDown(false);
    }

    setGeneratedCode(generatedCode);
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <CodesToolBar
        currentEntity={selectedEntity}
        currentGenerator={selectedGenerator}
        addClick={() => openGeneratorDialogWith({})}
        manageClick={() => openGeneratorDialogWith(selectedGenerator)}
        updateCurrentEntity={setSelectedEntity}
        updateTemplate={() => {
          selectedGenerator.template &&
            updateTemplate(selectedGenerator.template);
        }}
        regenerateResult={onRegenerateButtonClick}
        listOfEntities={entities?.data || []}
      />
      <Divider />

      <div className="grid min-h-screen p-2 mb-4">
        <Toast ref={toast} />
        <div className="col-2 p-0">
          <GeneratorListComponent
            generators={generators?.data}
            currentGenerator={selectedGenerator}
            newGeneratorSelected={setSelectedGenerator}
          />
        </div>

        <Splitter className="col p-0 m-0 border-none">
          <SplitterPanel>
            <MyEditor
              height="100%"
              defaultLanguage="liquid"
              defaultValue={selectedGenerator.template?.body || ""}
              onChange={updateGeneratorTemplate}
            />
          </SplitterPanel>
          <SplitterPanel>{codeBlockToShow()}</SplitterPanel>
        </Splitter>
      </div>

      {showManageGeneratorDialog && (
        <ManageGeneratorDialog
          data={dialogData}
          onDelete={deleteGenerator}
          onSubmit={saveNewGenerator}
          onClose={() => setShowManageGeneratorDialog(false)}
          show={showManageGeneratorDialog}
        />
      )}
    </>
  );
}

export default Codes;
