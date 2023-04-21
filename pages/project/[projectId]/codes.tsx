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

function Codes() {
  const router = useRouter();
  const { projectId } = router.query;

  const {
    data: generators,
    isLoading,
    mutate,
  } = useSWR(GeneratorService.getBaseUrl(projectId));
  const { data: entities } = useSWR(EntityService.getBaseUrl(projectId));

  const [showManageGeneratorDialog, setShowManageGeneratorDialog] =
    useState(false);
  const [selectedGenerator, setSelectedGenerator] = useState<Generator>({});
  const [selectedEntity, setSelectedEntity] = useState<Entity>({});

  const [dialogData, setDialogData] = useState<Generator>({});

  const [template, setTemplate] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  const toast = useRef(null);

  useEffect(() => {
    setSelectedGenerator((prevState) => {
      return {
        ...prevState,
        template: {
          ...prevState.template,
          body: template,
        },
      };
    });
  }, [template]);

  const saveNewGenerator = useCallback(
    async (newGenerator: Generator) => {
      if (newGenerator.id) {
        await GeneratorService.update(newGenerator, projectId);
        mutate();
      } else {
        const response = await GeneratorService.create(
          newGenerator,
          projectId
        ).then((res) => res.data);
        mutate({ ...generators, response });
      }
    },
    [generators, mutate, projectId]
  );

  const updateTemplate = useCallback(
    async (newTemplate: Template) => {
      const res = await TemplateService.update(
        {
          ...newTemplate,
          body: template,
        },
        projectId
      );

      if (res.statusText == "OK") {
        show({
          severity: "success",
          summary: "Template saved",
          detail: "",
        });
        mutate();
      } else {
        show({
          severity: "error",
          summary: "Template can not be saved",
          detail: "Something went wrong",
        });
      }
    },
    [mutate, projectId, template]
  );

  const show = (message: {
    severity: "success" | "error";
    summary: string;
    detail: string;
  }) => {
    //@ts-ignore
    toast.current.show(message);
  };

  const deleteGenerator = useCallback(
    async (id: string) => {
      const response = await GeneratorService.delete(id, projectId);
      if (response.statusText == "OK") {
        setSelectedGenerator({});
        mutate({ ...generators.data.filter((it: Generator) => it.id != id) });
      }
    },
    [generators, mutate, projectId]
  );

  const openGeneratorDialogWith = (generator: Generator) => {
    setDialogData(generator);
    setShowManageGeneratorDialog(true);
  };

  const openGeneratorForNew = useCallback(
    () => openGeneratorDialogWith({}),
    []
  );
  const openGeneratorForUpdate = useCallback(
    () => openGeneratorDialogWith(selectedGenerator),
    [selectedGenerator]
  );
  const hideManageGeneratorDialog = useCallback(
    () => setShowManageGeneratorDialog(false),
    []
  );

  const regenerateResult = (template: string, entity: Entity) => {
    if (template) {
      engine
        .parseAndRender(template, {
          name: entity.name,
          columns: entity.columns,
        })
        .then((value) => {
          setGeneratedCode(value);
        });
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <CodesToolBar
        currentEntity={selectedEntity}
        currentGenerator={selectedGenerator}
        addClick={openGeneratorForNew}
        manageClick={openGeneratorForUpdate}
        updateCurrentEntity={setSelectedEntity}
        updateTemplate={() => {
          selectedGenerator.template &&
            updateTemplate(selectedGenerator.template);
        }}
        regenerateResult={() => regenerateResult(template, selectedEntity)}
        listOfEntities={entities?.data || []}
      />
      <Divider />

      <div className="grid h-screen p-2 mb-4">
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
              height="100vh"
              defaultLanguage="liquid"
              defaultValue={selectedGenerator.template?.body || ""}
              onChange={(value) => {
                setTemplate(value || "");
              }}
            />
          </SplitterPanel>
          <SplitterPanel>
            <MyEditor
              height="100vh"
              defaultLanguage={
                selectedGenerator.name?.split(".")[1] || "liquid"
              }
              defaultValue={generatedCode}
            />
          </SplitterPanel>
        </Splitter>
      </div>

      {showManageGeneratorDialog && (
        <ManageGeneratorDialog
          data={dialogData}
          onDelete={deleteGenerator}
          onSubmit={saveNewGenerator}
          onClose={hideManageGeneratorDialog}
          show={showManageGeneratorDialog}
        />
      )}
    </>
  );
}

export default Codes;
