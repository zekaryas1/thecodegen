import { Menu } from "primereact/menu";
import { useRouter } from "next/router";
import { classNames } from "primereact/utils";
import { MouseEventHandler } from "react";
import GeoPattern from "geopattern";
import Image from "next/image";
import dynamic from "next/dynamic";

import { Tree } from "primereact/tree";

function SideNav() {
  const router = useRouter();

  const paths = router.pathname.split("/");
  const currentPath = paths[paths.length - 1];
  const { projectId } = router.query;

  type MenuInput = {
    label: string;
    icon: string;
    destination: string;
  };

  const MenuHeader = (
    <div className="flex h-7rem relative justify-content-center border-bottom-1 surface-border">
      <Image
        src="/images/spaceship.webp"
        alt="logo"
        fill={true}
        objectFit="contain"
        className="h-7rem"
      />
    </div>
  );

  const isActive = (label: string) => {
    return currentPath.toLowerCase() == label.toLowerCase();
  };

  const getJson = ({ label, icon, destination }: MenuInput) => {
    return {
      label: label,
      command: () => {
        router.push(`/project/${projectId}/${destination}`);
      },
      template: (
        item: {
          command: MouseEventHandler<HTMLParagraphElement>;
          label: string;
        },
        options: { className: string }
      ) => {
        const isCurrent = isActive(item.label);
        return (
          <p
            style={{ alignItems: "start" }}
            onClick={item.command}
            className={classNames(
              "flex gap-2 pl-3",
              options.className,
              isCurrent ? "bg-gray-900 font-bold" : "font-italic"
            )}
          >
            <i className={`pi ${icon}`}></i>
            {item.label}
          </p>
        );
      },
    };
  };

  const items = [
    {
      items: [
        {
          label: "Codegen",
          template: () => {
            return MenuHeader;
          },
        },
        getJson({
          label: "Entities",
          icon: "pi-database",
          destination: "entities",
        }),
        getJson({
          label: "Codes",
          icon: "pi-code",
          destination: "codes",
        }),
        getJson({
          label: "Members",
          icon: "pi-users",
          destination: "members",
        }),
      ],
    },
  ];

  return (
    <Menu
      //@ts-ignore
      model={items}
      style={{
        boxShadow: "0 8px 12px 0 rgba(159, 168, 218, 0.27)",
        backdropFilter: "blur( 4px )",
      }}
      className="h-full border-none border-noround"
    />
  );
}

// export default SideNav;

//   <Tree
//     filter
//     filterMode="lenient"
//     filterPlaceholder="Lenient Filter"
//     value={[
//       {
//         key: "0",
//         label: "Trumba",
//         data: "Documents Folder",
//         icon: "pi pi-fw pi-folder",
//         children: [
//           {
//             key: "0-0",
//             label: "Entities",
//             data: "Work Folder",
//             icon: "pi pi-fw pi-folder",
//             children: [
//               {
//                 key: "0-0-0",
//                 label: "Expenses.doc",
//                 icon: "pi pi-fw pi-database",
//                 data: "Expenses Document",
//               },
//               {
//                 key: "0-0-1",
//                 label: "Resume.doc",
//                 icon: "pi pi-fw pi-database",
//                 data: "Resume Document",
//               },
//             ],
//           },
//           {
//             key: "0-1",
//             label: "Templates",
//             data: "Home Folder",
//             icon: "pi pi-fw pi-folder",
//             children: [
//               {
//                 key: "0-1-0",
//                 label: "Invoices.txt",
//                 icon: "pi pi-fw pi-file",
//                 data: "Invoices for this month",
//               },
//             ],
//           },
//         ],
//       },
//     ]}
//     className="h-full w-20rem border-none border-noround shadow-4"
//   />
// );
