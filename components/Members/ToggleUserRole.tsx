import { Button } from "primereact/button";
import { myConfirmPopUp } from "../MyConfirmPopup";
import { UserRole } from "../../lib/models/User";

interface ToggleRoleProps {
  oldRole: UserRole;
  onClick: (newRole: UserRole) => void;
}

const MakeAdmin = ({ onClick }: Pick<ToggleRoleProps, "onClick">) => {
  return (
    <Button
      className="p-button-sm p-button-text"
      icon="pi pi-arrow-up"
      title="Upgrade role to Admin"
      label="Admin"
      onClick={(event) => {
        myConfirmPopUp({
          event: event,
          acceptCallBack: () => onClick(UserRole.ADMIN),
        });
      }}
    />
  );
};

const MakeUser = ({ onClick }: Pick<ToggleRoleProps, "onClick">) => {
  return (
    <Button
      className="p-button-sm p-button-text"
      icon="pi pi-arrow-down"
      title="Downgrade role to User"
      label="User"
      onClick={(event) => {
        myConfirmPopUp({
          event: event,
          acceptCallBack: () => onClick(UserRole.USER),
        });
      }}
    />
  );
};

const ToggleRole = ({ oldRole, onClick }: ToggleRoleProps) => {
  if (oldRole == UserRole.USER) {
    return <MakeAdmin onClick={onClick} />;
  } else if (oldRole == UserRole.ADMIN) {
    return <MakeUser onClick={onClick} />;
  }
  return null;
};

export default ToggleRole;
