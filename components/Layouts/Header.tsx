import { Button } from "primereact/button";
import { useSession } from "next-auth/react";
import { Divider } from "primereact/divider";
import { SelectButton } from "primereact/selectbutton";
import { GLOBAL_STYLES } from "../../lib/fixed";

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

  const onSelectButtonChange = (e: { value: { label: string } }) => {
    onDestionationsClick && e.value && onDestionationsClick(e.value.label);
  };

  return (
    <div style={GLOBAL_STYLES.forHeaderPattern}>
      <div className="px-4 pt-4 flex justify-content-between align-items-end">
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
          onChange={onSelectButtonChange}
          itemTemplate={destinationsTemplate}
          options={listOfDestinations || []}
        />
      </div>
      <Divider className="w-8 m-auto my-3" />
    </div>
  );
}

export default Header;
