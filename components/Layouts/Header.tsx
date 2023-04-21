import { Button } from "primereact/button";
import { useSession } from "next-auth/react";
import { Divider } from "primereact/divider";
import { SelectButton } from "primereact/selectbutton";

export interface DestinationType {
  label: string;
  icon: string;
}

interface Props {
  onTitleClick?: () => void;
  onDestionationsClick?: (destination: string) => void;
  listOfDestinations?: DestinationType[];
  currentDestination?: DestinationType;
  title: string;
  subTitle: string;
}

function Header({
  title,
  subTitle,
  onTitleClick,
  onDestionationsClick,
  listOfDestinations,
  currentDestination,
}: Props) {
  const { data: session } = useSession();

  const destinationsTemplate = (option: any) => {
    return (
      <Button
        className="p-button-sm p-0 p-button-text"
        label={option.label}
        icon={option.icon}
      />
    );
  };

  return (
    <>
      <div className="px-4 pt-4 mr-3 flex justify-content-between align-items-end">
        <div>
          <h2
            className="mb-1 cursor-pointer text-primary"
            onClick={onTitleClick}
          >
            {title} - <span>{session?.user?.name || ""}</span>
          </h2>
          <p className="text-gray-500">{subTitle}</p>
        </div>
        <SelectButton
          value={currentDestination}
          dataKey="label"
          onChange={(e) => {
            onDestionationsClick &&
              e.value &&
              onDestionationsClick(e.value.label);
          }}
          itemTemplate={destinationsTemplate}
          options={listOfDestinations || []}
        />
      </div>
      <Divider className="w-8 m-auto mt-3 mb-3" />
    </>
  );
}

export default Header;
